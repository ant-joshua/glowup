"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles, Video, WandSparkles } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

import type { AiVideoScenario } from "./scenarios";
import { useAiVideoPlayground } from "./useAiVideoPlayground";

const STATUS_COPY: Record<string, string> = {
  queued: "Queued for render",
  running: "Generating scenes",
  succeeded: "Render ready",
  failed: "Needs another pass",
};

function fieldPlaceholder(label: string, type: string) {
  if (type === "list") {
    return "One direction per line";
  }

  if (type === "textarea") {
    return `Describe ${label.toLowerCase()}`;
  }

  return `Add ${label.toLowerCase()}`;
}

export function AiVideoScenarioStudio({
  scenario,
}: {
  scenario: AiVideoScenario;
}) {
  const {
    templates,
    values,
    activeJob,
    isLoadingTemplates,
    isSubmitting,
    error,
    selectedTemplate,
    canSubmit,
    applyScenario,
    updateValue,
    submit,
  } = useAiVideoPlayground();
  const didInitializeRef = useRef(false);

  useEffect(() => {
    if (isLoadingTemplates || templates.length === 0 || didInitializeRef.current) {
      return;
    }

    applyScenario(scenario.templateId, scenario.seededValues);
    didInitializeRef.current = true;
  }, [
    applyScenario,
    isLoadingTemplates,
    scenario.seededValues,
    scenario.templateId,
    templates.length,
  ]);

  const completedClips = activeJob?.progress?.doneClips ?? 0;
  const totalClips = activeJob?.progress?.totalClips ?? 0;
  const progressPercent =
    totalClips > 0 ? Math.min(100, Math.round((completedClips / totalClips) * 100)) : 0;

  return (
    <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="relative overflow-hidden rounded-4xl bg-surface-container-low p-6 shadow-ambient sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-linear-to-br from-primary/14 via-primary-container/8 to-transparent" />
        <div className="pointer-events-none absolute right-10 top-10 h-52 w-52 rounded-full bg-tertiary/10 blur-3xl" />

        <div className="relative flex flex-col gap-7">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-surface-container-lowest/85 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-secondary shadow-ambient-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {scenario.eyebrow}
              </div>
              <div className="space-y-3">
                <h2 className="max-w-xl font-serif text-4xl leading-tight text-on-surface sm:text-5xl">
                  {scenario.title}
                </h2>
                <p className="max-w-xl text-sm leading-7 text-secondary sm:text-base">
                  {scenario.intro}
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-surface-container-lowest/80 p-5 shadow-ambient-sm backdrop-blur">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                Outcome Focus
              </p>
              <p className="mt-3 font-serif text-2xl text-on-surface">{scenario.outcome}</p>
              <div className="mt-5 grid gap-3">
                {scenario.notes.map((note) => (
                  <div
                    key={note}
                    className="rounded-[1.2rem] bg-surface px-4 py-3 text-sm leading-6 text-on-surface/80"
                  >
                    {note}
                  </div>
                ))}
              </div>
              <Link
                href="/ai-studio/videos"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
              >
                Open full playground
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-surface-container-lowest p-5 shadow-ambient-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                  Focused Brief
                </p>
                <p className="mt-2 font-serif text-2xl text-on-surface">
                  Refine the scenario prompt
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-2 text-xs text-secondary">
                <WandSparkles className="h-3.5 w-3.5 text-primary" />
                Shared engine underneath
              </div>
            </div>

            {selectedTemplate?.id === scenario.templateId ? (
              <form
                className="mt-5 grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!canSubmit) {
                    return;
                  }

                  void submit();
                }}
              >
                {selectedTemplate.fields.map((field) => (
                  <label key={field.key} className="grid gap-2">
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                      {field.label}
                      {field.required ? " *" : ""}
                    </span>
                    {field.type === "select" ? (
                      <select
                        value={values[field.key] ?? ""}
                        onChange={(event) => updateValue(field.key, event.target.value)}
                        className="min-h-13 rounded-2xl bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition focus:bg-surface focus:ring-2 focus:ring-primary/20"
                      >
                        {(field.options ?? []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" || field.type === "list" ? (
                      <textarea
                        rows={field.type === "list" ? 5 : 4}
                        value={values[field.key] ?? ""}
                        onChange={(event) => updateValue(field.key, event.target.value)}
                        placeholder={fieldPlaceholder(field.label, field.type)}
                        className="rounded-2xl bg-surface-container-highest px-4 py-3 text-sm leading-6 text-on-surface outline-none transition placeholder:text-secondary/70 focus:bg-surface focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <input
                        value={values[field.key] ?? ""}
                        onChange={(event) => updateValue(field.key, event.target.value)}
                        placeholder={fieldPlaceholder(field.label, field.type)}
                        className="min-h-13 rounded-2xl bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-secondary/70 focus:bg-surface focus:ring-2 focus:ring-primary/20"
                      />
                    )}
                  </label>
                ))}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button type="submit" size="lg" disabled={!canSubmit}>
                    {isSubmitting ? "Preparing render..." : "Generate dedicated video"}
                  </Button>
                  <span className="text-sm text-secondary">
                    This page reuses the same request and polling layer as the playground.
                  </span>
                </div>
              </form>
            ) : (
              <div className="mt-5 rounded-[1.2rem] bg-surface-container-low px-4 py-6 text-sm text-secondary">
                Preparing the scenario template.
              </div>
            )}

            {error ? (
              <div className="mt-4 rounded-[1.15rem] bg-primary/8 px-4 py-3 text-sm text-primary">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <aside className="grid gap-5">
        <div className="rounded-4xl bg-surface-container-lowest p-6 shadow-ambient sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-secondary">
                Render Monitor
              </p>
              <p className="mt-2 font-serif text-2xl text-on-surface">Current job status</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-primary">
              <Video className="h-5 w-5" />
            </div>
          </div>

          {activeJob ? (
            <div className="mt-5 space-y-5">
              <div className="rounded-3xl bg-surface-container-low p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                      Active Job
                    </p>
                    <p className="mt-2 font-serif text-2xl text-on-surface">
                      {STATUS_COPY[activeJob.status] ?? activeJob.status}
                    </p>
                  </div>
                  <div className="rounded-full bg-surface px-3 py-2 text-xs uppercase tracking-[0.18em] text-secondary">
                    {activeJob.id}
                  </div>
                </div>
                <div className="mt-4 h-3 rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-tertiary to-tertiary-container transition-[width]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-secondary">
                  {totalClips > 0
                    ? `${completedClips} of ${totalClips} scenes completed.`
                    : "Waiting for scene updates from the worker."}
                </p>
              </div>

              <div className="grid gap-3">
                {(activeJob.output?.clips ?? []).map((clip) => (
                  <div
                    key={clip.id}
                    className="rounded-[1.35rem] bg-surface-container-low p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-on-surface">
                        Scene {clip.sceneIndex}/{clip.sceneTotal}
                      </p>
                      <span className="text-xs uppercase tracking-[0.18em] text-secondary">
                        {clip.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-on-surface/75">
                      {clip.sceneTitle}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {clip.output?.videoUrl ? (
                        <a
                          href={clip.output.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-surface-container-high"
                        >
                          Open video
                        </a>
                      ) : (
                        <span className="rounded-full bg-surface px-3 py-2 text-xs uppercase tracking-[0.16em] text-secondary">
                          Video pending
                        </span>
                      )}
                      {clip.output?.thumbnailUrl ? (
                        <a
                          href={clip.output.thumbnailUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-secondary transition hover:bg-surface-container-high"
                        >
                          Open thumb
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {activeJob.error?.message ? (
                <div className="rounded-[1.2rem] bg-primary/8 px-4 py-3 text-sm text-primary">
                  {activeJob.error.message}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl bg-surface-container-low p-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                Ready to test
              </p>
              <p className="mt-3 font-serif text-2xl text-on-surface">
                Your focused scenario render will appear here.
              </p>
              <p className="mt-3 text-sm leading-6 text-on-surface/75">
                This makes it easier to evaluate one use case at a time before you ship a
                fully dedicated production feature.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-4xl bg-surface-container-low p-6 shadow-ambient-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-secondary">
            Reuse Model
          </p>
          <div className="mt-4 grid gap-3">
            {[
              "Fixed scenario UI, shared store and API orchestration.",
              "Scenario defaults make each route feel purposeful instead of generic.",
              "The same backend contract still powers playground and dedicated pages.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.2rem] bg-surface px-4 py-3 text-sm leading-6 text-on-surface/80"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
