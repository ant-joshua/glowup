import { notFound } from "next/navigation";

import { PageShell } from "../../../../_components/PageShell";
import { SectionCrumb } from "../../../../_components/SectionCrumb";
import { fetchMockJson } from "../../../../_lib/mockApi";
import { RoutineEditorClient } from "../../new/RoutineEditorClient";

type CreatorProfileResponse = {
  ok: boolean;
  creator: { username: string };
};

type CreatorRoutinesResponse = {
  ok: boolean;
  routines: Array<{ id: string; title: string; category: string }>;
};

type RoutineResponse = {
  ok: boolean;
  routine: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    durationDays: number;
    targetAudience: string[];
    budgetRangeIdr: { min: number; max: number };
    steps: Array<{ id: string; title: string; timeOfDay: string; notes: string }>;
    products: Array<{ id: string; type: string; name: string; affiliateUrl: string | null }>;
    expectedOutcome: string[];
  };
};

export const dynamic = "force-dynamic";

export default async function CreatorRoutineEditPage({
  params,
}: {
  params: Promise<{ routineId: string }>;
}) {
  const { routineId } = await params;
  const [profile, routines, routineData] = await Promise.all([
    fetchMockJson<CreatorProfileResponse>("/api/creator/profile"),
    fetchMockJson<CreatorRoutinesResponse>("/api/creator/routines"),
    fetchMockJson<RoutineResponse>(`/api/creator/routines/${routineId}`),
  ]);

  if (!routineData?.routine) notFound();

  const categoryHints = Array.from(new Set(routines.routines.map((r) => r.category)));

  return (
    <PageShell title="Creator · Edit Routine" description="Edit existing routine (persisted di mock store).">
      <SectionCrumb href="/creator/routines" label="← Back to routines" />
      <RoutineEditorClient
        creatorUsername={profile.creator.username}
        categoryHints={categoryHints.length ? categoryHints : ["skincare"]}
        existingTitles={routines.routines.map((r) => r.title)}
        routineId={routineData.routine.id}
        initialDraft={{
          title: routineData.routine.title,
          description: routineData.routine.description,
          category: routineData.routine.category,
          difficulty: routineData.routine.difficulty,
          durationDays: routineData.routine.durationDays,
          targetAudience: routineData.routine.targetAudience,
          budgetRangeIdr: routineData.routine.budgetRangeIdr,
          steps: routineData.routine.steps,
          products: routineData.routine.products,
          expectedOutcome: routineData.routine.expectedOutcome,
        }}
      />
    </PageShell>
  );
}

