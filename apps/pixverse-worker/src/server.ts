import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";

import { JobStore } from "./jobs/store";
import type { Job, JobClip, Template } from "./jobs/types";
import { MarketingJobStore } from "./marketing/store";
import {
  buildMarketingImageAssets,
  buildMarketingVideoAssets,
} from "./marketing/specs";
import type { MarketingJob, MarketingJobInput } from "./marketing/types";
import { templates } from "./templates/templates";
import {
  createImageFromPrompt,
  createVideoFromPrompt,
} from "./pixverse/runPixverse";

function json(
  res: import("node:http").ServerResponse,
  status: number,
  body: unknown,
) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(body));
}

function readBody(
  req: import("node:http").IncomingMessage,
  limitBytes: number,
) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > limitBytes) {
        reject(new Error("payload_too_large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function safeParseJson(input: string): unknown {
  try {
    return JSON.parse(input) as unknown;
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function newJobId() {
  return `job_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

function findTemplate(templateId: string) {
  return templates.find((t) => t.id === templateId) ?? null;
}

function normalizeVariables(raw: unknown, template: Template) {
  const obj =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out: Record<string, unknown> = {};

  for (const field of template.fields) {
    const value = obj[field.key];
    if (field.type === "list") {
      if (Array.isArray(value)) {
        out[field.key] = value
          .map((v) => String(v))
          .filter(Boolean)
          .slice(0, 20);
      } else if (typeof value === "string") {
        out[field.key] = value
          .split("\n")
          .map((v) => v.trim())
          .filter(Boolean)
          .slice(0, 20);
      } else {
        out[field.key] = [];
      }
      continue;
    }

    if (typeof value === "string") {
      out[field.key] = value.trim().slice(0, 800);
      continue;
    }

    if (typeof value === "number" || typeof value === "boolean") {
      out[field.key] = value;
      continue;
    }

    out[field.key] = value ?? "";
  }

  return out;
}

function renderPrompt(template: Template, variables: Record<string, unknown>) {
  const merged: Record<string, unknown> = {
    ...variables,
    aspectRatio: template.defaults?.aspectRatio ?? "",
  };

  const steps = merged.steps;
  if (Array.isArray(steps)) {
    merged.steps = steps
      .map((s) => String(s))
      .filter(Boolean)
      .join(", ");
  }

  return template.promptTemplate.replace(
    /\{([a-zA-Z0-9_]+)\}/g,
    (_m, key: string) => {
      const val = merged[key];
      if (val == null) return "";
      return String(val);
    },
  );
}

function clampDuration(value: number) {
  if (!Number.isFinite(value)) return 6;
  if (value < 5) return 5;
  if (value > 10) return 10;
  return Math.round(value);
}

function getSceneDurationSec(
  template: Template,
  variables: Record<string, unknown>,
) {
  const raw = variables.sceneDurationSec;
  const fromVar =
    typeof raw === "string" && raw.trim() ? Number(raw.trim()) : null;
  const fromDefault = template.defaults?.durationSec;
  return clampDuration(Number(fromVar ?? fromDefault ?? 6));
}

function getScenes(variables: Record<string, unknown>) {
  const steps = variables.steps;
  if (!Array.isArray(steps)) return [];
  return steps
    .map((s) => String(s).trim())
    .filter(Boolean)
    .slice(0, 12);
}

function clampList(values: unknown, fallback: string[]) {
  if (Array.isArray(values)) {
    const list = values
      .map((value) => String(value).trim())
      .filter(Boolean)
      .slice(0, 4);

    if (list.length > 0) {
      return list;
    }
  }

  return fallback;
}

function normalizeMarketingInput(raw: unknown): MarketingJobInput | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const rec = raw as Record<string, unknown>;
  const campaignName =
    typeof rec.campaignName === "string"
      ? rec.campaignName.trim().slice(0, 120)
      : "";
  const productName =
    typeof rec.productName === "string"
      ? rec.productName.trim().slice(0, 120)
      : "";
  const audience =
    typeof rec.audience === "string" ? rec.audience.trim().slice(0, 200) : "";
  const pageGoal =
    typeof rec.pageGoal === "string" ? rec.pageGoal.trim().slice(0, 200) : "";
  const valueProp =
    typeof rec.valueProp === "string" ? rec.valueProp.trim().slice(0, 240) : "";
  const cta = typeof rec.cta === "string" ? rec.cta.trim().slice(0, 120) : "";
  const visualStyle =
    typeof rec.visualStyle === "string"
      ? rec.visualStyle.trim().slice(0, 160)
      : "";
  const brandNotes =
    typeof rec.brandNotes === "string"
      ? rec.brandNotes.trim().slice(0, 320)
      : "";
  const imageModel =
    typeof rec.imageModel === "string"
      ? rec.imageModel.trim().slice(0, 80)
      : "qwen-image";
  const imageQuality =
    typeof rec.imageQuality === "string"
      ? rec.imageQuality.trim().slice(0, 40)
      : "1080p";
  const imageAspectRatio =
    typeof rec.imageAspectRatio === "string"
      ? rec.imageAspectRatio.trim().slice(0, 20)
      : "16:9";
  const videoModel =
    typeof rec.videoModel === "string"
      ? rec.videoModel.trim().slice(0, 80)
      : "v6";
  const videoQuality =
    typeof rec.videoQuality === "string"
      ? rec.videoQuality.trim().slice(0, 40)
      : "720p";
  const videoAspectRatio =
    typeof rec.videoAspectRatio === "string"
      ? rec.videoAspectRatio.trim().slice(0, 20)
      : "16:9";
  const videoDurationSecRaw =
    typeof rec.videoDurationSec === "number"
      ? rec.videoDurationSec
      : Number(rec.videoDurationSec ?? 6);
  const videoDurationSec = clampDuration(videoDurationSecRaw);
  const imageShots = clampList(rec.imageShots, [
    "Hero product composition with generous negative space",
    "Feature detail still showing premium material and interface polish",
  ]);
  const videoBeats = clampList(rec.videoBeats, [
    "Hero reveal of the product and promise",
    "Fast proof beat showing the key benefit and CTA",
  ]);

  if (
    !campaignName ||
    !productName ||
    !audience ||
    !pageGoal ||
    !valueProp ||
    !cta ||
    !visualStyle
  ) {
    return null;
  }

  return {
    campaignName,
    productName,
    audience,
    pageGoal,
    valueProp,
    cta,
    visualStyle,
    brandNotes,
    imageModel,
    imageQuality,
    imageAspectRatio,
    videoModel,
    videoQuality,
    videoAspectRatio,
    videoDurationSec,
    imageShots,
    videoBeats,
  };
}

async function readJsonFile(filePath: string) {
  try {
    const raw = await readFile(filePath, "utf8");
    return safeParseJson(raw);
  } catch {
    return null;
  }
}

function renderScenePrompt({
  template,
  variables,
  scene,
  sceneIndex,
  sceneTotal,
}: {
  template: Template;
  variables: Record<string, unknown>;
  scene: string;
  sceneIndex: number;
  sceneTotal: number;
}) {
  const merged: Record<string, unknown> = {
    ...variables,
    aspectRatio: template.defaults?.aspectRatio ?? "",
    scene,
    sceneIndex: String(sceneIndex),
    sceneTotal: String(sceneTotal),
  };

  const steps = merged.steps;
  if (Array.isArray(steps)) {
    merged.steps = steps
      .map((s) => String(s))
      .filter(Boolean)
      .join(", ");
  }

  return template.promptTemplate.replace(
    /\{([a-zA-Z0-9_]+)\}/g,
    (_m, key: string) => {
      const val = merged[key];
      if (val == null) return "";
      return String(val);
    },
  );
}

const storePath =
  process.env.PIXVERSE_WORKER_STORE_PATH?.trim() || "./data/jobs.json";
const marketingStorePath =
  process.env.PIXVERSE_MARKETING_STORE_PATH?.trim() ||
  "./data/marketing-jobs.json";
const marketingArchivePath =
  process.env.PIXVERSE_MARKETING_ARCHIVE_PATH?.trim() ||
  "../../docs/ai/generated/marketing-assets.archive.json";
const marketingLatestPath =
  process.env.PIXVERSE_MARKETING_LATEST_PATH?.trim() ||
  "../../docs/ai/generated/marketing-assets.latest.json";
const port = Number(process.env.PORT ?? "4107");
const maxConcurrency = Math.max(
  1,
  Number(process.env.PIXVERSE_WORKER_MAX_CONCURRENCY ?? "1"),
);
const timeoutSec = Math.max(
  60,
  Number(process.env.PIXVERSE_WORKER_TIMEOUT_SEC ?? "900"),
);

const store = new JobStore({ filePath: storePath });
const marketingStore = new MarketingJobStore({
  filePath: marketingStorePath,
  archiveFilePath: marketingArchivePath,
  latestFilePath: marketingLatestPath,
});
const queue: string[] = [];
const marketingQueue: string[] = [];
let running = 0;
let marketingRunning = 0;

async function runJob(jobId: string) {
  const job = store.get(jobId);
  if (!job) return;

  const template = findTemplate(job.templateId);
  if (!template) {
    const failed: Job = {
      ...job,
      status: "failed",
      finishedAt: nowIso(),
      error: { message: `Template "${job.templateId}" not found.` },
    };
    await store.upsert(failed);
    return;
  }

  const scenes = getScenes(job.variables);
  const durationSec = getSceneDurationSec(template, job.variables);
  const total = scenes.length > 0 ? scenes.length : 1;

  const initialClips: JobClip[] = Array.from({ length: total }).map(
    (_, idx) => ({
      id: `${job.id}_clip_${idx + 1}`,
      sceneIndex: idx + 1,
      sceneTotal: total,
      sceneTitle: scenes[idx] ?? "single_scene",
      durationSec,
      status: "queued",
    }),
  );

  const started: Job = {
    ...job,
    status: "running",
    startedAt: nowIso(),
    progress: { totalClips: total, doneClips: 0 },
    output: { clips: initialClips },
  };
  await store.upsert(started);

  const clips: JobClip[] = [...initialClips];

  for (let idx = 0; idx < total; idx += 1) {
    const current = clips[idx];
    if (!current) continue;

    clips[idx] = { ...current, status: "running", startedAt: nowIso() };
    await store.upsert({
      ...started,
      output: { ...(started.output ?? {}), clips },
    });

    const prompt =
      scenes.length > 0
        ? renderScenePrompt({
            template,
            variables: started.variables,
            scene: scenes[idx] ?? "",
            sceneIndex: idx + 1,
            sceneTotal: total,
          })
        : renderPrompt(template, started.variables);

    const result = await createVideoFromPrompt({
      prompt,
      defaults: template.defaults,
      timeoutSec,
      durationSec,
    });

    if (!result.ok) {
      clips[idx] = {
        ...clips[idx],
        status: "failed",
        finishedAt: nowIso(),
        output: {
          videoId:
            typeof result.videoId === "number" ? result.videoId : undefined,
        },
        error: {
          message: result.message,
          stderr: result.stderr,
          exitCode: result.exitCode,
        },
      };

      const failed: Job = {
        ...started,
        status: "failed",
        finishedAt: nowIso(),
        progress: { totalClips: total, doneClips: idx },
        output: { clips },
        error: {
          message: result.message,
          stderr: result.stderr,
          exitCode: result.exitCode,
        },
      };
      await store.upsert(failed);
      return;
    }

    clips[idx] = {
      ...clips[idx],
      status: "succeeded",
      finishedAt: nowIso(),
      output: {
        videoId: result.videoId,
        videoUrl: result.videoUrl,
        thumbnailUrl: result.coverUrl ?? undefined,
      },
    };

    await store.upsert({
      ...started,
      progress: { totalClips: total, doneClips: idx + 1 },
      output: { clips },
    });
  }

  const succeeded: Job = {
    ...started,
    status: "succeeded",
    finishedAt: nowIso(),
    progress: { totalClips: total, doneClips: total },
    output: { clips },
  };
  await store.upsert(succeeded);
}

async function drainQueue() {
  while (running < maxConcurrency && queue.length > 0) {
    const jobId = queue.shift();
    if (!jobId) continue;
    running += 1;
    runJob(jobId)
      .catch(async (err) => {
        const job = store.get(jobId);
        if (!job) return;
        const failed: Job = {
          ...job,
          status: "failed",
          finishedAt: nowIso(),
          error: {
            message: err instanceof Error ? err.message : "unknown_error",
          },
        };
        await store.upsert(failed);
      })
      .finally(() => {
        running -= 1;
        void drainQueue();
      });
  }
}

async function enqueue(jobId: string) {
  queue.push(jobId);
  await drainQueue();
}

async function runMarketingJob(jobId: string) {
  const job = marketingStore.get(jobId);
  if (!job) return;

  const images = buildMarketingImageAssets(job.input);
  const videos = buildMarketingVideoAssets(job.input);
  const totalAssets = images.length + videos.length;

  const started: MarketingJob = {
    ...job,
    status: "running",
    startedAt: nowIso(),
    progress: {
      totalAssets,
      doneAssets: 0,
    },
    output: {
      images,
      videos,
      docsArchivePath: marketingArchivePath,
      docsLatestPath: marketingLatestPath,
    },
  };

  await marketingStore.upsert(started);

  const nextImages = [...images];
  const nextVideos = [...videos];
  let doneAssets = 0;
  let firstError: MarketingJob["error"] | undefined;

  for (let index = 0; index < nextImages.length; index += 1) {
    const image = nextImages[index];
    if (!image) continue;

    nextImages[index] = {
      ...image,
      status: "running",
      startedAt: nowIso(),
    };

    await marketingStore.upsert({
      ...started,
      output: {
        images: nextImages,
        videos: nextVideos,
        docsArchivePath: marketingArchivePath,
        docsLatestPath: marketingLatestPath,
      },
      progress: {
        totalAssets,
        doneAssets,
      },
    });

    const result = await createImageFromPrompt({
      prompt: image.prompt,
      defaults: {
        model: job.input.imageModel,
        quality: job.input.imageQuality,
        aspectRatio: job.input.imageAspectRatio,
      },
    });

    doneAssets += 1;

    if (!result.ok) {
      const error = {
        message: result.message,
        stderr: result.stderr,
        exitCode: result.exitCode,
      };

      nextImages[index] = {
        ...nextImages[index],
        status: "failed",
        finishedAt: nowIso(),
        rawSubmit: result.rawSubmit,
        error,
      };

      firstError ??= error;
    } else {
      nextImages[index] = {
        ...nextImages[index],
        status: "succeeded",
        finishedAt: nowIso(),
        rawSubmit: result.rawSubmit,
        output: {
          imageId: result.imageId,
          imageUrl: result.imageUrl,
          width: result.width,
          height: result.height,
        },
      };
    }

    await marketingStore.upsert({
      ...started,
      status: firstError ? "failed" : "running",
      progress: {
        totalAssets,
        doneAssets,
      },
      output: {
        images: nextImages,
        videos: nextVideos,
        docsArchivePath: marketingArchivePath,
        docsLatestPath: marketingLatestPath,
      },
      error: firstError,
    });
  }

  for (let index = 0; index < nextVideos.length; index += 1) {
    const video = nextVideos[index];
    if (!video) continue;

    nextVideos[index] = {
      ...video,
      status: "running",
      startedAt: nowIso(),
    };

    await marketingStore.upsert({
      ...started,
      status: firstError ? "failed" : "running",
      progress: {
        totalAssets,
        doneAssets,
      },
      output: {
        images: nextImages,
        videos: nextVideos,
        docsArchivePath: marketingArchivePath,
        docsLatestPath: marketingLatestPath,
      },
      error: firstError,
    });

    const result = await createVideoFromPrompt({
      prompt: video.prompt,
      defaults: {
        model: job.input.videoModel,
        quality: job.input.videoQuality,
        aspectRatio: job.input.videoAspectRatio,
        durationSec: job.input.videoDurationSec,
        audio: false,
        multiShot: true,
      },
      timeoutSec,
      durationSec: job.input.videoDurationSec,
    });

    doneAssets += 1;

    if (!result.ok) {
      const error = {
        message: result.message,
        stderr: result.stderr,
        exitCode: result.exitCode,
      };

      nextVideos[index] = {
        ...nextVideos[index],
        status: "failed",
        finishedAt: nowIso(),
        rawSubmit: result.rawSubmit,
        rawResult: result.rawResult,
        output: {
          videoId:
            typeof result.videoId === "number" ? result.videoId : undefined,
        },
        error,
      };

      firstError ??= error;
    } else {
      nextVideos[index] = {
        ...nextVideos[index],
        status: "succeeded",
        finishedAt: nowIso(),
        rawSubmit: result.rawSubmit,
        rawResult: result.rawResult,
        output: {
          videoId: result.videoId,
          videoUrl: result.videoUrl,
          thumbnailUrl: result.coverUrl ?? undefined,
        },
      };
    }

    await marketingStore.upsert({
      ...started,
      status: firstError ? "failed" : "running",
      progress: {
        totalAssets,
        doneAssets,
      },
      output: {
        images: nextImages,
        videos: nextVideos,
        docsArchivePath: marketingArchivePath,
        docsLatestPath: marketingLatestPath,
      },
      error: firstError,
    });
  }

  await marketingStore.upsert({
    ...started,
    status: firstError ? "failed" : "succeeded",
    finishedAt: nowIso(),
    progress: {
      totalAssets,
      doneAssets,
    },
    output: {
      images: nextImages,
      videos: nextVideos,
      docsArchivePath: marketingArchivePath,
      docsLatestPath: marketingLatestPath,
    },
    error: firstError,
  });
}

async function drainMarketingQueue() {
  while (marketingRunning < maxConcurrency && marketingQueue.length > 0) {
    const jobId = marketingQueue.shift();
    if (!jobId) continue;
    marketingRunning += 1;
    runMarketingJob(jobId)
      .catch(async (error) => {
        const job = marketingStore.get(jobId);
        if (!job) return;

        await marketingStore.upsert({
          ...job,
          status: "failed",
          finishedAt: nowIso(),
          error: {
            message: error instanceof Error ? error.message : "unknown_error",
          },
        });
      })
      .finally(() => {
        marketingRunning -= 1;
        void drainMarketingQueue();
      });
  }
}

async function enqueueMarketingJob(jobId: string) {
  marketingQueue.push(jobId);
  await drainMarketingQueue();
}

function serializeTemplate(t: Template) {
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    fields: t.fields,
    defaults: t.defaults ?? {},
  };
}

async function main() {
  await store.load();
  await marketingStore.load();

  const server = createServer(async (req, res) => {
    const url = new URL(
      req.url ?? "/",
      `http://${req.headers.host ?? "localhost"}`,
    );
    const pathname = url.pathname;

    if (req.method === "GET" && pathname === "/health") {
      json(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && pathname === "/templates") {
      json(res, 200, { ok: true, items: templates.map(serializeTemplate) });
      return;
    }

    if (req.method === "GET" && pathname === "/marketing/archive") {
      const archive = await readJsonFile(marketingArchivePath);
      const latest = await readJsonFile(marketingLatestPath);
      json(res, 200, {
        ok: true,
        archive: archive ?? {
          version: 1,
          updatedAt: nowIso(),
          items: [],
        },
        latest: latest ?? {
          version: 1,
          updatedAt: nowIso(),
          item: null,
        },
        paths: {
          archive: marketingArchivePath,
          latest: marketingLatestPath,
        },
      });
      return;
    }

    if (req.method === "GET" && pathname === "/marketing/jobs") {
      const status = (url.searchParams.get("status") ?? "").trim();
      const items = marketingStore.list({ status: status || undefined });
      json(res, 200, { ok: true, items });
      return;
    }

    if (req.method === "POST" && pathname === "/marketing/jobs") {
      let raw = "";
      try {
        raw = await readBody(req, 1_000_000);
      } catch {
        json(res, 413, { ok: false, error: "payload_too_large" });
        return;
      }

      const parsed = safeParseJson(raw);
      const input = normalizeMarketingInput(parsed);

      if (!input) {
        json(res, 400, { ok: false, error: "invalid_marketing_request" });
        return;
      }

      const job: MarketingJob = {
        id: `marketing_${Date.now()}_${randomBytes(4).toString("hex")}`,
        status: "queued",
        createdAt: nowIso(),
        input,
        output: {
          images: [],
          videos: [],
          docsArchivePath: marketingArchivePath,
          docsLatestPath: marketingLatestPath,
        },
      };

      await marketingStore.upsert(job);
      await enqueueMarketingJob(job.id);
      json(res, 201, { ok: true, job });
      return;
    }

    if (req.method === "GET" && pathname === "/jobs") {
      const status = (url.searchParams.get("status") ?? "").trim();
      const items = store.list({ status: status || undefined });
      json(res, 200, { ok: true, items });
      return;
    }

    if (req.method === "POST" && pathname === "/jobs") {
      let raw = "";
      try {
        raw = await readBody(req, 1_000_000);
      } catch {
        json(res, 413, { ok: false, error: "payload_too_large" });
        return;
      }

      const parsed = safeParseJson(raw);
      if (!parsed || typeof parsed !== "object") {
        json(res, 400, { ok: false, error: "invalid_json" });
        return;
      }

      const body = parsed as Record<string, unknown>;
      const templateId =
        typeof body.templateId === "string" ? body.templateId.trim() : "";
      const template = templateId ? findTemplate(templateId) : null;

      if (!template) {
        json(res, 400, { ok: false, error: "unknown_template" });
        return;
      }

      const variables = normalizeVariables(body.variables, template);
      for (const field of template.fields) {
        if (field.required !== true) continue;
        const v = variables[field.key];
        if (field.type === "list") {
          if (!Array.isArray(v) || v.length === 0) {
            json(res, 400, { ok: false, error: `missing_${field.key}` });
            return;
          }
        } else {
          if (typeof v !== "string" || !v.trim()) {
            json(res, 400, { ok: false, error: `missing_${field.key}` });
            return;
          }
        }
      }

      const job: Job = {
        id: newJobId(),
        templateId: template.id,
        variables,
        status: "queued",
        createdAt: nowIso(),
      };

      await store.upsert(job);
      await enqueue(job.id);
      json(res, 201, { ok: true, job });
      return;
    }

    const jobMatch = pathname.match(/^\/jobs\/([^/]+)$/);
    if (req.method === "GET" && jobMatch) {
      const jobId = decodeURIComponent(jobMatch[1] ?? "");
      const job = store.get(jobId);
      if (!job) {
        json(res, 404, { ok: false, error: "not_found" });
        return;
      }
      json(res, 200, { ok: true, job });
      return;
    }

    const marketingJobMatch = pathname.match(/^\/marketing\/jobs\/([^/]+)$/);
    if (req.method === "GET" && marketingJobMatch) {
      const jobId = decodeURIComponent(marketingJobMatch[1] ?? "");
      const job = marketingStore.get(jobId);
      if (!job) {
        json(res, 404, { ok: false, error: "not_found" });
        return;
      }
      json(res, 200, { ok: true, job });
      return;
    }

    json(res, 404, { ok: false, error: "not_found" });
  });

  server.listen(port);
  process.stdout.write(`pixverse-worker listening on :${port}\n`);
}

void main();
