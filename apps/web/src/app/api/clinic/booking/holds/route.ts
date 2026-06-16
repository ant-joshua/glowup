import { getExpertProfile, getExpertService } from "../../_experts";
import { normalizeId, normalizeMode, readClinicStore, writeClinicStore } from "../../../../_lib/clinicStore";
import { generateSlots, parseSlotId, slotIdFrom } from "../_slots";

function nowIso() {
  return new Date().toISOString();
}

function newHoldId() {
  return `hold_${Date.now()}`;
}

const HOLD_TTL_MS = 5 * 60 * 1000;

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
  if (!expertId || !serviceId || !mode || !slotId) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const expert = getExpertProfile(expertId);
  const service = getExpertService(expertId, serviceId);
  if (!expert || !service) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (!service.modes.includes(mode)) {
    return Response.json({ ok: false, error: "invalid_mode" }, { status: 400 });
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
  const now = Date.now();
  const holds = store.holds.filter((h) => Date.parse(h.expiresAt) > now);

  const reservedSlotIds = new Set(
    store.bookings
      .filter((b) => b.status === "confirmed" && b.expertId === expertId && b.mode === mode)
      .map((b) => b.slotId),
  );
  if (reservedSlotIds.has(slotId)) {
    return Response.json({ ok: false, error: "slot_reserved" }, { status: 409 });
  }

  const userId = "usr_0001";
  const conflictHold = holds.find(
    (h) => h.expertId === expertId && h.mode === mode && h.slotId === slotId && h.userId !== userId,
  );
  if (conflictHold) {
    return Response.json({ ok: false, error: "slot_held" }, { status: 409 });
  }

  const existing = holds.find(
    (h) =>
      h.userId === userId &&
      h.expertId === expertId &&
      h.serviceId === serviceId &&
      h.mode === mode &&
      h.slotId === slotId,
  );

  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + HOLD_TTL_MS).toISOString();
  const hold = existing
    ? { ...existing, expiresAt }
    : { id: newHoldId(), userId, expertId, serviceId, mode, slotId, createdAt, expiresAt };

  const saved = await writeClinicStore({
    ...store,
    holds: [...holds.filter((h) => h.id !== hold.id), hold].slice(-3000),
  });

  return Response.json({
    ok: true,
    hold,
    slot: { id: slot.id, startAt: slot.startAt, endAt: slot.endAt, available: true },
    updatedAt: saved.updatedAt,
  });
}

