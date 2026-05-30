import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";

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
      description="Profil creator + stats dari mock API."
    >
      <SectionCrumb href="/creator" label="← Kembali ke PRD-002 Creator" />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium">
                {data.creator.displayName}{" "}
                {data.creator.verified ? (
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    (verified)
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                @{data.creator.username}
              </div>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Updated: {new Date(data.creator.updatedAt).toLocaleString("id-ID")}
            </div>
          </div>
          <div className="mt-4 text-sm text-zinc-700 dark:text-zinc-200">
            {data.creator.bio}
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">Followers</dt>
              <dd className="mt-1 font-semibold tabular-nums">{data.creator.stats.followers}</dd>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">Following</dt>
              <dd className="mt-1 font-semibold tabular-nums">{data.creator.stats.following}</dd>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">Routines</dt>
              <dd className="mt-1 font-semibold tabular-nums">{data.creator.stats.routines}</dd>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">Collections</dt>
              <dd className="mt-1 font-semibold tabular-nums">{data.creator.stats.collections}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm font-medium">Links</div>
          <ul className="mt-3 space-y-2 text-sm">
            {Object.entries(data.creator.links)
              .filter(([, value]) => Boolean(value))
              .map(([key, value]) => (
                <li
                  key={key}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="text-zinc-600 dark:text-zinc-400">{key}</span>
                  <a
                    href={value ?? undefined}
                    className="truncate font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {value}
                  </a>
                </li>
              ))}
          </ul>
          {Object.values(data.creator.links).every((v) => !v) ? (
            <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Tidak ada link.
            </div>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}
