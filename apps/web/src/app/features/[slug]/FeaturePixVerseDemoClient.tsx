"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type JobClip = {
  id: string;
  sceneIndex: number;
  sceneTotal: number;
  sceneTitle: string;
  durationSec: number;
  status: string;
  output?: { videoUrl?: string; thumbnailUrl?: string };
  error?: { message?: string };
};

type Job = {
  id: string;
  templateId: string;
  status: string;
  createdAt: string;
  progress?: { totalClips: number; doneClips: number };
  output?: { clips?: JobClip[] };
  error?: { message?: string };
};

type CreateResponse = { ok: boolean; job?: Job; error?: string };
type JobResponse = { ok: boolean; job?: Job; error?: string };

export function FeaturePixVerseDemoClient({
  templateId,
  variables,
}: {
  templateId: string;
  variables: Record<string, unknown>;
}) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = useMemo(() => !loading, [loading]);

  useEffect(() => {
    if (!job) return;
    if (job.status !== "queued" && job.status !== "running") return;

    let cancelled = false;
    const timer = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/ai-studio/jobs/${encodeURIComponent(job.id)}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as JobResponse;
        if (!res.ok || data.ok !== true || !data.job) return;
        if (cancelled) return;
        setJob(data.job);
        if (data.job.status === "succeeded" || data.job.status === "failed") {
          window.clearInterval(timer);
        }
      } catch {
      }
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [job]);

  async function onGenerate() {
    if (!canGenerate) return;
    setError(null);
    setLoading(true);
    setJob(null);

    try {
      const res = await fetch("/api/ai-studio/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ templateId, variables }),
      });
      let data: CreateResponse | null = null;
      try {
        data = (await res.json()) as CreateResponse;
      } catch {
        data = null;
      }

      if (!data) {
        setError("Server error. Pastikan pixverse-worker berjalan di localhost:4107.");
        return;
      }

      if (!res.ok || data.ok !== true || !data.job) {
        if (data.error === "worker_unreachable") {
          setError("Worker tidak bisa diakses. Jalankan pixverse-worker di localhost:4107.");
          return;
        }
        setError(data.error ?? "Gagal membuat job.");
        return;
      }
      setJob(data.job);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-4xl border border-outline/30 bg-surface-container-lowest p-6 shadow-ambient-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="font-serif text-2xl tracking-tight text-on-surface">
            Generate demo clips
          </div>
          <div className="text-sm leading-6 text-secondary">
            1 clip per scene (5–10 detik). Setelah selesai, kamu bisa gabungkan di editor.
          </div>
        </div>
        <Button onClick={onGenerate} disabled={!canGenerate}>
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {error ? <div className="mt-4 text-sm text-destructive">{error}</div> : null}

      {job ? (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full border-0 bg-surface-container-high">
              {job.status}
            </Badge>
            {job.progress ? (
              <span className="text-sm text-secondary">
                {job.progress.doneClips}/{job.progress.totalClips} clips
              </span>
            ) : null}
          </div>

          {Array.isArray(job.output?.clips) ? (
            <div className="grid gap-3">
              {job.output?.clips.map((clip) => (
                <div
                  key={clip.id}
                  className="rounded-3xl border border-outline/25 bg-surface p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-on-surface">
                        Scene {clip.sceneIndex}/{clip.sceneTotal} · {clip.durationSec}s
                      </div>
                      <div className="mt-1 text-sm text-secondary">{clip.sceneTitle}</div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="rounded-full border-0 bg-surface-container-high"
                    >
                      {clip.status}
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {clip.output?.videoUrl ? (
                      <a
                        href={clip.output.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-outline/30 bg-surface px-4 py-2 font-semibold text-secondary hover:text-primary"
                      >
                        Video URL
                      </a>
                    ) : null}
                    {clip.output?.thumbnailUrl ? (
                      <a
                        href={clip.output.thumbnailUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-outline/30 bg-surface px-4 py-2 font-semibold text-secondary hover:text-primary"
                      >
                        Poster
                      </a>
                    ) : null}
                    {clip.error?.message ? (
                      <span className="text-sm text-destructive">{clip.error.message}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {job.error?.message ? (
            <div className="text-sm text-destructive">{job.error.message}</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
