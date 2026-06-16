import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";
import { RoutinesClient } from "./RoutinesClient";

type CreatorRoutinesResponse = {
  ok: boolean;
  routines: Array<{
    id: string;
    creatorId: string;
    title: string;
    description: string;
    category: string;
    targetAudience: string[];
    difficulty: string;
    budgetRangeIdr: { min: number; max: number };
    durationDays: number;
    steps: Array<{ id: string; title: string; timeOfDay: string; notes: string }>;
    products: Array<{ id: string; type: string; name: string; affiliateUrl: string | null }>;
    expectedOutcome: string[];
    status: "draft" | "published";
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function CreatorRoutinesPage() {
  const data = await fetchMockJson<CreatorRoutinesResponse>("/api/creator/routines");

  return (
    <PageShell
      title="Creator · Routines"
      description="Create and manage routines (persisted di mock store)."
    >
      <SectionCrumb href="/creator" label="← Kembali ke PRD-002 Creator" />
      <RoutinesClient routines={data.routines} />
    </PageShell>
  );
}
