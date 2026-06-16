import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";
import { ProgressClient } from "./ProgressClient";

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
  const [progressData, roadmapData] = await Promise.all([
    fetchMockJson<CoreProgressResponse>("/api/core/progress"),
    fetchMockJson<{
      ok: boolean;
      roadmap: { weeks: Array<{ actions: Array<{ id: string; title: string; cadence: string }> }> };
    }>("/api/core/roadmap"),
  ]);

  const actions = roadmapData.roadmap.weeks.flatMap((w) => w.actions);

  return (
    <PageShell
      title="Core · Progress"
      description="Check-in progres + histori entry (persisted di mock store)."
    >
      <SectionCrumb href="/core" label="← Kembali ke PRD-001 Core" />
      <ProgressClient
        summary={progressData.progress.summary}
        entries={progressData.progress.entries}
        actions={actions}
      />
    </PageShell>
  );
}
