"use client";

import {
  ArrowUpRight,
  Copy,
  Download,
  FileJson,
  ImageIcon,
  RefreshCcw,
  Sparkles,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MarketingFormState = {
  campaignName: string;
  productName: string;
  audience: string;
  pageGoal: string;
  valueProp: string;
  cta: string;
  visualStyle: string;
  brandNotes: string;
  imageModel: string;
  imageQuality: string;
  imageAspectRatio: string;
  videoModel: string;
  videoQuality: string;
  videoAspectRatio: string;
  videoDurationSec: string;
  imageShotsRaw: string;
  videoBeatsRaw: string;
};

type MarketingAssetJob = {
  id: string;
  status: "queued" | "running" | "succeeded" | "failed";
  createdAt: string;
  finishedAt?: string;
  input: {
    campaignName: string;
    productName: string;
    audience?: string;
    pageGoal?: string;
    valueProp?: string;
    cta?: string;
    visualStyle?: string;
    brandNotes?: string;
    imageModel?: string;
    imageQuality?: string;
    imageAspectRatio?: string;
    videoModel?: string;
    videoQuality?: string;
    videoAspectRatio?: string;
    videoDurationSec?: number;
    imageShots?: string[];
    videoBeats?: string[];
  };
  progress?: {
    totalAssets: number;
    doneAssets: number;
  };
  output?: {
    images: Array<{
      id: string;
      title: string;
      prompt: string;
      status: string;
      output?: {
        imageId?: number;
        imageUrl?: string;
        width?: number;
        height?: number;
      };
      error?: { message?: string };
    }>;
    videos: Array<{
      id: string;
      title: string;
      prompt: string;
      status: string;
      output?: {
        videoId?: number;
        videoUrl?: string;
        thumbnailUrl?: string;
      };
      error?: { message?: string };
    }>;
    docsArchivePath?: string;
    docsLatestPath?: string;
  };
  error?: { message?: string };
};

type ArchiveResponse = {
  ok: boolean;
  archive?: {
    version: number;
    updatedAt: string;
    items: MarketingAssetJob[];
  };
  latest?: {
    version: number;
    updatedAt: string;
    item: MarketingAssetJob | null;
  };
  paths?: {
    archive: string;
    latest: string;
  };
};

type PromptExample = {
  id: string;
  kind: "image" | "video";
  title: string;
  prompt: string;
};

const DEFAULT_FORM: MarketingFormState = {
  campaignName: "The Digital Atelier Launch",
  productName: "GlowUp Editorial Platform",
  audience:
    "Style-conscious professionals who want premium self-improvement guidance",
  pageGoal: "Turn first-time visitors into curious product explorers",
  valueProp:
    "A personal glow-up system that blends wardrobe, skincare, and AI guidance in one premium experience",
  cta: "Start your editorial glow-up",
  visualStyle:
    "Editorial luxury, soft glassmorphism, high-end product storytelling",
  brandNotes:
    "Use warm cream surfaces, terracotta accents, refined typography, generous whitespace, and premium landing page composition",
  imageModel: "qwen-image",
  imageQuality: "1080p",
  imageAspectRatio: "16:9",
  videoModel: "v6",
  videoQuality: "720p",
  videoAspectRatio: "16:9",
  videoDurationSec: "6",
  imageShotsRaw:
    "Hero composition introducing the GlowUp platform on a premium laptop mockup\nProduct detail still with skincare, wardrobe, and AI planning cues\nLifestyle landing page visual showing confident transformation and editorial calm",
  videoBeatsRaw:
    "Cinematic hero reveal of the GlowUp promise and interface\nFast benefit montage covering skincare, outfit planning, and AI coaching\nElegant CTA beat for the landing page hero section",
};

const MARKETING_PRESETS: Array<{
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  values: MarketingFormState;
}> = [
  {
    id: "landing-launch",
    eyebrow: "Launch Campaign",
    title: "Editorial Product Launch",
    description:
      "Best for the main landing page hero with premium product storytelling and clear CTA motion.",
    values: DEFAULT_FORM,
  },
  {
    id: "feature-proof",
    eyebrow: "Feature Campaign",
    title: "Benefit Proof Stack",
    description:
      "Focused on converting feature sections into stills and clips that explain the product clearly.",
    values: {
      campaignName: "GlowUp Feature Proof",
      productName: "GlowUp Editorial Platform",
      audience:
        "Busy users who want a polished self-improvement system without juggling multiple apps",
      pageGoal: "Clarify key features and reduce hesitation before sign up",
      valueProp:
        "One premium platform for wardrobe planning, skincare structure, and AI-led growth guidance",
      cta: "See how GlowUp works",
      visualStyle:
        "Refined product marketing, crisp editorial framing, elevated UI showcase",
      brandNotes:
        "Focus on confidence, transformation, and calm structure. Keep the visuals premium and believable.",
      imageModel: "qwen-image",
      imageQuality: "1080p",
      imageAspectRatio: "16:9",
      videoModel: "v6",
      videoQuality: "720p",
      videoAspectRatio: "16:9",
      videoDurationSec: "6",
      imageShotsRaw:
        "Structured feature grid visual highlighting wardrobe, skincare, and AI coach modules\nPremium product dashboard close-up with typography and tonal layering\nConversion-focused proof visual with key outcomes and elegant supporting objects",
      videoBeatsRaw:
        "Opening product overview showing the connected GlowUp ecosystem\nFeature proof montage focused on wardrobe, skincare, and coaching outputs\nFinal CTA beat that transitions naturally into the signup section",
    },
  },
  {
    id: "social-cutdown",
    eyebrow: "Social Extension",
    title: "Social To Landing Pack",
    description:
      "Useful when you want a matching creative system between paid/social teasers and the landing page.",
    values: {
      campaignName: "GlowUp Social Cutdown",
      productName: "GlowUp Editorial Platform",
      audience:
        "Aspirational professionals who discover products from short-form content and modern design-led brands",
      pageGoal:
        "Bridge short-form attention into landing page curiosity and trial intent",
      valueProp:
        "GlowUp turns fragmented beauty and style decisions into one coherent, premium personal system",
      cta: "Enter the GlowUp atelier",
      visualStyle:
        "Cinematic editorial teaser, high contrast pacing, premium aspirational lifestyle",
      brandNotes:
        "Blend product visuals with lifestyle aspiration. Use clean light, fashion-led posture, and luxurious negative space.",
      imageModel: "qwen-image",
      imageQuality: "1080p",
      imageAspectRatio: "16:9",
      videoModel: "v6",
      videoQuality: "720p",
      videoAspectRatio: "16:9",
      videoDurationSec: "6",
      imageShotsRaw:
        "Aspirational lifestyle hero showing the GlowUp world and premium atmosphere\nLanding page teaser still with elegant headline room and CTA placement\nProduct plus lifestyle blend visual that feels social-first but reusable on-site",
      videoBeatsRaw:
        "Fast social opener with editorial intrigue and product promise\nBridge scene connecting lifestyle aspiration to the GlowUp interface\nLanding-page-ready CTA beat with premium motion and breathing space",
    },
  },
];

const ACTIVE_STATUSES = new Set(["queued", "running"]);
const STATUS_FILTERS = [
  "all",
  "queued",
  "running",
  "succeeded",
  "failed",
] as const;

const PROMPT_EXAMPLES: PromptExample[] = [
  {
    id: "hero-image-editorial",
    kind: "image",
    title: "Editorial Hero Still",
    prompt:
      "Landing page hero still for GlowUp Editorial Platform. Premium editorial composition with warm cream surfaces, terracotta accent glow, refined serif typography space, elegant laptop mockup showing the interface, luxurious negative space, product-marketing realism, high-conversion visual hierarchy, 16:9.",
  },
  {
    id: "feature-image-proof",
    kind: "image",
    title: "Feature Proof Visual",
    prompt:
      "Landing page feature-section still for GlowUp. Showcase wardrobe planning, skincare ritual guidance, and AI coaching in one premium product composition. Crisp UI close-up, tonal layering, soft daylight, modern luxury art direction, believable SaaS product marketing visual, 16:9.",
  },
  {
    id: "hero-video-reveal",
    kind: "video",
    title: "Hero Reveal Clip",
    prompt:
      "Landing page hero marketing clip for GlowUp Editorial Platform. Cinematic premium reveal of the interface and promise, slow elegant camera move, refined editorial motion, warm cream and terracotta palette, luxury product storytelling, soft glass highlights, confident but calm pacing, built for a high-conversion 16:9 hero section.",
  },
  {
    id: "cta-video-conversion",
    kind: "video",
    title: "CTA Conversion Beat",
    prompt:
      "Landing page CTA clip for GlowUp. Focus on transformation, clarity, and premium self-improvement. Show a quick sequence of wardrobe planning, skincare ritual flow, and AI guidance ending on a compelling CTA moment. Elegant transitions, premium motion design language, landing-page-ready 16:9 composition.",
  },
];

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function jsonPreview(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function formFromJob(job: MarketingAssetJob): MarketingFormState | null {
  const input = job.input;

  if (
    !input.audience ||
    !input.pageGoal ||
    !input.valueProp ||
    !input.cta ||
    !input.visualStyle
  ) {
    return null;
  }

  return {
    campaignName: input.campaignName,
    productName: input.productName,
    audience: input.audience,
    pageGoal: input.pageGoal,
    valueProp: input.valueProp,
    cta: input.cta,
    visualStyle: input.visualStyle,
    brandNotes: input.brandNotes ?? "",
    imageModel: input.imageModel ?? "qwen-image",
    imageQuality: input.imageQuality ?? "1080p",
    imageAspectRatio: input.imageAspectRatio ?? "16:9",
    videoModel: input.videoModel ?? "v6",
    videoQuality: input.videoQuality ?? "720p",
    videoAspectRatio: input.videoAspectRatio ?? "16:9",
    videoDurationSec: String(input.videoDurationSec ?? 6),
    imageShotsRaw: (input.imageShots ?? []).join("\n"),
    videoBeatsRaw: (input.videoBeats ?? []).join("\n"),
  };
}

function buildPromptPack(job: MarketingAssetJob | null) {
  if (!job) {
    return "";
  }

  const lines = [
    `Campaign: ${job.input.campaignName}`,
    `Product: ${job.input.productName}`,
    "",
    "Image Prompts:",
    ...(job.output?.images ?? []).flatMap((image, index) => [
      `${index + 1}. ${image.title}`,
      image.prompt,
      "",
    ]),
    "Video Prompts:",
    ...(job.output?.videos ?? []).flatMap((video, index) => [
      `${index + 1}. ${video.title}`,
      video.prompt,
      "",
    ]),
  ];

  return lines.join("\n").trim();
}

export function MarketingAssetPlaygroundClient() {
  const [form, setForm] = useState<MarketingFormState>(DEFAULT_FORM);
  const [job, setJob] = useState<MarketingAssetJob | null>(null);
  const [archive, setArchive] = useState<ArchiveResponse["archive"] | null>(
    null,
  );
  const [latest, setLatest] = useState<ArchiveResponse["latest"] | null>(null);
  const [docPaths, setDocPaths] = useState<ArchiveResponse["paths"] | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [loadingArchive, setLoadingArchive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [archiveQuery, setArchiveQuery] = useState("");
  const [archiveStatus, setArchiveStatus] =
    useState<(typeof STATUS_FILTERS)[number]>("all");

  async function loadArchive() {
    setLoadingArchive(true);

    try {
      const res = await fetch("/api/ai-studio/marketing/archive", {
        cache: "no-store",
      });
      const data = (await res.json()) as ArchiveResponse;

      if (!res.ok || data.ok !== true) {
        throw new Error("Gagal memuat archive marketing assets.");
      }

      setArchive(data.archive ?? null);
      setLatest(data.latest ?? null);
      setDocPaths(data.paths ?? null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Gagal memuat archive marketing assets.",
      );
    } finally {
      setLoadingArchive(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadArchive();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!job || !ACTIVE_STATUSES.has(job.status)) {
      return;
    }

    let cancelled = false;

    const refresh = async () => {
      try {
        const res = await fetch(`/api/ai-studio/marketing/jobs/${job.id}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as {
          ok: boolean;
          job?: MarketingAssetJob;
        };

        if (!res.ok || data.ok !== true || !data.job || cancelled) {
          return;
        }

        setJob(data.job);

        if (!ACTIVE_STATUSES.has(data.job.status)) {
          void loadArchive();
        }
      } catch {}
    };

    void refresh();

    const timer = window.setInterval(() => {
      void refresh();
    }, 2500);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [job]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer = window.setTimeout(() => {
      setFeedback(null);
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [feedback]);

  const canSubmit = useMemo(() => {
    return (
      !submitting &&
      Boolean(form.campaignName.trim()) &&
      Boolean(form.productName.trim()) &&
      Boolean(form.audience.trim()) &&
      Boolean(form.pageGoal.trim()) &&
      Boolean(form.valueProp.trim()) &&
      Boolean(form.cta.trim()) &&
      Boolean(form.visualStyle.trim()) &&
      splitLines(form.imageShotsRaw).length > 0 &&
      splitLines(form.videoBeatsRaw).length > 0
    );
  }, [form, submitting]);

  function applyPreset(values: MarketingFormState) {
    setForm(values);
    setFeedback("Preset applied");
  }

  async function submitPayload(payload: {
    campaignName: string;
    productName: string;
    audience: string;
    pageGoal: string;
    valueProp: string;
    cta: string;
    visualStyle: string;
    brandNotes: string;
    imageModel: string;
    imageQuality: string;
    imageAspectRatio: string;
    videoModel: string;
    videoQuality: string;
    videoAspectRatio: string;
    videoDurationSec: number;
    imageShots: string[];
    videoBeats: string[];
  }) {
    const res = await fetch("/api/ai-studio/marketing/jobs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as {
      ok: boolean;
      job?: MarketingAssetJob;
      error?: string;
    };

    if (!res.ok || data.ok !== true || !data.job) {
      throw new Error(data.error ?? "Gagal membuat marketing asset job.");
    }

    setJob(data.job);
    void loadArchive();
  }

  async function handleCopyPromptPack(sourceJob: MarketingAssetJob | null) {
    const promptPack = buildPromptPack(sourceJob);

    if (!promptPack) {
      setFeedback("Belum ada prompt pack");
      return;
    }

    try {
      await navigator.clipboard.writeText(promptPack);
      setFeedback("Prompt pack copied");
    } catch {
      setFeedback("Copy gagal");
    }
  }

  function handleDownloadManifest(
    sourceJob: MarketingAssetJob | null,
    label: string,
  ) {
    if (!sourceJob) {
      setFeedback("Belum ada manifest");
      return;
    }

    const blob = new Blob([jsonPreview(sourceJob)], {
      type: "application/json;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    link.href = url;
    link.download = `${safeLabel || "marketing-assets"}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    setFeedback("Manifest downloaded");
  }

  async function handleCopyExamplePrompt(example: PromptExample) {
    try {
      await navigator.clipboard.writeText(example.prompt);
      setFeedback(
        `${example.kind === "image" ? "Image" : "Video"} prompt copied`,
      );
    } catch {
      setFeedback("Copy gagal");
    }
  }

  async function handleGenerateAgain(sourceJob: MarketingAssetJob) {
    const nextForm = formFromJob(sourceJob);

    if (!nextForm) {
      setFeedback("Archive belum punya brief lengkap");
      return;
    }

    setForm(nextForm);
    setSubmitting(true);
    setError(null);

    try {
      await submitPayload({
        campaignName: nextForm.campaignName,
        productName: nextForm.productName,
        audience: nextForm.audience,
        pageGoal: nextForm.pageGoal,
        valueProp: nextForm.valueProp,
        cta: nextForm.cta,
        visualStyle: nextForm.visualStyle,
        brandNotes: nextForm.brandNotes,
        imageModel: nextForm.imageModel,
        imageQuality: nextForm.imageQuality,
        imageAspectRatio: nextForm.imageAspectRatio,
        videoModel: nextForm.videoModel,
        videoQuality: nextForm.videoQuality,
        videoAspectRatio: nextForm.videoAspectRatio,
        videoDurationSec: Number(nextForm.videoDurationSec),
        imageShots: splitLines(nextForm.imageShotsRaw),
        videoBeats: splitLines(nextForm.videoBeatsRaw),
      });
      setFeedback("Archive regenerated");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal membuat marketing asset job.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitPayload({
        campaignName: form.campaignName,
        productName: form.productName,
        audience: form.audience,
        pageGoal: form.pageGoal,
        valueProp: form.valueProp,
        cta: form.cta,
        visualStyle: form.visualStyle,
        brandNotes: form.brandNotes,
        imageModel: form.imageModel,
        imageQuality: form.imageQuality,
        imageAspectRatio: form.imageAspectRatio,
        videoModel: form.videoModel,
        videoQuality: form.videoQuality,
        videoAspectRatio: form.videoAspectRatio,
        videoDurationSec: Number(form.videoDurationSec),
        imageShots: splitLines(form.imageShotsRaw),
        videoBeats: splitLines(form.videoBeatsRaw),
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal membuat marketing asset job.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const totalAssets = job?.progress?.totalAssets ?? 0;
  const doneAssets = job?.progress?.doneAssets ?? 0;
  const progressPercent =
    totalAssets > 0 ? Math.round((doneAssets / totalAssets) * 100) : 0;
  const reusableJob = latest?.item ?? job;
  const filteredArchiveItems = (archive?.items ?? []).filter((item) => {
    const matchesStatus =
      archiveStatus === "all" ? true : item.status === archiveStatus;
    const query = archiveQuery.trim().toLowerCase();
    const haystack = [
      item.input.campaignName,
      item.input.productName,
      item.input.audience ?? "",
      item.input.pageGoal ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return matchesStatus && (!query || haystack.includes(query));
  });

  return (
    <section className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
      <div className="relative overflow-hidden rounded-4xl bg-surface-container-low p-6 shadow-ambient sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-br from-primary/14 via-primary-container/8 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-10 h-56 w-56 rounded-full bg-tertiary/10 blur-3xl" />

        <div className="relative flex flex-col gap-7">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <Badge className="w-fit gap-2 rounded-full px-4 py-2 text-[0.7rem] uppercase tracking-[0.24em]">
                <Sparkles className="h-3.5 w-3.5" />
                Marketing Asset Playground
              </Badge>
              <div className="space-y-3">
                <h2 className="max-w-xl font-serif text-4xl leading-tight text-on-surface sm:text-5xl">
                  Generate landing page images and marketing video clips with
                  PixVerse CLI.
                </h2>
                <p className="max-w-xl text-sm leading-7 text-secondary sm:text-base">
                  This page is our internal playground for producing hero
                  visuals, supporting stills, and reusable landing page video
                  beats. Every run archives JSON into `docs` so the outputs can
                  be reused later.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-surface-container-lowest/80 p-5 shadow-ambient-sm backdrop-blur">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                Output Contract
              </p>
              <div className="mt-4 grid gap-3">
                {[
                  "Uses PixVerse CLI with structured --json output.",
                  "Writes archive and latest manifests into docs for reuse.",
                  "Produces both still images and landing-page-ready video beats in one run.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.2rem] bg-surface px-4 py-3 text-sm leading-6 text-on-surface/80"
                  >
                    {item}
                  </div>
                ))}
              </div>
              {docPaths ? (
                <div className="mt-5 rounded-[1.2rem] bg-surface px-4 py-3 text-sm text-secondary">
                  <div className="font-semibold text-on-surface">
                    Docs archive path
                  </div>
                  <div className="mt-2 break-all font-mono text-xs">
                    {docPaths.archive}
                  </div>
                  <div className="mt-3 font-semibold text-on-surface">
                    Docs latest path
                  </div>
                  <div className="mt-2 break-all font-mono text-xs">
                    {docPaths.latest}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <Tabs defaultValue="brief" className="w-full">
            <TabsList className="h-auto rounded-full bg-surface-container-lowest p-1">
              <TabsTrigger value="brief" className="rounded-full px-4 py-2">
                Brief
              </TabsTrigger>
              <TabsTrigger value="archive" className="rounded-full px-4 py-2">
                Archive
              </TabsTrigger>
              <TabsTrigger value="json" className="rounded-full px-4 py-2">
                Docs JSON
              </TabsTrigger>
            </TabsList>

            <TabsContent value="brief" className="mt-4">
              <div className="mb-4 grid gap-3 lg:grid-cols-3">
                {MARKETING_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.values)}
                    className="rounded-[1.4rem] bg-surface-container-lowest/80 p-4 text-left shadow-ambient-sm transition hover:bg-surface"
                  >
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                      {preset.eyebrow}
                    </p>
                    <h3 className="mt-3 font-serif text-2xl text-on-surface">
                      {preset.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-on-surface/75">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>

              <form
                onSubmit={onSubmit}
                className="rounded-[1.75rem] bg-surface-container-lowest p-5 shadow-ambient-sm"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["campaignName", "Campaign name"],
                    ["productName", "Product name"],
                    ["audience", "Audience"],
                    ["pageGoal", "Landing page goal"],
                    ["valueProp", "Value proposition"],
                    ["cta", "CTA copy"],
                    ["visualStyle", "Visual style"],
                    ["brandNotes", "Brand notes"],
                  ].map(([key, label]) => (
                    <label key={key} className="grid gap-2">
                      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                        {label}
                      </span>
                      <input
                        value={form[key as keyof MarketingFormState]}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            [key]: event.target.value,
                          }))
                        }
                        className="min-h-13 rounded-2xl bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition focus:bg-surface focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {[
                    ["imageModel", "Image model"],
                    ["imageQuality", "Image quality"],
                    ["imageAspectRatio", "Image ratio"],
                    ["videoModel", "Video model"],
                    ["videoQuality", "Video quality"],
                    ["videoAspectRatio", "Video ratio"],
                    ["videoDurationSec", "Video duration"],
                  ].map(([key, label]) => (
                    <label key={key} className="grid gap-2">
                      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                        {label}
                      </span>
                      <input
                        value={form[key as keyof MarketingFormState]}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            [key]: event.target.value,
                          }))
                        }
                        className="min-h-13 rounded-2xl bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none transition focus:bg-surface focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                      Image shots
                    </span>
                    <textarea
                      rows={5}
                      value={form.imageShotsRaw}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          imageShotsRaw: event.target.value,
                        }))
                      }
                      className="rounded-2xl bg-surface-container-highest px-4 py-3 text-sm leading-6 text-on-surface outline-none transition focus:bg-surface focus:ring-2 focus:ring-primary/20"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                      Video beats
                    </span>
                    <textarea
                      rows={5}
                      value={form.videoBeatsRaw}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          videoBeatsRaw: event.target.value,
                        }))
                      }
                      className="rounded-2xl bg-surface-container-highest px-4 py-3 text-sm leading-6 text-on-surface outline-none transition focus:bg-surface focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button type="submit" size="lg" disabled={!canSubmit}>
                    {submitting ? "Submitting..." : "Generate marketing assets"}
                  </Button>
                  <span className="text-sm text-secondary">
                    Images and videos are archived into docs JSON automatically.
                  </span>
                </div>
              </form>

              <div className="mt-4 rounded-[1.75rem] bg-surface-container-lowest p-5 shadow-ambient-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                      Prompt Examples
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-on-surface">
                      Siap copy untuk image dan video
                    </h3>
                  </div>
                  <div className="text-sm text-secondary">
                    Cocok buat test cepat sebelum refine brief.
                  </div>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                  {PROMPT_EXAMPLES.map((example) => (
                    <div
                      key={example.id}
                      className="rounded-[1.2rem] bg-surface p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-secondary">
                            {example.kind}
                          </p>
                          <h4 className="mt-2 font-serif text-2xl text-on-surface">
                            {example.title}
                          </h4>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => void handleCopyExamplePrompt(example)}
                        >
                          <Copy className="mr-2 h-3.5 w-3.5" />
                          Copy
                        </Button>
                      </div>
                      <pre className="mt-4 overflow-x-auto rounded-2xl bg-surface-container-low px-4 py-3 text-xs leading-6 text-on-surface/80">
                        {example.prompt}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="archive" className="mt-4">
              <div className="rounded-[1.75rem] bg-surface-container-lowest p-5 shadow-ambient-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                      Archive Preview
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-on-surface">
                      Stored runs from docs
                    </h3>
                  </div>
                  {loadingArchive ? (
                    <Badge variant="secondary">Loading</Badge>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
                  <label className="grid gap-2">
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                      Search archive
                    </span>
                    <input
                      value={archiveQuery}
                      onChange={(event) => setArchiveQuery(event.target.value)}
                      placeholder="Search campaign, product, audience..."
                      className="min-h-12 rounded-2xl bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:bg-surface-container-low focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                      Status
                    </span>
                    <select
                      value={archiveStatus}
                      onChange={(event) =>
                        setArchiveStatus(
                          event.target.value as (typeof STATUS_FILTERS)[number],
                        )
                      }
                      className="min-h-12 rounded-2xl bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:bg-surface-container-low focus:ring-2 focus:ring-primary/20"
                    >
                      {STATUS_FILTERS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-5 grid gap-3">
                  {filteredArchiveItems.slice(0, 12).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.2rem] bg-surface px-4 py-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="font-serif text-2xl text-on-surface">
                            {item.input.campaignName}
                          </div>
                          <div className="mt-1 text-sm text-secondary">
                            {item.input.productName}
                          </div>
                        </div>
                        <Badge
                          variant={
                            item.status === "succeeded"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="mt-3 text-xs text-secondary">
                        {item.output?.images.length ?? 0} images ·{" "}
                        {item.output?.videos.length ?? 0} videos
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            const nextForm = formFromJob(item);
                            if (nextForm) {
                              setForm(nextForm);
                              setFeedback("Archive loaded into brief");
                            } else {
                              setFeedback("Archive belum punya brief lengkap");
                            }
                          }}
                        >
                          <RefreshCcw className="mr-2 h-3.5 w-3.5" />
                          Reuse brief
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => void handleGenerateAgain(item)}
                        >
                          <RefreshCcw className="mr-2 h-3.5 w-3.5" />
                          Generate again
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDownloadManifest(
                              item,
                              item.input.campaignName,
                            )
                          }
                        >
                          <Download className="mr-2 h-3.5 w-3.5" />
                          Download
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => void handleCopyPromptPack(item)}
                        >
                          <Copy className="mr-2 h-3.5 w-3.5" />
                          Copy prompts
                        </Button>
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {(item.output?.images ?? [])
                          .filter((image) => image.output?.imageUrl)
                          .slice(0, 2)
                          .map((image) => (
                            <a
                              key={image.id}
                              href={image.output?.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-[1.1rem] bg-surface-container-low px-4 py-3 text-sm text-on-surface/75 transition hover:bg-surface-container"
                            >
                              <div className="flex items-center gap-2 text-primary">
                                <ImageIcon className="h-4 w-4" />
                                {image.title}
                              </div>
                              <div className="mt-2 line-clamp-3 leading-6">
                                {image.prompt}
                              </div>
                            </a>
                          ))}
                        {(item.output?.videos ?? [])
                          .filter((video) => video.output?.videoUrl)
                          .slice(0, 2)
                          .map((video) => (
                            <a
                              key={video.id}
                              href={video.output?.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-[1.1rem] bg-surface-container-low px-4 py-3 text-sm text-on-surface/75 transition hover:bg-surface-container"
                            >
                              <div className="flex items-center gap-2 text-primary">
                                <Video className="h-4 w-4" />
                                {video.title}
                              </div>
                              <div className="mt-2 line-clamp-3 leading-6">
                                {video.prompt}
                              </div>
                            </a>
                          ))}
                      </div>
                    </div>
                  ))}
                  {filteredArchiveItems.length === 0 ? (
                    <div className="rounded-[1.2rem] bg-surface px-4 py-5 text-sm text-secondary">
                      Tidak ada item archive yang cocok. Coba ubah search/status
                      filter atau generate brief baru.
                    </div>
                  ) : null}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="json" className="mt-4">
              <div className="rounded-[1.75rem] bg-surface-container-lowest p-5 shadow-ambient-sm">
                <div className="flex items-center gap-3">
                  <FileJson className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                      Latest docs manifest
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-on-surface">
                      JSON ready to reuse
                    </h3>
                  </div>
                </div>
                <pre className="mt-5 overflow-x-auto rounded-[1.2rem] bg-surface p-4 text-xs leading-6 text-on-surface/80">
                  {jsonPreview(
                    latest ?? { version: 1, updatedAt: null, item: null },
                  )}
                </pre>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      handleDownloadManifest(
                        reusableJob,
                        reusableJob?.input.campaignName ??
                          "marketing-assets-latest",
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download latest manifest
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void handleCopyPromptPack(reusableJob)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy prompt pack
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <aside className="grid gap-5">
        <div className="rounded-4xl bg-surface-container-lowest p-6 shadow-ambient sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                Current Job
              </p>
              <h3 className="mt-2 font-serif text-2xl text-on-surface">
                Live marketing render state
              </h3>
            </div>
            <Badge variant="secondary">{job?.status ?? "idle"}</Badge>
          </div>

          {job ? (
            <div className="mt-5 space-y-5">
              <div className="rounded-3xl bg-surface-container-low p-4">
                <div className="text-sm text-secondary">{job.id}</div>
                <div className="mt-3 h-3 rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-primary to-primary-container"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="mt-3 text-sm text-secondary">
                  {doneAssets} of {totalAssets} assets finished
                </div>
              </div>

              <div className="grid gap-3">
                {(job.output?.images ?? []).map((image) => (
                  <div
                    key={image.id}
                    className="rounded-[1.25rem] bg-surface-container-low p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-on-surface">
                          {image.title}
                        </span>
                      </div>
                      <span className="text-xs uppercase tracking-[0.18em] text-secondary">
                        {image.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-on-surface/75">
                      {image.prompt}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {image.output?.imageUrl ? (
                        <a
                          href={image.output.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-surface-container-high"
                        >
                          Open image
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                      {image.error?.message ? (
                        <span className="rounded-full bg-primary/8 px-3 py-2 text-xs uppercase tracking-[0.16em] text-primary">
                          {image.error.message}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}

                {(job.output?.videos ?? []).map((video) => (
                  <div
                    key={video.id}
                    className="rounded-[1.25rem] bg-surface-container-low p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-primary" />
                        <span className="font-medium text-on-surface">
                          {video.title}
                        </span>
                      </div>
                      <span className="text-xs uppercase tracking-[0.18em] text-secondary">
                        {video.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-on-surface/75">
                      {video.prompt}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {video.output?.videoUrl ? (
                        <a
                          href={video.output.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-surface-container-high"
                        >
                          Open video
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                      {video.output?.thumbnailUrl ? (
                        <a
                          href={video.output.thumbnailUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-secondary transition hover:bg-surface-container-high"
                        >
                          Open thumb
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                      {video.error?.message ? (
                        <span className="rounded-full bg-primary/8 px-3 py-2 text-xs uppercase tracking-[0.16em] text-primary">
                          {video.error.message}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl bg-surface-container-low p-5 text-sm leading-6 text-on-surface/75">
              Submit a marketing brief to generate landing page images and video
              clips. The resulting JSON manifest will also be written into
              `docs`.
            </div>
          )}

          {error ? (
            <div className="mt-4 rounded-[1.2rem] bg-primary/8 px-4 py-3 text-sm text-primary">
              {error}
            </div>
          ) : null}
          {feedback ? (
            <div className="mt-4 rounded-[1.2rem] bg-tertiary/10 px-4 py-3 text-sm text-tertiary">
              {feedback}
            </div>
          ) : null}
        </div>
      </aside>
    </section>
  );
}
