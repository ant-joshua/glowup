function toMinutes(timeHHmm: string) {
  const [hh, mm] = timeHHmm.split(":");
  return Number(hh) * 60 + Number(mm);
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function addMinutes(timeHHmm: string, deltaMinutes: number) {
  const total = toMinutes(timeHHmm) + deltaMinutes;
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${pad2(hh)}:${pad2(mm)}`;
}

export type Slot = {
  id: string;
  expertId: string;
  serviceId: string;
  mode: "online" | "in_person";
  startAt: string;
  endAt: string;
  available: boolean;
};

export function parseSlotId(slotId: string) {
  const match = /^slot-(\d{4}-\d{2}-\d{2})-(\d{4})$/.exec(slotId);
  if (!match) return null;
  const date = match[1] ?? "";
  const hhmm = match[2] ?? "";
  const hh = hhmm.slice(0, 2);
  const mm = hhmm.slice(2);
  if (!hh || !mm) return null;
  return { date, startTime: `${hh}:${mm}` };
}

export function slotIdFrom(date: string, startTime: string) {
  return `slot-${date}-${startTime.replace(":", "")}`;
}

export function generateSlots(input: {
  expertId: string;
  serviceId: string;
  date: string;
  mode: "online" | "in_person";
  durationMinutes: number;
  unavailableSlotIds?: Set<string>;
}) {
  const startTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
  const blocked = input.unavailableSlotIds ?? new Set<string>();

  return startTimes.map((startTime) => {
    const endTime = addMinutes(startTime, input.durationMinutes);
    const id = slotIdFrom(input.date, startTime);

    return {
      id,
      expertId: input.expertId,
      serviceId: input.serviceId,
      mode: input.mode,
      startAt: `${input.date}T${startTime}:00+07:00`,
      endAt: `${input.date}T${endTime}:00+07:00`,
      available: !blocked.has(id),
    } satisfies Slot;
  });
}

