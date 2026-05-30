import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getBaseUrl } from "../../_lib/getBaseUrl";

export const dynamic = "force-dynamic";

type Goal = {
  id: string;
  title: string;
  category: string;
  summary: string;
  primaryMetric: string;
  target: { from: number; to: number; unit: string };
};

type GoalsResponse = {
  ok: boolean;
  goals: Goal[];
  recommendedGoalIds: string[];
  selectedGoalId: string | null;
  generatedAt: string;
};

async function getGoals() {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/intelligence/goals`, {
    cache: "no-store",
  });
  return (await res.json()) as GoalsResponse;
}

export default async function IntelligenceGoalsPage() {
  const data = await getGoals();

  return (
    <PageShell
      title="Intelligence · Goals"
      description="Daftar goals transformasi (mock)."
    >
      <SectionCrumb
        href="/intelligence"
        label="← Kembali ke PRD-005 Intelligence"
      />
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Generated:{" "}
        <span className="font-mono text-zinc-950 dark:text-zinc-50">
          {data.generatedAt}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {data.goals.map((goal) => {
          const selected = goal.id === data.selectedGoalId;
          const recommended = data.recommendedGoalIds.includes(goal.id);

          return (
            <div
              key={goal.id}
              className={[
                "rounded-xl border bg-white p-4 dark:bg-zinc-950",
                selected
                  ? "border-emerald-300 dark:border-emerald-800"
                  : "border-zinc-200 dark:border-zinc-800",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {goal.title}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    {goal.category} ·{" "}
                    <span className="font-mono">{goal.id}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs">
                  {selected ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200">
                      Selected
                    </span>
                  ) : null}
                  {!selected && recommended ? (
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                      Recommended
                    </span>
                  ) : null}
                </div>
              </div>

              <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
                {goal.summary}
              </p>

              <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
                Metric:{" "}
                <span className="font-mono text-zinc-950 dark:text-zinc-50">
                  {goal.primaryMetric}
                </span>{" "}
                · Target:{" "}
                <span className="font-mono text-zinc-950 dark:text-zinc-50">
                  {goal.target.from} → {goal.target.to} {goal.target.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
