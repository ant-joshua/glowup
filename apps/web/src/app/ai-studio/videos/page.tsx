import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getRequestOrigin } from "../../_lib/requestOrigin";
import { GenerateVideoClient } from "./GenerateVideoClient";

type JobOutput = {
  clips?: Array<{
    id: string;
    sceneIndex: number;
    sceneTotal: number;
    durationSec: number;
    status: string;
    output?: { videoUrl?: string; thumbnailUrl?: string };
  }>;
};

type JobItem = {
  id: string;
  createdAt: string;
  templateId: string;
  status: string;
  startedAt?: string;
  finishedAt?: string;
  progress?: { totalClips: number; doneClips: number };
  output?: JobOutput;
  error?: { message: string };
};

type JobsResponse = {
  ok: boolean;
  items: JobItem[];
};

const STATUSES = ["", "queued", "running", "succeeded", "failed"] as const;

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
  const url = new URL("/api/ai-studio/jobs", origin);
  if (status) {
    url.searchParams.set("status", status);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = (await res.json()) as JobsResponse;
  const items = Array.isArray(data.items) ? data.items : [];

  return (
    <PageShell
      title="AI Studio · Videos"
      description="Generate video via PixVerse worker dan lihat status job."
    >
      <SectionCrumb href="/ai-studio" label="← Kembali ke PRD-004 AI Studio" />
      <GenerateVideoClient />
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
            {items.length}
          </span>
        </div>
      </form>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((job) => (
          <div
            key={job.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{job.templateId}</div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {job.status}
                </div>
              </div>
              <div className="shrink-0 text-xs text-zinc-600 dark:text-zinc-400">
                {new Date(job.createdAt).toLocaleDateString("id-ID")}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                ID {job.id}
              </span>
              {job.progress ? (
                <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                  Clips {job.progress.doneClips}/{job.progress.totalClips}
                </span>
              ) : null}
              {job.output?.clips?.some((c) => c.output?.videoUrl) ? (
                <a
                  href={
                    job.output.clips.find((c) => c.output?.videoUrl)?.output?.videoUrl ?? ""
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-zinc-200 px-2 py-1 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  Buka clip pertama
                </a>
              ) : (
                <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                  Belum ada clip
                </span>
              )}
              {job.error?.message ? (
                <span className="rounded-md border border-red-200 px-2 py-1 text-red-700 dark:border-red-900/50 dark:text-red-300">
                  {job.error.message}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
