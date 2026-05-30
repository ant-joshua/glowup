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

const SERVICE_DURATION_MINUTES: Record<string, number> = {
  "svc-derm-001": 30,
  "svc-derm-002": 60,
  "svc-fit-001": 60,
  "svc-fit-002": 60,
};

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const expertId = searchParams.get("expertId") ?? "dr-001";
  const serviceId = searchParams.get("serviceId") ?? "svc-derm-001";
  const date = searchParams.get("date") ?? "2026-06-01";
  const mode = (searchParams.get("mode") ?? "in_person") as
    | "online"
    | "in_person";

  const durationMinutes = SERVICE_DURATION_MINUTES[serviceId] ?? 30;
  const startTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  const slots = startTimes.map((startTime, index) => {
    const endTime = addMinutes(startTime, durationMinutes);
    const available = !(expertId === "dr-001" && date === "2026-06-01" && index === 2);

    return {
      id: `slot-${date}-${startTime.replace(":", "")}`,
      expertId,
      serviceId,
      mode,
      startAt: `${date}T${startTime}:00+07:00`,
      endAt: `${date}T${endTime}:00+07:00`,
      available,
    };
  });

  return Response.json({
    ok: true,
    query: { expertId, serviceId, date, mode },
    durationMinutes,
    timezone: "Asia/Jakarta",
    slots,
    generatedAt: "2026-05-30T00:00:00.000Z",
  });
}
