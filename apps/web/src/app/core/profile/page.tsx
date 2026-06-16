import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";
import { ProfileClient } from "./ProfileClient";

type CoreProfileResponse = {
  ok: boolean;
  user: {
    id: string;
    name: string;
    age: number;
    gender: string;
    heightCm: number;
    weightKg: number;
    occupation: string;
    budgetMonthlyIdr: number;
  };
  goals: Array<{ id: string; label: string }>;
  updatedAt: string;
};

export const dynamic = "force-dynamic";

export default async function CoreProfilePage() {
  const data = await fetchMockJson<CoreProfileResponse>("/api/core/profile");

  return (
    <PageShell
      title="Core · Profile"
      description="Baseline user + goals (editable, persisted di mock store)."
    >
      <SectionCrumb href="/core" label="← Kembali ke PRD-001 Core" />
      <ProfileClient user={data.user} goals={data.goals} updatedAt={data.updatedAt} />
    </PageShell>
  );
}
