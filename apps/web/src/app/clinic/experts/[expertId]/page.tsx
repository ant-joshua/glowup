import Link from "next/link";
import { PageShell } from "../../../_components/PageShell";
import { SectionCrumb } from "../../../_components/SectionCrumb";
import { getBaseUrl } from "../../../_lib/getBaseUrl";

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
  experienceYears: number;
  bio: string;
  verificationStatus: "unverified" | "verified" | "professional" | "premium" | "partner";
  rating: number;
  reviewCount: number;
  services: ExpertService[];
  highlights: string[];
};

type ExpertResponse =
  | { ok: true; expert: ExpertProfile; generatedAt: string }
  | { ok: false; error: string; message: string };

async function getExpert(expertId: string) {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/clinic/experts/${expertId}`, {
    cache: "no-store",
  });
  return { res, data: (await res.json()) as ExpertResponse };
}

function formatPriceIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ClinicExpertProfilePage({
  params,
}: {
  params: { expertId: string };
}) {
  const { res, data } = await getExpert(params.expertId);

  return (
    <PageShell
      title="Clinic · Expert Profile"
      description="Detail expert (mock)."
    >
      <SectionCrumb href="/clinic" label="← Kembali ke PRD-006 Clinic" />

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Expert ID:{" "}
        <span className="font-mono text-zinc-950 dark:text-zinc-50">
          {params.expertId}
        </span>
      </div>

      {!res.ok || data.ok !== true ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
          {data.ok === false ? data.message : "Gagal memuat data expert."}
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-col gap-1">
              <div className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                {data.expert.name}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {data.expert.category} · {data.expert.location} ·{" "}
                <span className="font-mono">
                  {data.expert.experienceYears}y exp
                </span>{" "}
                · verif{" "}
                <span className="font-mono">{data.expert.verificationStatus}</span>{" "}
                · rating <span className="font-mono">{data.expert.rating}</span>{" "}
                (<span className="font-mono">{data.expert.reviewCount}</span>{" "}
                review)
              </div>
            </div>

            <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
              {data.expert.bio}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Services
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {data.expert.services.map((svc) => (
                <div
                  key={svc.id}
                  className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {svc.name}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="font-mono">{svc.id}</span> ·{" "}
                        <span className="font-mono">{svc.durationMinutes} min</span>{" "}
                        ·{" "}
                        <span className="font-mono">{formatPriceIdr(svc.priceIdr)}</span>{" "}
                        · mode{" "}
                        <span className="font-mono">{svc.modes.join(", ")}</span>
                      </div>
                    </div>
                    <Link
                      href={`/clinic/booking?expertId=${encodeURIComponent(
                        data.expert.id,
                      )}&serviceId=${encodeURIComponent(svc.id)}`}
                      className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                    >
                      Cek slot
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Highlights
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.expert.highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Generated:{" "}
            <span className="font-mono text-zinc-950 dark:text-zinc-50">
              {data.generatedAt}
            </span>
          </div>
        </>
      )}
    </PageShell>
  );
}
