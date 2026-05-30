import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";

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
      text: string;
      routine?: { id: string; title: string; durationDays: number };
      media: Array<{ kind: string; url: string }>;
      metrics: { likes: number; comments: number; saves: number; shares: number };
      tags: string[];
    }>;
  };
};

export const dynamic = "force-dynamic";

export default async function CreatorFeedPage() {
  const data = await fetchMockJson<CreatorFeedResponse>("/api/creator/feed");

  return (
    <PageShell
      title="Creator · Feed"
      description="Timeline konten dari mock API."
    >
      <SectionCrumb href="/creator" label="← Kembali ke PRD-002 Creator" />
      <div className="grid gap-3">
        {data.feed.items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-sm font-medium">
                {item.creator.displayName}{" "}
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  @{item.creator.username}
                  {item.creator.verified ? " · verified" : ""}
                </span>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {new Date(item.createdAt).toLocaleString("id-ID")}
              </div>
            </div>

            <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">{item.text}</div>

            {item.routine ? (
              <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Routine</div>
                <div className="mt-1 font-medium">
                  {item.routine.title}{" "}
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    ({item.routine.durationDays} hari)
                  </span>
                </div>
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                {item.type}
              </span>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                media {item.media.length}
              </span>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                likes {item.metrics.likes}
              </span>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                saves {item.metrics.saves}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {item.media.length ? (
              <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                Media url: {item.media[0]?.url}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </PageShell>
  );
}
