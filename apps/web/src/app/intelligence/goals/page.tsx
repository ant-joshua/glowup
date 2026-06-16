import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getBaseUrl } from "../../_lib/getBaseUrl";
import { GoalsClient } from "./GoalsClient";

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
  updatedAt: string;
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
        {" · "}
        Updated:{" "}
        <span className="font-mono text-zinc-950 dark:text-zinc-50">
          {data.updatedAt}
        </span>
      </div>

      <GoalsClient
        goals={data.goals}
        recommendedGoalIds={data.recommendedGoalIds}
        selectedGoalId={data.selectedGoalId}
      />
    </PageShell>
  );
}
