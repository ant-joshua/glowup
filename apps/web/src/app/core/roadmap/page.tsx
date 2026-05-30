import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";

type CoreRoadmapResponse = {
  ok: boolean;
  roadmap: {
    id: string;
    userId: string;
    horizonDays: number;
    generatedAt: string;
    weeks: Array<{
      week: number;
      focus: string;
      actions: Array<{ id: string; title: string; cadence: string }>;
    }>;
  };
};

export const dynamic = "force-dynamic";

export default async function CoreRoadmapPage() {
  const data = await fetchMockJson<CoreRoadmapResponse>("/api/core/roadmap");

  return (
    <PageShell
      title="Core · Roadmap"
      description="Roadmap transformasi (milestones mingguan) dari mock API."
    >
      <SectionCrumb href="/core" label="← Kembali ke PRD-001 Core" />

      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="text-sm font-medium">Ringkasan</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Horizon: {data.roadmap.horizonDays} hari · Generated:{" "}
            {new Date(data.roadmap.generatedAt).toLocaleString("id-ID")}
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {data.roadmap.weeks.map((week) => (
          <div
            key={week.week}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-sm font-medium">Week {week.week}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {week.focus}
              </div>
            </div>
            <ul className="mt-3 space-y-2">
              {week.actions.map((action) => (
                <li
                  key={action.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    {action.cadence}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
