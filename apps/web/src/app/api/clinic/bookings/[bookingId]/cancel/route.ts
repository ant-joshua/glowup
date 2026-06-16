import type { NextRequest } from "next/server";

import { getExpertProfile, getExpertService } from "../../../_experts";
import { normalizeText, readClinicStore, writeClinicStore } from "../../../../../_lib/clinicStore";

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
  const reason =
    body && typeof body === "object"
      ? normalizeText((body as Record<string, unknown>).reason, 200)
      : null;

  const store = await readClinicStore();
  const booking = store.bookings.find((b) => b.id === bookingId) ?? null;
  if (!booking) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (booking.status !== "confirmed") {
    return Response.json({ ok: false, error: "invalid_state" }, { status: 409 });
  }

  const ts = Date.parse(booking.startAt);
  if (Number.isFinite(ts) && ts - Date.now() < 12 * 60 * 60 * 1000 && !reason) {
    return Response.json({ ok: false, error: "reason_required" }, { status: 409 });
  }

  const nextBookings = store.bookings.map((b) =>
    b.id === bookingId ? { ...b, status: "cancelled" as const, cancelReason: reason ?? b.cancelReason ?? null } : b,
  );
  const saved = await writeClinicStore({ ...store, bookings: nextBookings });

  const updated = saved.bookings.find((b) => b.id === bookingId) ?? booking;

  return Response.json({
    ok: true,
    booking: enrichBooking(updated),
    updatedAt: saved.updatedAt,
  });
}
