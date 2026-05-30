"use client";

import { useEffect, useMemo, useState } from "react";

type TemplateField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "list";
  required?: boolean;
  options?: string[];
};

type Template = {
  id: string;
  title: string;
  description: string;
  fields: TemplateField[];
};

type TemplatesResponse = {
  ok: boolean;
  items?: Template[];
};

type JobClip = {
  id: string;
  sceneIndex: number;
  sceneTotal: number;
  sceneTitle: string;
  durationSec: number;
  status: string;
  output?: { videoId?: number; videoUrl?: string; thumbnailUrl?: string };
  error?: { message?: string };
};

type JobOutput = {
  clips?: JobClip[];
};

type Job = {
  id: string;
  templateId: string;
  status: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  progress?: { totalClips: number; doneClips: number };
  output?: JobOutput;
  error?: { message: string };
};

type CreateJobResponse = {
  ok: boolean;
  job?: Job;
  error?: string;
};

type JobResponse = {
  ok: boolean;
  job?: Job;
  error?: string;
};

function initValues(t: Template | null) {
  const next: Record<string, string> = {};
  if (!t) return next;
  for (const field of t.fields) {
    if (field.type === "select") {
      next[field.key] = field.options?.[0] ?? "";
      continue;
    }
    next[field.key] = "";
  }
  return next;
}

export function GenerateVideoClient() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateId, setTemplateId] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);

  const selected = useMemo(
    () => templates.find((t) => t.id === templateId) ?? null,
    [templates, templateId],
  );

  const canSubmit = useMemo(() => {
    if (!selected) return false;
    if (submitting) return false;
    for (const field of selected.fields) {
      if (field.required !== true) continue;
      const v = values[field.key] ?? "";
      if (!String(v).trim()) return false;
    }
    return true;
  }, [selected, values, submitting]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);
      try {
        const res = await fetch("/api/ai-studio/templates", { cache: "no-store" });
        const data = (await res.json()) as TemplatesResponse;
        if (!res.ok || data.ok !== true || !Array.isArray(data.items)) {
          if (!cancelled) setError("Gagal memuat templates.");
          return;
        }
        if (cancelled) return;
        setTemplates(data.items);
        const first = data.items[0]?.id ?? "";
        setTemplateId(first);
        setValues(initValues(data.items[0] ?? null));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Terjadi error.");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    const variables: Record<string, unknown> = {};
    for (const field of selected.fields) {
      const raw = values[field.key] ?? "";
      if (field.type === "list") {
        variables[field.key] = String(raw)
          .split("\n")
          .map((v) => v.trim())
          .filter(Boolean);
      } else {
        variables[field.key] = String(raw).trim();
      }
    }

    try {
      const res = await fetch("/api/ai-studio/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ templateId: selected.id, variables }),
      });
      const data = (await res.json()) as CreateJobResponse;
      if (!res.ok || data.ok !== true || !data.job) {
        setError(data.error ?? "Gagal membuat job.");
        return;
      }
      setJob(data.job);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-sm font-medium">Generate video</div>
      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Worker menjalankan PixVerse CLI dan mengembalikan URL hosting PixVerse.
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">Template</span>
          <select
            value={templateId}
            onChange={(e) => {
              const nextId = e.target.value;
              setTemplateId(nextId);
              const nextTemplate = templates.find((t) => t.id === nextId) ?? null;
              setValues(initValues(nextTemplate));
              setJob(null);
            }}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>

        {selected ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">{selected.description}</div>
        ) : null}

        {selected
          ? selected.fields.map((field) => (
              <label key={field.key} className="flex flex-col gap-1">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {field.label}
                </span>
                {field.type === "select" ? (
                  <select
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
                  >
                    {(field.options ?? []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                    rows={4}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
                  />
                ) : field.type === "list" ? (
                  <textarea
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                    rows={4}
                    placeholder="Satu item per baris"
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
                  />
                ) : (
                  <input
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
                  />
                )}
              </label>
            ))
          : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            {submitting ? "Memproses..." : "Generate"}
          </button>
          {error ? (
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          ) : null}
        </div>
      </form>

      {job ? (
        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-medium">Job {job.id}</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              {job.status}
              {job.progress ? ` · ${job.progress.doneClips}/${job.progress.totalClips}` : ""}
            </div>
          </div>
          {Array.isArray(job.output?.clips) && job.output?.clips.length > 0 ? (
            <div className="mt-3 grid gap-2">
              {job.output.clips.map((clip) => (
                <div
                  key={clip.id}
                  className="rounded-md border border-zinc-200 bg-white p-2 text-xs dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">
                      Scene {clip.sceneIndex}/{clip.sceneTotal} · {clip.durationSec}s
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400">{clip.status}</div>
                  </div>
                  <div className="mt-1 text-zinc-600 dark:text-zinc-400">{clip.sceneTitle}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {clip.output?.videoUrl ? (
                      <a
                        href={clip.output.videoUrl}
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
                    {clip.output?.thumbnailUrl ? (
                      <a
                        href={clip.output.thumbnailUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-zinc-200 px-2 py-1 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                      >
                        Thumbnail URL
                      </a>
                    ) : null}
                    {clip.error?.message ? (
                      <span className="rounded-md border border-red-200 px-2 py-1 text-red-700 dark:border-red-900/50 dark:text-red-300">
                        {clip.error.message}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : job.error?.message ? (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              {job.error.message}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
