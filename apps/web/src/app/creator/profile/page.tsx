import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";
import { ProfileClient } from "./ProfileClient";

type CreatorProfileResponse = {
  ok: boolean;
  creator: {
    id: string;
    userId: string;
    username: string;
    displayName: string;
    bio: string;
    verified: boolean;
    avatar: { url: string; blurhash: string };
    links: {
      instagram: string | null;
      tiktok: string | null;
      youtube: string | null;
      website: string | null;
    };
    stats: {
      followers: number;
      following: number;
      routines: number;
      collections: number;
    };
    updatedAt: string;
  };
};

export const dynamic = "force-dynamic";

export default async function CreatorProfilePage() {
  const data = await fetchMockJson<CreatorProfileResponse>("/api/creator/profile");

  return (
    <PageShell
      title="Creator · Profile"
      description="Creator identity + public links (editable, persisted di mock store)."
    >
      <SectionCrumb href="/creator" label="← Kembali ke PRD-002 Creator" />
      <ProfileClient creator={data.creator} />
    </PageShell>
  );
}
