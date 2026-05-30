"use client";

import Link from "next/link";
import { ArrowUpRight, Film, ImageIcon, LoaderCircle, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useMarketingAssetGenerator } from "./useMarketingAssetGenerator";

const LANDING_GENERATOR_PRESETS = [
  {
    id: "hero-launch",
    label: "Hero Launch Pack",
    description: "Premium landing hero visuals for the main GlowUp launch story.",
    input: {
      campaignName: "GlowUp Landing Hero Launch",
      productName: "GlowUp Editorial Platform",
      audience: "Style-conscious professionals exploring a premium self-improvement platform",
      pageGoal: "Turn landing page visitors into trial signups with a clear premium first impression",
      valueProp:
        "A unified platform for wardrobe planning, skincare ritual design, and AI-led personal growth",
      cta: "Start your editorial glow-up",
      visualStyle:
        "Editorial luxury, warm cream palette, terracotta highlights, premium interface storytelling",
      brandNotes:
        "Use elegant whitespace, refined serif-led hierarchy, glassy highlights, and a believable premium product aesthetic.",
      imageModel: "qwen-image",
      imageQuality: "1080p",
      imageAspectRatio: "16:9",
      videoModel: "v6",
      videoQuality: "720p",
      videoAspectRatio: "16:9",
      videoDurationSec: 6,
      videoStoryMode: "multi-shot" as const,
      imageShots: [
        "Hero composition with premium laptop mockup and the GlowUp interface framed like a luxury editorial cover",
        "Supporting still focused on wardrobe, skincare, and AI guidance as one seamless personal operating system",
      ],
      videoBeats: [
        "Cinematic reveal of the GlowUp interface and premium promise for the hero section",
        "Elegant product montage showing skincare, outfit planning, and AI coaching before a CTA ending",
      ],
      videoStoryboard: [
        "Open on a premium GlowUp hero frame with elegant product presence",
        "Move through skincare, outfit planning, and AI coaching as connected editorial scenes",
        "Finish on a confident CTA scene with breathing room for headline and button copy",
      ],
    },
  },
  {
    id: "feature-proof",
    label: "Feature Proof Pack",
    description: "Conversion visuals for feature sections and product proof moments.",
    input: {
      campaignName: "GlowUp Feature Proof",
      productName: "GlowUp Editorial Platform",
      audience: "Busy users who want clear transformation guidance without app fragmentation",
      pageGoal: "Explain the product clearly and reinforce feature credibility",
      valueProp:
        "GlowUp connects self-analysis, style planning, and skincare guidance into one premium flow",
      cta: "See how GlowUp works",
      visualStyle:
        "Crisp product storytelling, interface-led composition, refined lighting, editorial precision",
      brandNotes:
        "Make the UI feel expensive and real. Keep scenes conversion-focused, minimal, and aspirational.",
      imageModel: "qwen-image",
      imageQuality: "1080p",
      imageAspectRatio: "16:9",
      videoModel: "v6",
      videoQuality: "720p",
      videoAspectRatio: "16:9",
      videoDurationSec: 6,
      videoStoryMode: "multi-shot" as const,
      imageShots: [
        "Feature still showing connected modules for wardrobe planning, skincare ritual guidance, and AI coaching",
        "Proof visual with premium dashboard close-up, typography hierarchy, and supporting transformation cues",
      ],
      videoBeats: [
        "Feature walkthrough clip that moves elegantly through the GlowUp ecosystem",
        "Proof montage showing the product benefits ending with a calm but persuasive CTA beat",
      ],
      videoStoryboard: [
        "Start with a clear overview of the GlowUp product ecosystem",
        "Transition into proof scenes for wardrobe, skincare, and AI outputs",
        "Close with a conversion-oriented CTA moment that feels calm and premium",
      ],
    },
  },
];

