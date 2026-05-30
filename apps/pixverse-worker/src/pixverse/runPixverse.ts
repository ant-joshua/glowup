import { spawn } from "node:child_process";

import type { TemplateDefaults } from "../jobs/types";

type RunResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

function runCommand(bin: string, args: string[], env: NodeJS.ProcessEnv): Promise<RunResult> {
  return new Promise((resolve) => {
    const child = spawn(bin, args, {
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];

    child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));

    child.on("close", (code) => {
      resolve({
        exitCode: typeof code === "number" ? code : 1,
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
      });
    });
  });
}

function safeParseJson(stdout: string): unknown {
  try {
    return JSON.parse(stdout) as unknown;
  } catch {
    return null;
  }
}

function normalizeDefaults(defaults: TemplateDefaults | undefined) {
  return {
    model: defaults?.model ?? "v6",
    quality: defaults?.quality ?? "720p",
    aspectRatio: defaults?.aspectRatio ?? "9:16",
    durationSec: defaults?.durationSec ?? 8,
    audio: defaults?.audio,
    multiShot: defaults?.multiShot,
  };
}

function buildCreateVideoArgs(prompt: string, defaults: TemplateDefaults | undefined, durationSecOverride?: number) {
  const d = normalizeDefaults(defaults);
  const duration = typeof durationSecOverride === "number" ? durationSecOverride : d.durationSec;
  const args = [
    "pixverse",
    "create",
    "video",
    "--prompt",
    prompt,
    "--model",
    d.model,
    "--quality",
    d.quality,
    "--aspect-ratio",
    d.aspectRatio,
    "--duration",
    String(duration),
    "--no-wait",
    "--json",
  ];

  if (d.audio === true) {
    args.splice(args.length - 2, 0, "--audio");
  } else if (d.audio === false) {
    args.splice(args.length - 2, 0, "--no-audio");
  }

  if (d.multiShot === true) {
    args.splice(args.length - 2, 0, "--multi-shot");
  } else if (d.multiShot === false) {
    args.splice(args.length - 2, 0, "--no-multi-shot");
  }

  return args;
}

function buildCreateImageArgs(
  prompt: string,
  defaults: TemplateDefaults | undefined,
) {
  const d = normalizeDefaults(defaults);

  return [
    "pixverse",
    "create",
    "image",
    "--prompt",
    prompt,
    "--model",
    d.model,
    "--quality",
    d.quality,
    "--aspect-ratio",
    d.aspectRatio,
    "--json",
  ];
}

function buildTaskWaitArgs(videoId: number, timeoutSec: number) {
  return ["pixverse", "task", "wait", String(videoId), "--timeout", String(timeoutSec), "--json"];
}

export async function createVideoFromPrompt({
  prompt,
  defaults,
  timeoutSec,
  durationSec,
}: {
  prompt: string;
  defaults?: TemplateDefaults;
  timeoutSec: number;
  durationSec?: number;
}) {
  const bin = process.env.PIXVERSE_CLI_BIN?.trim() || "npx";
  const env = { ...process.env };

  const submitted = await runCommand(bin, buildCreateVideoArgs(prompt, defaults, durationSec), env);
  const submitJson = safeParseJson(submitted.stdout);

  if (submitted.exitCode !== 0 || !submitJson || typeof submitJson !== "object") {
    return {
      ok: false as const,
      exitCode: submitted.exitCode,
      stderr: submitted.stderr,
      rawSubmit: submitJson,
      message: "PixVerse CLI create video failed.",
    };
  }

  const submitRec = submitJson as Record<string, unknown>;
  const videoIdRaw = submitRec.video_id;
  const videoId = typeof videoIdRaw === "number" ? videoIdRaw : Number(videoIdRaw);

  if (!Number.isFinite(videoId)) {
    return {
      ok: false as const,
      exitCode: submitted.exitCode,
      stderr: submitted.stderr,
      rawSubmit: submitJson,
      message: "PixVerse CLI did not return a valid video_id.",
    };
  }

  const waited = await runCommand(bin, buildTaskWaitArgs(videoId, timeoutSec), env);
  const waitedJson = safeParseJson(waited.stdout);

  if (waited.exitCode !== 0 || !waitedJson || typeof waitedJson !== "object") {
    return {
      ok: false as const,
      exitCode: waited.exitCode,
      stderr: waited.stderr,
      rawSubmit: submitJson,
      rawResult: waitedJson,
      videoId,
      message: "PixVerse CLI task wait failed.",
    };
  }

  const resultRec = waitedJson as Record<string, unknown>;
  const videoUrl = typeof resultRec.video_url === "string" ? resultRec.video_url : null;
  const coverUrl = typeof resultRec.cover_url === "string" ? resultRec.cover_url : null;

  if (!videoUrl) {
    return {
      ok: false as const,
      exitCode: waited.exitCode,
      stderr: waited.stderr,
      rawSubmit: submitJson,
      rawResult: waitedJson,
      videoId,
      message: "PixVerse CLI completed without a video_url.",
    };
  }

  return {
    ok: true as const,
    videoId,
    videoUrl,
    coverUrl,
    rawSubmit: submitJson,
    rawResult: waitedJson,
  };
}

export async function createImageFromPrompt({
  prompt,
  defaults,
}: {
  prompt: string;
  defaults?: TemplateDefaults;
}) {
  const bin = process.env.PIXVERSE_CLI_BIN?.trim() || "npx";
  const env = { ...process.env };
  const created = await runCommand(bin, buildCreateImageArgs(prompt, defaults), env);
  const createdJson = safeParseJson(created.stdout);

  if (created.exitCode !== 0 || !createdJson || typeof createdJson !== "object") {
    return {
      ok: false as const,
      exitCode: created.exitCode,
      stderr: created.stderr,
      rawSubmit: createdJson,
      message: "PixVerse CLI create image failed.",
    };
  }

  const resultRec = createdJson as Record<string, unknown>;
  const imageIdRaw = resultRec.image_id;
  const imageId = typeof imageIdRaw === "number" ? imageIdRaw : Number(imageIdRaw);
  const imageUrl = typeof resultRec.image_url === "string" ? resultRec.image_url : null;
  const width = typeof resultRec.width === "number" ? resultRec.width : undefined;
  const height = typeof resultRec.height === "number" ? resultRec.height : undefined;

  if (!Number.isFinite(imageId) || !imageUrl) {
    return {
      ok: false as const,
      exitCode: created.exitCode,
      stderr: created.stderr,
      rawSubmit: createdJson,
      message: "PixVerse CLI completed without image_id or image_url.",
    };
  }

  return {
    ok: true as const,
    imageId,
    imageUrl,
    width,
    height,
    rawSubmit: createdJson,
  };
}
