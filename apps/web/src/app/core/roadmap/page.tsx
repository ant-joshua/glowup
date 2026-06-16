import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";
import { RoadmapClient } from "./RoadmapClient";

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
  const [roadmapData, progressData] = await Promise.all([
    fetchMockJson<CoreRoadmapResponse>("/api/core/roadmap"),
    fetchMockJson<{
      ok: boolean;
      progress: {
        userId: string;
        summary: unknown;
        entries: Array<{ date: string; completedActionIds: string[] }>;
      };
    }>("/api/core/progress"),
  ]);

  const date = new Date().toISOString().slice(0, 10);
  const today = progressData.progress.entries.find((e) => e.date === date);
  const completedActionIds = today?.completedActionIds ?? [];

  return (
    <PageShell
      title="Core · Roadmap"
      description="Roadmap transformasi yang bisa ditandai selesai (persisted di mock store)."
    >
      <SectionCrumb href="/core" label="← Kembali ke PRD-001 Core" />
      <RoadmapClient
        roadmap={roadmapData.roadmap}
        date={date}
        completedActionIds={completedActionIds}
      />
    </PageShell>
  );
}
