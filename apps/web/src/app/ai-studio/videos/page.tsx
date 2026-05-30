import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getRequestOrigin } from "../../_lib/requestOrigin";
import { GenerateVideoClient } from "./GenerateVideoClient";
import Link from "next/link";

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
      title="AI Studio Playground"
      description="A reusable video playground for future skincare steps, outfit generation, and virtual try-on motion."
    >
      <SectionCrumb href="/ai-studio" label="← Kembali ke PRD-004 AI Studio" />
      <GenerateVideoClient />
      <section className="grid gap-3 md:grid-cols-3">
        {[
          {
            href: "/ai-studio/videos/skincare",
            title: "Skincare Studio",
            description:
              "Prototype guided skincare-step videos with focused defaults.",
          },
          {
            href: "/ai-studio/videos/outfit",
            title: "Outfit Studio",
            description:
              "Test outfit generator storytelling with a dedicated fashion surface.",
          },
          {
            href: "/ai-studio/videos/try-on",
            title: "Try-On Studio",
            description:
              "Study movement and reveal prompts for future user try-on videos.",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[1.6rem] bg-surface-container-lowest p-5 shadow-ambient-sm transition hover:bg-surface"
          >
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-secondary">
              Dedicated Route
            </p>
            <h2 className="mt-3 font-serif text-2xl text-on-surface">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-on-surface/75">
              {item.description}
            </p>
          </Link>
        ))}
      </section>
      <section className="rounded-[2rem] bg-surface-container-low p-6 shadow-ambient sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-secondary">
              Render Archive
            </p>
            <h2 className="mt-3 font-serif text-3xl text-on-surface">
              Review recent jobs and keep the playground grounded in real
              output.
            </h2>
          </div>

          <form className="flex flex-wrap items-end gap-3" method="get">
            <label className="grid gap-2" htmlFor="status">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                Status
              </span>
              <select
                id="status"
                name="status"
                defaultValue={status}
                className="min-h-12 rounded-[1rem] bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition focus:bg-surface focus:ring-2 focus:ring-primary/20"
              >
                {STATUSES.map((value) => (
                  <option key={value || "all"} value={value}>
                    {value ? value : "All"}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="min-h-12 rounded-[1rem] bg-surface-container-lowest px-5 py-3 text-sm font-semibold text-on-surface shadow-ambient-sm transition hover:bg-surface"
            >
              Apply filter
            </button>
            <div className="ml-auto rounded-full bg-surface px-4 py-3 text-sm text-secondary">
              Total{" "}
              <span className="font-semibold text-on-surface">
                {items.length}
              </span>
            </div>
          </form>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {items.map((job) => (
            <div key={job.id} className="rounded-[1.6rem] bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-serif text-2xl text-on-surface">
                    {job.templateId}
                  </div>
                  <div className="mt-2 text-sm text-secondary">
                    {job.status}
                  </div>
                </div>
                <div className="shrink-0 rounded-full bg-surface-container-low px-3 py-2 text-xs uppercase tracking-[0.18em] text-secondary">
                  {new Date(job.createdAt).toLocaleDateString("en-US")}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-secondary">
                <span className="rounded-full bg-surface-container-low px-3 py-2 uppercase tracking-[0.16em]">
                  ID {job.id}
                </span>
                {job.progress ? (
                  <span className="rounded-full bg-surface-container-low px-3 py-2 uppercase tracking-[0.16em]">
                    Clips {job.progress.doneClips}/{job.progress.totalClips}
                  </span>
                ) : null}
                {job.output?.clips?.some((clip) => clip.output?.videoUrl) ? (
                  <a
                    href={
                      job.output.clips.find((clip) => clip.output?.videoUrl)
                        ?.output?.videoUrl ?? ""
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-surface-container-low px-3 py-2 font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-surface-container"
                  >
                    Open first clip
                  </a>
                ) : (
                  <span className="rounded-full bg-surface-container-low px-3 py-2 uppercase tracking-[0.16em]">
                    No clip yet
                  </span>
                )}
                {job.error?.message ? (
                  <span className="rounded-full bg-primary/8 px-3 py-2 uppercase tracking-[0.16em] text-primary">
                    {job.error.message}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
