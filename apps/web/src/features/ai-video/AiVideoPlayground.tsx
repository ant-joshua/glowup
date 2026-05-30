"use client";

import { Sparkles, Video, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAiVideoPlayground } from "./useAiVideoPlayground";

const PLAYBOOKS: Record<
  string,
  {
    eyebrow: string;
    futureFeature: string;
    notes: string[];
  }
> = {
  "skincare-routine-editorial-v1": {
    eyebrow: "Skin Ritual Director",
    futureFeature: "Future destination: guided skincare-step generator.",
    notes: [
      "Turn a routine into polished beauty beats.",
      "Stress-test tone, cadence, and step density before a dedicated flow exists.",
    ],
  },
  "outfit-styling-editorial-v1": {
    eyebrow: "Outfit Story Generator",
    futureFeature: "Future destination: editorial outfit generation studio.",
    notes: [
      "Translate wardrobe ingredients into a styled narrative.",
      "Validate how occasion, mood, and layering should influence motion prompts.",
    ],
  },
  "virtual-try-on-motion-v1": {
    eyebrow: "Virtual Try-On Motion",
    futureFeature: "Future destination: user try-on video and fit simulation.",
    notes: [
      "Prototype motion language for digital fitting and garment reveal.",
      "Test whether pose direction and movement prompts read naturally on video.",
    ],
  },
};

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

