import { getExpertProfile, getExpertService } from "../_experts";
import {
  createBooking,
  normalizeId,
  normalizeMode,
  normalizeText,
  readClinicStore,
  writeClinicStore,
} from "../../../_lib/clinicStore";
import { generateSlots, parseSlotId, slotIdFrom } from "../booking/_slots";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scopeRaw = (searchParams.get("scope") ?? "upcoming").toLowerCase();
  const scope = scopeRaw === "upcoming" || scopeRaw === "history" || scopeRaw === "all" ? scopeRaw : "upcoming";

  const store0 = await readClinicStore();
  const now = Date.now();
  let changed = false;
  const nextBookingsAll = store0.bookings.map((booking) => {
    const remindersIn = Array.isArray(booking.reminders) ? booking.reminders : [];
    let bookingChanged = false;
    const reminders = remindersIn.map((r) => {
      const scheduledTs = Date.parse(r.scheduledAt);
      if (r.status === "scheduled" && Number.isFinite(scheduledTs) && scheduledTs <= now) {
        bookingChanged = true;
        return { ...r, status: "sent" as const, sentAt: r.scheduledAt };
      }
      return r;
    });
    if (!bookingChanged) return booking;
    changed = true;
    return { ...booking, reminders };
  });

  const store = changed ? await writeClinicStore({ ...store0, bookings: nextBookingsAll }) : store0;

  const bookings = store.bookings
    .filter((booking) => booking.userId === "usr_0001")
    .filter((booking) => {
      if (scope === "all") return true;
      const ts = Date.parse(booking.startAt);
      const isUpcoming = booking.status === "confirmed" && Number.isFinite(ts) && ts >= now;
      if (scope === "upcoming") return isUpcoming;
      return !isUpcoming;
    })
    .sort((a, b) => {
      const ta = Date.parse(a.startAt);
      const tb = Date.parse(b.startAt);
      if (!Number.isFinite(ta) || !Number.isFinite(tb)) return 0;
      return scope === "history" ? tb - ta : ta - tb;
    })
    .map(enrichBooking);

  return Response.json({
    ok: true,
    scope,
    userId: "usr_0001",
    bookings,
    updatedAt: store.updatedAt,
  });
}

export async function POST(request: Request) {
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
  const expertId = normalizeId(rec.expertId);
  const serviceId = normalizeId(rec.serviceId);
  const mode = normalizeMode(rec.mode);
  const slotId = normalizeId(rec.slotId);
  const holdId = normalizeId(rec.holdId);
  const contactName = normalizeText(rec.contactName, 80);
  const contactPhone = normalizeText(rec.contactPhone, 30);
  const notes = normalizeText(rec.notes, 500);

  if (!expertId || !serviceId || !mode || !slotId) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const expert = getExpertProfile(expertId);
  const service = getExpertService(expertId, serviceId);
  if (!expert || !service) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (!service.modes.includes(mode)) {
    return Response.json(
      { ok: false, error: "invalid_mode", message: "Mode tidak tersedia untuk service ini." },
      { status: 400 },
    );
  }

  const parsedSlot = parseSlotId(slotId);
  if (!parsedSlot) {
    return Response.json({ ok: false, error: "invalid_slot_id" }, { status: 400 });
  }

  const unavailableSlotIds =
    expertId === "dr-001" && parsedSlot.date === "2026-06-01"
      ? new Set<string>([slotIdFrom(parsedSlot.date, "11:00")])
      : new Set<string>();

  const slots = generateSlots({
    expertId,
    serviceId,
    date: parsedSlot.date,
    mode,
    durationMinutes: service.durationMinutes,
    unavailableSlotIds,
  });

  const slot = slots.find((s) => s.id === slotId) ?? null;
  if (!slot || !slot.available) {
    return Response.json({ ok: false, error: "slot_unavailable" }, { status: 409 });
  }

  const store = await readClinicStore();
  const now2 = Date.now();
  const activeHolds = store.holds.filter((h) => Date.parse(h.expiresAt) > now2);
  const userId = "usr_0001";

  if (holdId) {
    const hold = activeHolds.find((h) => h.id === holdId) ?? null;
    if (
      !hold ||
      hold.userId !== userId ||
      hold.expertId !== expertId ||
      hold.serviceId !== serviceId ||
      hold.mode !== mode ||
      hold.slotId !== slotId
    ) {
      return Response.json({ ok: false, error: "invalid_hold" }, { status: 409 });
    }
  } else {
    const conflictHold = activeHolds.find(
      (h) => h.expertId === expertId && h.mode === mode && h.slotId === slotId && h.userId !== userId,
    );
    if (conflictHold) {
      return Response.json({ ok: false, error: "slot_held" }, { status: 409 });
    }
  }
  const conflict = store.bookings.some(
    (b) =>
      b.status === "confirmed" &&
      b.expertId === expertId &&
      b.mode === mode &&
      b.startAt === slot.startAt,
  );
  if (conflict) {
    return Response.json({ ok: false, error: "slot_reserved" }, { status: 409 });
  }

  const booking = createBooking({
    userId,
    expertId,
    serviceId,
    mode,
    slotId,
    startAt: slot.startAt,
    endAt: slot.endAt,
    contactName,
    contactPhone,
    notes,
  });

  const saved = await writeClinicStore({
    ...store,
    bookings: [...store.bookings, booking].slice(-2000),
    holds: holdId ? activeHolds.filter((h) => h.id !== holdId).slice(-3000) : activeHolds.slice(-3000),
  });

  return Response.json({
    ok: true,
    booking: enrichBooking(booking),
    updatedAt: saved.updatedAt,
  });
}
