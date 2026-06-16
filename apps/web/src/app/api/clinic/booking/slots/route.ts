import { getExpertService } from "../../_experts";
import { readClinicStore } from "../../../../_lib/clinicStore";
import { generateSlots, slotIdFrom } from "../_slots";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const expertId = searchParams.get("expertId") ?? "dr-001";
  const serviceId = searchParams.get("serviceId") ?? "svc-derm-001";
  const date = searchParams.get("date") ?? "2026-06-01";
  const mode = (searchParams.get("mode") ?? "in_person") as
    | "online"
    | "in_person";

  const durationMinutes = getExpertService(expertId, serviceId)?.durationMinutes ?? 30;

  const unavailableSlotIds =
    expertId === "dr-001" && date === "2026-06-01"
      ? new Set<string>([slotIdFrom(date, "11:00")])
      : new Set<string>();

  const store = await readClinicStore();
  const now = Date.now();
  const activeHolds = store.holds.filter((h) => Date.parse(h.expiresAt) > now);
  const reservedSlotIds = new Set(
    store.bookings
      .filter((b) => b.status === "confirmed" && b.expertId === expertId && b.mode === mode)
      .map((b) => b.slotId),
  );
  const heldSlotIds = new Set(
    activeHolds
      .filter((h) => h.expertId === expertId && h.mode === mode)
      .map((h) => h.slotId),
  );

  const slots = generateSlots({
    expertId,
    serviceId,
    date,
    mode,
    durationMinutes,
    unavailableSlotIds,
  }).map((slot) => ({
    ...slot,
    available: slot.available && !reservedSlotIds.has(slot.id) && !heldSlotIds.has(slot.id),
  }));

  return Response.json({
    ok: true,
    query: { expertId, serviceId, date, mode },
    durationMinutes,
    timezone: "Asia/Jakarta",
    slots,
    generatedAt: "2026-05-30T00:00:00.000Z",
  });
}
