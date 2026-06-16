import type { NextRequest } from "next/server";

import { getExpertProfile, getExpertService } from "../../../_experts";
import { createRemindersForBooking, normalizeId, readClinicStore, writeClinicStore } from "../../../../../_lib/clinicStore";
import { generateSlots, parseSlotId, slotIdFrom } from "../../../booking/_slots";

function enrichBooking(booking: Awaited<ReturnType<typeof readClinicStore>>["bookings"][number]) {
  const expert = getExpertProfile(booking.expertId);
  const service = getExpertService(booking.expertId, booking.serviceId);

  return {
    ...booking,
    expert: expert
      ? { id: expert.id, name: expert.name, category: expert.category, location: expert.location }
      : null,
    service: service
      ? {
          id: service.id,
          name: service.name,
          durationMinutes: service.durationMinutes,
          priceIdr: service.priceIdr,
        }
      : null,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const { bookingId } = await params;

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const rec = body as Record<string, unknown>;
  const slotId = normalizeId(rec.slotId);
  const holdId = normalizeId(rec.holdId);
  if (!slotId) {
    return Response.json({ ok: false, error: "invalid_slot_id" }, { status: 400 });
  }

  const store = await readClinicStore();
  const booking = store.bookings.find((b) => b.id === bookingId) ?? null;
  if (!booking) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (booking.status !== "confirmed") {
    return Response.json({ ok: false, error: "invalid_state" }, { status: 409 });
  }

  const now = Date.now();
  const currentStart = Date.parse(booking.startAt);
  if (Number.isFinite(currentStart) && currentStart - now < 24 * 60 * 60 * 1000) {
    return Response.json({ ok: false, error: "reschedule_locked" }, { status: 409 });
  }

  const service = getExpertService(booking.expertId, booking.serviceId);
  if (!service) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const parsedSlot = parseSlotId(slotId);
  if (!parsedSlot) {
    return Response.json({ ok: false, error: "invalid_slot_id" }, { status: 400 });
  }

  const unavailableSlotIds =
    booking.expertId === "dr-001" && parsedSlot.date === "2026-06-01"
      ? new Set<string>([slotIdFrom(parsedSlot.date, "11:00")])
      : new Set<string>();

  const slots = generateSlots({
    expertId: booking.expertId,
    serviceId: booking.serviceId,
    date: parsedSlot.date,
    mode: booking.mode,
    durationMinutes: service.durationMinutes,
    unavailableSlotIds,
  });
  const slot = slots.find((s) => s.id === slotId) ?? null;
  if (!slot || !slot.available) {
    return Response.json({ ok: false, error: "slot_unavailable" }, { status: 409 });
  }

  const activeHolds = store.holds.filter((h) => Date.parse(h.expiresAt) > now);
  const userId = "usr_0001";
  if (holdId) {
    const hold = activeHolds.find((h) => h.id === holdId) ?? null;
    if (
      !hold ||
      hold.userId !== userId ||
      hold.expertId !== booking.expertId ||
      hold.serviceId !== booking.serviceId ||
      hold.mode !== booking.mode ||
      hold.slotId !== slotId
    ) {
      return Response.json({ ok: false, error: "invalid_hold" }, { status: 409 });
    }
  } else {
    const conflictHold = activeHolds.find(
      (h) => h.expertId === booking.expertId && h.mode === booking.mode && h.slotId === slotId && h.userId !== userId,
    );
    if (conflictHold) {
      return Response.json({ ok: false, error: "slot_held" }, { status: 409 });
    }
  }

  const conflict = store.bookings.some(
    (b) =>
      b.id !== bookingId &&
      b.status === "confirmed" &&
      b.expertId === booking.expertId &&
      b.mode === booking.mode &&
      b.startAt === slot.startAt,
  );
  if (conflict) {
    return Response.json({ ok: false, error: "slot_reserved" }, { status: 409 });
  }

  const nextBookings = store.bookings.map((b) =>
    b.id === bookingId
      ? {
          ...b,
          slotId,
          startAt: slot.startAt,
          endAt: slot.endAt,
          reminders: createRemindersForBooking({ bookingId, startAt: slot.startAt }),
        }
      : b,
  );
  const saved = await writeClinicStore({
    ...store,
    bookings: nextBookings,
    holds: holdId ? activeHolds.filter((h) => h.id !== holdId) : activeHolds,
  });
  const updated = saved.bookings.find((b) => b.id === bookingId) ?? booking;

  return Response.json({ ok: true, booking: enrichBooking(updated), updatedAt: saved.updatedAt });
}
