import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";

type AnalysisSummaryResponse = {
  ok: boolean;
  analysis: {
    id: string;
    userId: string;
    createdAt: string;
    confidencePct: number;
    faceShape: string;
    skin: { type: string; concerns: string[] };
    hair: { density: string; concerns: string[] };
    style: { vibe: string; notes: string[] };
    scores: Record<string, number>;
    highlights: string[];
  };
};

export const dynamic = "force-dynamic";

export default async function CoreAnalysisPage() {
  const data = await fetchMockJson<AnalysisSummaryResponse>("/api/core/analysis-summary");

  const scoreEntries = Object.entries(data.analysis.scores).filter(([key]) => key !== "overall");

  return (
    <PageShell
      title="Core · AI Analysis"
      description="Ringkasan analisis + skor dari mock API."
    >
      <SectionCrumb href="/core" label="← Kembali ke PRD-001 Core" />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-baseline justify-between gap-3">
            <div className="text-sm font-medium">Skor Overall</div>
            <div className="text-2xl font-semibold tabular-nums">
              {data.analysis.scores.overall}
            </div>
          </div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Confidence: {data.analysis.confidencePct}%
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Face shape</div>
              <div className="mt-1 font-medium">{data.analysis.faceShape}</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Style vibe</div>
              <div className="mt-1 font-medium">{data.analysis.style.vibe}</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Skin</div>
              <div className="mt-1 font-medium">
                {data.analysis.skin.type}
              </div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                {data.analysis.skin.concerns.join(", ")}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Hair</div>
              <div className="mt-1 font-medium">
                {data.analysis.hair.density}
              </div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                {data.analysis.hair.concerns.join(", ")}
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            Generated: {new Date(data.analysis.createdAt).toLocaleString("id-ID")}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm font-medium">Highlights</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
            {data.analysis.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-sm font-medium">Breakdown Skor</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {scoreEntries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="text-zinc-600 dark:text-zinc-400">{key}</div>
              <div className="font-medium tabular-nums">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Notes: {data.analysis.style.notes.join(" · ")}
        </div>
      </div>
    </PageShell>
  );
}