export function LandingMarketingStudio() {
  const {
    job,
    latest,
    promptLibrary,
    paths,
    error,
    progress,
    isSubmitting,
    isLoadingPromptLibrary,
    submitJob,
  } = useMarketingAssetGenerator();
  const [activePresetId, setActivePresetId] = useState(LANDING_GENERATOR_PRESETS[0].id);

  const activePreset = useMemo(() => {
    return (
      LANDING_GENERATOR_PRESETS.find((preset) => preset.id === activePresetId) ??
      LANDING_GENERATOR_PRESETS[0]
    );
  }, [activePresetId]);

  const latestVideo = (job?.output?.videos ?? latest?.item?.output?.videos ?? []).find(
    (item) => item.output?.videoUrl,
  );
  const latestImages = (job?.output?.images ?? latest?.item?.output?.images ?? [])
    .filter((item) => item.output?.imageUrl)
    .slice(0, 2);

  return (
    <section className="py-32 bg-surface">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="relative overflow-hidden rounded-[2.2rem] bg-surface-container-low p-8 shadow-ambient">
            <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-br from-primary/15 via-primary-container/8 to-transparent" />
            <div className="absolute right-0 top-8 h-52 w-52 rounded-full bg-tertiary/10 blur-3xl" />

            <div className="relative">
              <Badge className="rounded-full px-4 py-2 text-[0.72rem] uppercase tracking-[0.22em]">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Direct Marketing Generator
              </Badge>

              <div className="mt-6 max-w-2xl">
                <h2 className="font-serif text-4xl leading-tight text-on-surface md:text-5xl">
                  Generate landing page marketing videos directly from the product surface.
                </h2>
                <p className="mt-4 text-lg leading-8 text-secondary">
                  This section uses the same PixVerse-backed engine as the AI Studio
                  playground, but it runs through the reusable app API so future features
                  can generate campaign assets directly.
                </p>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                {LANDING_GENERATOR_PRESETS.map((preset) => {
                  const active = preset.id === activePresetId;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setActivePresetId(preset.id)}
                      className={`rounded-[1.6rem] p-5 text-left transition ${
                        active
                          ? "bg-surface-container-lowest shadow-ambient-sm"
                          : "bg-surface/70 hover:bg-surface-container-lowest"
                      }`}
                    >
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                        Preset
                      </p>
                      <h3 className="mt-3 font-serif text-2xl text-on-surface">
                        {preset.label}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-on-surface/75">
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 rounded-[1.8rem] bg-surface-container-lowest p-6 shadow-ambient-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                      Active Brief
                    </p>
                    <h3 className="mt-2 font-serif text-3xl text-on-surface">
                      {activePreset.label}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      onClick={() => void submitJob(activePreset.input)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Marketing Assets
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button asChild variant="secondary" size="lg">
                      <Link href="/ai-studio/marketing">Open Full Playground</Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-surface px-4 py-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-secondary">
                      Value Prop
                    </p>
                    <p className="mt-3 text-sm leading-7 text-on-surface/80">
                      {activePreset.input.valueProp}
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] bg-surface px-4 py-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-secondary">
                      Video Beats
                    </p>
                    <div className="mt-3 grid gap-2">
                      {activePreset.input.videoBeats.map((beat) => (
                        <div
                          key={beat}
                          className="rounded-2xl bg-surface-container-low px-3 py-3 text-sm leading-6 text-on-surface/75"
                        >
                          {beat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {paths ? (
                  <div className="mt-6 rounded-[1.4rem] bg-surface px-4 py-4 text-sm text-secondary">
                    <div className="font-semibold text-on-surface">Docs archive</div>
                    <div className="mt-2 break-all font-mono text-xs">{paths.archive}</div>
                  </div>
                ) : null}

                {error ? (
                  <div className="mt-6 rounded-[1.4rem] bg-primary/8 px-4 py-3 text-sm text-primary">
                    {error}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-ambient">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                    Live Render Status
                  </p>
                  <h3 className="mt-2 font-serif text-3xl text-on-surface">
                    {job?.status ?? latest?.item?.status ?? "idle"}
                  </h3>
                </div>
                <Badge variant="secondary">
                  {progress.done}/{progress.total}
                </Badge>
              </div>

              <div className="mt-5 h-3 rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-linear-to-r from-primary to-primary-container"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>

              <div className="mt-5 grid gap-3">
                <div className="rounded-[1.3rem] bg-surface-container-low p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Film className="h-4 w-4" />
                    <span className="font-medium">Latest marketing video</span>
                  </div>
                  {latestVideo?.output?.videoUrl ? (
                    <a
                      href={latestVideo.output.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
                    >
                      Open video
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-on-surface/70">
                      Run the generator to create the latest landing-page-ready hero clip.
                    </p>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {latestImages.map((image) => (
                    <a
                      key={image.id}
                      href={image.output?.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-[1.3rem] bg-surface-container-low p-4 transition hover:bg-surface-container"
                    >
                      <div className="flex items-center gap-2 text-primary">
                        <ImageIcon className="h-4 w-4" />
                        <span className="font-medium">{image.title}</span>
                      </div>
                      <p className="mt-3 line-clamp-4 text-sm leading-6 text-on-surface/75">
                        {image.prompt}
                      </p>
                    </a>
                  ))}
                  {latestImages.length === 0 ? (
                    <div className="rounded-[1.3rem] bg-surface-container-low p-4 text-sm leading-6 text-on-surface/70 md:col-span-2">
                      No landing page stills yet. Generate a pack from the left side and the
                      latest images will appear here.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-ambient">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                    Prompt Library
                  </p>
                  <h3 className="mt-2 font-serif text-3xl text-on-surface">
                    Ready-to-use prompts
                  </h3>
                </div>
                {isLoadingPromptLibrary ? (
                  <Badge variant="secondary">Loading</Badge>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3">
                {(promptLibrary ?? []).flatMap((collection) => collection.items).slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.3rem] bg-surface-container-low p-4"
                  >
                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-secondary">
                      {item.kind}
                    </div>
                    <h4 className="mt-2 font-serif text-2xl text-on-surface">
                      {item.title}
                    </h4>
                    <p className="mt-3 text-sm leading-6 text-on-surface/75">{item.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
