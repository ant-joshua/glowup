import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type { MarketingArchive, MarketingJob, MarketingLatest } from "./types";

function nowIso() {
  return new Date().toISOString();
}

function safeParseJson(input: string): unknown {
  try {
    return JSON.parse(input) as unknown;
  } catch {
    return null;
  }
}

async function ensureDir(path: string) {
  await mkdir(path, { recursive: true });
}

async function writeJsonAtomic(filePath: string, value: unknown) {
  const absolutePath = resolve(process.cwd(), filePath);
  const dir = dirname(absolutePath);
  const tmpPath = `${absolutePath}.tmp`;

  await ensureDir(dir);
  await writeFile(tmpPath, JSON.stringify(value, null, 2), "utf8");
  await rename(tmpPath, absolutePath);
}

async function readArchive(filePath: string) {
  const absolutePath = resolve(process.cwd(), filePath);

  try {
    const raw = await readFile(absolutePath, "utf8");
    const parsed = safeParseJson(raw);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const rec = parsed as Partial<MarketingArchive>;

    return {
      version: 1 as const,
      updatedAt: typeof rec.updatedAt === "string" ? rec.updatedAt : nowIso(),
      items: Array.isArray(rec.items) ? rec.items : [],
    };
  } catch {
    return null;
  }
}

export async function recordMarketingJobInDocs({
  archiveFilePath,
  latestFilePath,
  job,
}: {
  archiveFilePath: string;
  latestFilePath: string;
  job: MarketingJob;
}) {
  const currentArchive = (await readArchive(archiveFilePath)) ?? {
    version: 1 as const,
    updatedAt: nowIso(),
    items: [],
  };

  const nextItems = currentArchive.items.filter((item) => item.id !== job.id);
  nextItems.unshift(job);

  const archive: MarketingArchive = {
    version: 1,
    updatedAt: nowIso(),
    items: nextItems,
  };

  const latest: MarketingLatest = {
    version: 1,
    updatedAt: archive.updatedAt,
    item: job,
  };

  await writeJsonAtomic(archiveFilePath, archive);
  await writeJsonAtomic(latestFilePath, latest);
}
