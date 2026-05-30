import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getRequestOrigin } from "../../_lib/requestOrigin";

type VideoItem = {
  id: string;
  title: string;
  platform: string;
  status: string;
  durationSec: number;
  createdAt: string;
  assets: { thumbnailUrl: string; videoUrl: string | null };
};

type VideosResponse = {
  ok: boolean;
  query: { status: string };
  items: VideoItem[];
  total: number;
  updatedAt: string;
};

const STATUSES = ["", "draft", "rendering", "published"] as const;

function normalizeParam(value: string | string[] | undefined) {
  if (!value) {
    return "";
  }
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

export default async function AiStudioVideosPage({
  searchParams,
}: {
  searchParams?: { status?: string | string[] };
}) {
  const status = normalizeParam(searchParams?.status).trim().toLowerCase();
  const origin = await getRequestOrigin();
  const url = new URL("/api/ai-studio/videos", origin);
  if (status) {
    url.searchParams.set("status", status);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = (await res.json()) as VideosResponse;

  return (
    <PageShell
      title="AI Studio · Videos"
      description="Daftar video dari mock API PRD-004."
    >
      <SectionCrumb href="/ai-studio" label="← Kembali ke PRD-004 AI Studio" />
      <form className="flex flex-wrap items-end gap-3" method="get">
        <div className="flex flex-col gap-1">
          <label
            className="text-sm text-zinc-600 dark:text-zinc-400"
            htmlFor="status"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-zinc-700"
          >
            {STATUSES.map((value) => (
              <option key={value || "all"} value={value}>
                {value ? value : "Semua"}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          Terapkan
        </button>
        <div className="ml-auto text-sm text-zinc-600 dark:text-zinc-400">
          Total:{" "}
          <span className="font-medium text-zinc-950 dark:text-zinc-50">
            {data.total}
          </span>
        </div>
      </form>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.items.map((video) => (
          <div
            key={video.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{video.title}</div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {video.platform} · {video.status} · {video.durationSec}s
                </div>
              </div>
              <div className="shrink-0 text-xs text-zinc-600 dark:text-zinc-400">
                {new Date(video.createdAt).toLocaleDateString("id-ID")}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                ID {video.id}
              </span>
              {video.assets.videoUrl ? (
                <a
                  href={video.assets.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-zinc-200 px-2 py-1 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  Video URL
                </a>
              ) : (
                <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                  Video belum tersedia
                </span>
              )}
              <a
                href={video.assets.thumbnailUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-zinc-200 px-2 py-1 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                Thumbnail URL
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Updated: <span className="font-mono">{data.updatedAt}</span>
      </div>
    </PageShell>
  );
}
