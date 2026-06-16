import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";
import { FeedClient } from "./FeedClient";

type CreatorFeedResponse = {
  ok: boolean;
  feed: {
    type: string;
    cursor: string | null;
    items: Array<{
      id: string;
      type: string;
      creator: { id: string; username: string; displayName: string; verified: boolean };
      createdAt: string;
      updatedAt: string;
      text: string;
      routine?: { id: string; title: string; durationDays: number };
      media: Array<{ kind: string; url: string }>;
      metrics: { likes: number; comments: number; saves: number; shares: number };
      tags: string[];
      viewer?: { liked: boolean; saved: boolean };
      status: "draft" | "published";
      publishedAt: string | null;
    }>;
  };
};

export const dynamic = "force-dynamic";

export default async function CreatorFeedPage() {
  const [feed, profile, routines] = await Promise.all([
    fetchMockJson<CreatorFeedResponse>("/api/creator/feed?scope=all"),
    fetchMockJson<{ ok: boolean; creator: { username: string; displayName: string; avatar: { url: string } } }>(
      "/api/creator/profile",
    ),
    fetchMockJson<{ ok: boolean; routines: Array<{ id: string; title: string; durationDays: number }> }>(
      "/api/creator/routines",
    ),
  ]);

  return (
    <PageShell
      title="Creator · Feed"
      description="Create posts and interact with your feed (persisted di mock store)."
    >
      <SectionCrumb href="/creator" label="← Kembali ke PRD-002 Creator" />
      <FeedClient
        initialItems={feed.feed.items}
        routines={routines.routines}
        creator={{
          username: profile.creator.username,
          displayName: profile.creator.displayName,
          avatarUrl: profile.creator.avatar.url,
        }}
      />
    </PageShell>
  );
}
