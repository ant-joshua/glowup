import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";

type CoreProgressResponse = {
  ok: boolean;
  progress: {
    userId: string;
    summary: {
      startDate: string;
      endDate: string;
      roadmapCompletionPct: number;
      transformationScoreDelta: number;
      weightKgDelta: number;
    };
    entries: Array<{
      date: string;
      weightKg: number;
      transformationScore: number;
      completedActionIds: string[];
    }>;
  };
};

export const dynamic = "force-dynamic";

export default async function CoreProgressPage() {
  const data = await fetchMockJson<CoreProgressResponse>("/api/core/progress");

  return (
    <PageShell
      title="Core · Progress"
      description="Ringkasan progres + histori entry dari mock API."
    >
      <SectionCrumb href="/core" label="← Kembali ke PRD-001 Core" />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Roadmap completion</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">
            {data.progress.summary.roadmapCompletionPct}%
          </div>
          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            {data.progress.summary.startDate} → {data.progress.summary.endDate}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Score delta</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">
            {data.progress.summary.transformationScoreDelta >= 0 ? "+" : ""}
            {data.progress.summary.transformationScoreDelta}
          </div>
          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Periode yang sama</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Weight delta</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">
            {data.progress.summary.weightKgDelta >= 0 ? "+" : ""}
            {data.progress.summary.weightKgDelta} kg
          </div>
          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Periode yang sama</div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-sm font-medium">Histori</div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 dark:text-zinc-400">
                <th className="px-3 py-1">Tanggal</th>
                <th className="px-3 py-1">Berat (kg)</th>
                <th className="px-3 py-1">Skor</th>
                <th className="px-3 py-1">Actions selesai</th>
              </tr>
            </thead>
            <tbody>
              {data.progress.entries.map((entry) => (
                <tr
                  key={entry.date}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <td className="px-3 py-2 font-medium">{entry.date}</td>
                  <td className="px-3 py-2 tabular-nums">{entry.weightKg}</td>
                  <td className="px-3 py-2 tabular-nums">{entry.transformationScore}</td>
                  <td className="px-3 py-2 tabular-nums">{entry.completedActionIds.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
