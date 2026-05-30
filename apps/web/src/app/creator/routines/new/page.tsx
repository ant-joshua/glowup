import { PageShell } from "../../../_components/PageShell";
import { SectionCrumb } from "../../../_components/SectionCrumb";
import { fetchMockJson } from "../../../_lib/mockApi";
import { RoutineEditorClient } from "./RoutineEditorClient";

type CreatorProfileResponse = {
  ok: boolean;
  creator: { username: string };
};

type CreatorRoutinesResponse = {
  ok: boolean;
  routines: Array<{ id: string; title: string; category: string }>;
};

export const dynamic = "force-dynamic";

export default async function CreatorRoutineEditorPage() {
  const [profile, routines] = await Promise.all([
    fetchMockJson<CreatorProfileResponse>("/api/creator/profile"),
    fetchMockJson<CreatorRoutinesResponse>("/api/creator/routines"),
  ]);

  const categoryHints = Array.from(new Set(routines.routines.map((r) => r.category)));

  return (
    <PageShell
      title="Creator · Routine Editor"
      description="Form minimal + preview (mock), dan konsumsi data referensi dari mock API."
    >
      <SectionCrumb href="/creator" label="← Kembali ke PRD-002 Creator" />
      <RoutineEditorClient
        creatorUsername={profile.creator.username}
        categoryHints={categoryHints.length ? categoryHints : ["skincare"]}
        existingTitles={routines.routines.map((r) => r.title)}
      />
    </PageShell>
  );
}
