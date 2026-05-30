import Link from "next/link";
import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getBaseUrl } from "../../_lib/getBaseUrl";

export const dynamic = "force-dynamic";

type ExpertService = {
  id: string;
  name: string;
  durationMinutes: number;
  priceIdr: number;
  modes: Array<"online" | "in_person">;
};

type ExpertProfile = {
  id: string;
  name: string;
  category: string;
  location: string;
  services: ExpertService[];
};

type ExpertResponse =
  | { ok: true; expert: ExpertProfile; generatedAt: string }
  | { ok: false; error: string; message: string };

type Slot = {
  id: string;
  expertId: string;
  serviceId: string;
  mode: "online" | "in_person";
  startAt: string;
  endAt: string;
  available: boolean;
};

type SlotsResponse = {
  ok: boolean;
  query: {
    expertId: string;
    serviceId: string;
    date: string;
    mode: "online" | "in_person";
  };
  durationMinutes: number;
  timezone: string;
  slots: Slot[];
  generatedAt: string;
};

async function getExpert(expertId: string) {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/clinic/experts/${expertId}`, {
    cache: "no-store",
  });
  return { res, data: (await res.json()) as ExpertResponse };
}

async function getSlots(params: {
  expertId: string;
  serviceId: string;
  date: string;
  mode: "online" | "in_person";
}) {
  const baseUrl = await getBaseUrl();
  const url = new URL(`${baseUrl}/api/clinic/booking/slots`);
  url.searchParams.set("expertId", params.expertId);
  url.searchParams.set("serviceId", params.serviceId);
  url.searchParams.set("date", params.date);
  url.searchParams.set("mode", params.mode);

  const res = await fetch(url, { cache: "no-store" });
  return (await res.json()) as SlotsResponse;
}

function formatPriceIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

const EXPERT_IDS = ["dr-001", "ex-002"] as const;

export default async function ClinicBookingPage({
  searchParams,
}: {
  searchParams?: {
    expertId?: string;
    serviceId?: string;
    date?: string;
    mode?: "online" | "in_person";
  };
}) {
  const requestedExpertId = searchParams?.expertId ?? "dr-001";
  const requestedDate = searchParams?.date ?? "2026-06-01";
  const requestedMode = searchParams?.mode ?? "in_person";

  const expertResult = await getExpert(requestedExpertId);

  const services =
    expertResult.res.ok && expertResult.data.ok === true
      ? expertResult.data.expert.services
      : [];

  const fallbackServiceId = services[0]?.id ?? "svc-derm-001";
  const requestedServiceId = searchParams?.serviceId ?? fallbackServiceId;
  const activeServiceId =
    services.length === 0 || services.some((svc) => svc.id === requestedServiceId)
      ? requestedServiceId
      : fallbackServiceId;

  const slotsData = await getSlots({
    expertId: requestedExpertId,
    serviceId: activeServiceId,
    date: requestedDate,
    mode: requestedMode,
  });

  return (
    <PageShell
      title="Clinic · Booking"
      description="Pilih slot booking untuk service tertentu (mock)."
    >
      <SectionCrumb href="/clinic" label="← Kembali ke PRD-006 Clinic" />

      <form className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              Expert
            </span>
            <select
              name="expertId"
              defaultValue={requestedExpertId}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600"
            >
              {EXPERT_IDS.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
              {!EXPERT_IDS.includes(requestedExpertId as (typeof EXPERT_IDS)[number]) ? (
                <option value={requestedExpertId}>{requestedExpertId}</option>
              ) : null}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              Service
            </span>
            {services.length > 0 ? (
              <select
                name="serviceId"
                defaultValue={activeServiceId}
                className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600"
              >
                {services.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.id}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="serviceId"
                defaultValue={activeServiceId}
                className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600"
              />
            )}
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">Date</span>
            <input
              name="date"
              type="date"
              defaultValue={requestedDate}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">Mode</span>
            <select
              name="mode"
              defaultValue={requestedMode}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600"
            >
              <option value="in_person">in_person</option>
              <option value="online">online</option>
            </select>
          </label>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            Refresh slots
          </button>
          <Link
            href={`/clinic/experts/${encodeURIComponent(requestedExpertId)}`}
            className="text-sm text-zinc-700 hover:underline dark:text-zinc-200"
          >
            Lihat profile expert
          </Link>
        </div>
      </form>

      {expertResult.res.ok && expertResult.data.ok === true ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            {expertResult.data.expert.name}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {expertResult.data.expert.category} · {expertResult.data.expert.location}
          </div>
          {services.length > 0 ? (
            <div className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
              Service dipilih:{" "}
              <span className="font-mono">{activeServiceId}</span>{" "}
              {services.find((svc) => svc.id === activeServiceId) ? (
                <>
                  ·{" "}
                  <span className="font-mono">
                    {services.find((svc) => svc.id === activeServiceId)!.durationMinutes}{" "}
                    min
                  </span>{" "}
                  ·{" "}
                  <span className="font-mono">
                    {formatPriceIdr(
                      services.find((svc) => svc.id === activeServiceId)!.priceIdr,
                    )}
                  </span>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
          {expertResult.data.ok === false
            ? expertResult.data.message
            : "Gagal memuat data expert."}
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Query:{" "}
          <span className="font-mono text-zinc-950 dark:text-zinc-50">
            {slotsData.query.expertId}
          </span>{" "}
          ·{" "}
          <span className="font-mono text-zinc-950 dark:text-zinc-50">
            {slotsData.query.serviceId}
          </span>{" "}
          ·{" "}
          <span className="font-mono text-zinc-950 dark:text-zinc-50">
            {slotsData.query.date}
          </span>{" "}
          ·{" "}
          <span className="font-mono text-zinc-950 dark:text-zinc-50">
            {slotsData.query.mode}
          </span>{" "}
          · duration{" "}
          <span className="font-mono text-zinc-950 dark:text-zinc-50">
            {slotsData.durationMinutes}m
          </span>{" "}
          · tz{" "}
          <span className="font-mono text-zinc-950 dark:text-zinc-50">
            {slotsData.timezone}
          </span>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {slotsData.slots.map((slot) => (
            <div
              key={slot.id}
              className={[
                "rounded-lg border p-3 text-sm",
                slot.available
                  ? "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                  : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400",
              ].join(" ")}
            >
              <div className="font-mono text-xs">{slot.id}</div>
              <div className="mt-1 font-mono">
                {slot.startAt} → {slot.endAt}
              </div>
              <div className="mt-1 text-xs">
                {slot.available ? "Available" : "Unavailable"}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Generated:{" "}
          <span className="font-mono text-zinc-950 dark:text-zinc-50">
            {slotsData.generatedAt}
          </span>
        </div>
      </div>
    </PageShell>
  );
}
