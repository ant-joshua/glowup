import Link from "next/link";
import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getBaseUrl } from "../../_lib/getBaseUrl";

export const dynamic = "force-dynamic";

type Recommendation = {
  id: string;
  domain:
    | "skincare"
    | "hair"
    | "fashion"
    | "fitness"
    | "nutrition"
    | "grooming"
    | "branding";
  title: string;
  rationale: string;
  impact: "low" | "medium" | "high";
  cost: "low" | "medium" | "high";
  difficulty: "easy" | "moderate" | "hard";
  timeRequiredMinutesPerWeek: number;
  nextActions: Array<{ id: string; label: string; cadence: string }>;
};

type RecommendationsResponse = {
  ok: boolean;
  filters: { domain: string | null };
  recommendations: Recommendation[];
  generatedAt: string;
};

const DOMAINS: Recommendation["domain"][] = [
  "skincare",
  "fitness",
  "fashion",
  "branding",
  "hair",
  "nutrition",
  "grooming",
];

async function getRecommendations(domain: string | undefined) {
  const baseUrl = await getBaseUrl();
  const url = new URL(`${baseUrl}/api/intelligence/recommendations`);
  if (domain != null && domain.length > 0) url.searchParams.set("domain", domain);

  const res = await fetch(url, { cache: "no-store" });
  return (await res.json()) as RecommendationsResponse;
}

export default async function IntelligenceRecommendationsPage({
  searchParams,
}: {
  searchParams?: { domain?: string };
}) {
  const data = await getRecommendations(searchParams?.domain);

  return (
    <PageShell
      title="Intelligence · Recommendations"
      description="Rekomendasi personal yang bisa ditindaklanjuti (mock)."
    >
      <SectionCrumb
        href="/intelligence"
        label="← Kembali ke PRD-005 Intelligence"
      />

      <div className="flex flex-col gap-2">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Filter domain:{" "}
          <span className="font-mono text-zinc-950 dark:text-zinc-50">
            {data.filters.domain ?? "all"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/intelligence/recommendations"
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            All
          </Link>
          {DOMAINS.map((domain) => (
            <Link
              key={domain}
              href={`/intelligence/recommendations?domain=${encodeURIComponent(domain)}`}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              {domain}
            </Link>
          ))}
        </div>
      </div>

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Generated:{" "}
        <span className="font-mono text-zinc-950 dark:text-zinc-50">
          {data.generatedAt}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {data.recommendations.map((rec) => (
          <div
            key={rec.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-col gap-1">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                {rec.title}
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                <span className="font-mono">{rec.id}</span> ·{" "}
                <span className="font-mono">{rec.domain}</span> · impact{" "}
                <span className="font-mono">{rec.impact}</span> · cost{" "}
                <span className="font-mono">{rec.cost}</span> · difficulty{" "}
                <span className="font-mono">{rec.difficulty}</span>
              </div>
            </div>

            <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
              {rec.rationale}
            </p>

            <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
              Time required:{" "}
              <span className="font-mono text-zinc-950 dark:text-zinc-50">
                {rec.timeRequiredMinutesPerWeek} min/minggu
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                Next actions
              </div>
              <div className="flex flex-wrap gap-2">
                {rec.nextActions.map((action) => (
                  <span
                    key={action.id}
                    className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  >
                    {action.label} ·{" "}
                    <span className="font-mono">{action.cadence}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