export function AiVideoPlayground() {
  const {
    templates,
    values,
    activeJob,
    isLoadingTemplates,
    isSubmitting,
    error,
    selectedTemplate,
    canSubmit,
    selectTemplate,
    updateValue,
    setError,
    submit,
  } = useAiVideoPlayground();

  const playbook = selectedTemplate
    ? PLAYBOOKS[selectedTemplate.id]
    : {
        eyebrow: "Creative Video Lab",
        futureFeature: "Use this playground to validate future feature ideas.",
        notes: [
          "Shared state lives outside the route so the flow can move into dedicated modules later.",
          "Templates stay generic enough for skincare, styling, and try-on experiments.",
        ],
      };

  const completedClips = activeJob?.progress?.doneClips ?? 0;
  const totalClips = activeJob?.progress?.totalClips ?? 0;
  const progressPercent =
    totalClips > 0 ? Math.min(100, Math.round((completedClips / totalClips) * 100)) : 0;

  return (
    <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="relative overflow-hidden rounded-[2rem] bg-surface-container-low p-6 shadow-ambient sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-br from-primary/12 via-primary-container/8 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-10 h-48 w-48 rounded-full bg-tertiary/10 blur-3xl" />

        <div className="relative flex flex-col gap-8">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-surface-container-lowest/80 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-secondary shadow-ambient-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI Video Playground
              </div>
              <div className="space-y-3">
                <p className="font-serif text-sm uppercase tracking-[0.24em] text-secondary">
                  {playbook.eyebrow}
                </p>
                <div className="max-w-xl text-4xl leading-tight font-serif text-on-surface sm:text-5xl">
                  Build the reusable video engine now, then graduate it into focused
                  skincare, outfit, and try-on products later.
                </div>
                <p className="max-w-xl text-sm leading-7 text-secondary sm:text-base">
                  {playbook.futureFeature}
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-surface-container-lowest/80 p-5 shadow-ambient-sm backdrop-blur">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-secondary">
                Reuse Path
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-on-surface/80">
                {playbook.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-[1.25rem] bg-surface px-4 py-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                    Shared Layer
                  </p>
                  <p className="mt-2 text-sm text-on-surface/80">
                    Templates, form values, submit state, and active render job stay in a
                    reusable feature store.
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-surface px-4 py-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                    Future Layer
                  </p>
                  <p className="mt-2 text-sm text-on-surface/80">
                    Dedicated skincare and outfit experiences can swap in their own UI
                    while reusing the same transport and orchestration logic.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[1.75rem] bg-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-secondary">
                    Scenarios
                  </p>
                  <p className="mt-2 font-serif text-2xl text-on-surface">
                    Choose the experiment track
                  </p>
                </div>
                {isLoadingTemplates ? (
                  <span className="text-xs uppercase tracking-[0.22em] text-secondary">
                    Loading
                  </span>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3">
                {templates.map((template) => {
                  const isSelected = selectedTemplate?.id === template.id;
                  const templatePlaybook = PLAYBOOKS[template.id];

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => {
                        setError(null);
                        selectTemplate(template.id);
                      }}
                      className={cn(
                        "rounded-[1.4rem] px-4 py-4 text-left transition",
                        isSelected
                          ? "bg-linear-to-br from-primary to-primary-container text-on-primary shadow-ambient-sm"
                          : "bg-surface-container-low shadow-none hover:bg-surface-container",
                      )}
                    >
                      <p
                        className={cn(
                          "text-[0.7rem] font-semibold uppercase tracking-[0.22em]",
                          isSelected ? "text-on-primary/80" : "text-secondary",
                        )}
                      >
                        {templatePlaybook?.eyebrow ?? "Creative Scenario"}
                      </p>
                      <div className="mt-2 font-serif text-2xl leading-tight">
                        {template.title}
                      </div>
                      <p
                        className={cn(
                          "mt-3 text-sm leading-6",
                          isSelected ? "text-on-primary/90" : "text-on-surface/75",
                        )}
                      >
                        {template.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-surface-container-lowest p-5 shadow-ambient-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-secondary">
                    Prompt Inputs
                  </p>
                  <p className="mt-2 font-serif text-2xl text-on-surface">
                    Shape the render brief
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-2 text-xs text-secondary">
                  <WandSparkles className="h-3.5 w-3.5 text-primary" />
                  Reusable orchestration
                </div>
              </div>

              {selectedTemplate ? (
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
                          onChange={(event) =>
                            updateValue(field.key, event.target.value)
                          }
                          className="min-h-13 rounded-[1rem] bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition focus:bg-surface focus:ring-2 focus:ring-primary/20"
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
                          onChange={(event) =>
                            updateValue(field.key, event.target.value)
                          }
                          placeholder={fieldPlaceholder(field.label, field.type)}
                          className="rounded-[1rem] bg-surface-container-highest px-4 py-3 text-sm leading-6 text-on-surface outline-none transition placeholder:text-secondary/70 focus:bg-surface focus:ring-2 focus:ring-primary/20"
                        />
                      ) : (
                        <input
                          value={values[field.key] ?? ""}
                          onChange={(event) =>
                            updateValue(field.key, event.target.value)
                          }
                          placeholder={fieldPlaceholder(field.label, field.type)}
                          className="min-h-13 rounded-[1rem] bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-secondary/70 focus:bg-surface focus:ring-2 focus:ring-primary/20"
                        />
                      )}
                    </label>
                  ))}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button type="submit" size="lg" disabled={!canSubmit}>
                      {isSubmitting ? "Preparing render..." : "Generate playground video"}
                    </Button>
                    <span className="text-sm text-secondary">
                      Future dedicated UIs can reuse the same submit workflow.
                    </span>
                  </div>
                </form>
              ) : (
                <div className="mt-5 rounded-[1.25rem] bg-surface-container-low px-4 py-6 text-sm text-secondary">
                  Template data is loading.
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
      </div>

      <aside className="grid gap-5">
        <div className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-ambient sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-secondary">
                Output Monitor
              </p>
              <p className="mt-2 font-serif text-2xl text-on-surface">Live render state</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-primary">
              <Video className="h-5 w-5" />
            </div>
          </div>

          {activeJob ? (
            <div className="mt-5 space-y-5">
              <div className="rounded-[1.5rem] bg-surface-container-low p-4">
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
                  <div key={clip.id} className="rounded-[1.35rem] bg-surface-container-low p-4">
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
                      {clip.error?.message ? (
                        <span className="rounded-full bg-primary/8 px-3 py-2 text-xs uppercase tracking-[0.16em] text-primary">
                          {clip.error.message}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {activeJob.error?.message ? (
                <div className="rounded-[1.25rem] bg-primary/8 px-4 py-3 text-sm text-primary">
                  {activeJob.error.message}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.5rem] bg-surface-container-low p-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                Awaiting first run
              </p>
              <p className="mt-3 font-serif text-2xl text-on-surface">
                Your render preview will appear here.
              </p>
              <p className="mt-3 text-sm leading-6 text-on-surface/75">
                Use the playground to test prompt structure now, then promote the
                strongest scenario into a dedicated product surface later.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[2rem] bg-surface-container-low p-6 shadow-ambient-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-secondary">
            System Intent
          </p>
          <div className="mt-4 grid gap-3">
            {[
              "Keep transport and polling logic reusable across future AI features.",
              "Use the playground to validate templates before designing specialized flows.",
              "Preserve editorial presentation so AI output feels aspirational, not utilitarian.",
            ].map((item) => (
              <div key={item} className="rounded-[1.25rem] bg-surface px-4 py-3 text-sm leading-6 text-on-surface/80">
                {item}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
