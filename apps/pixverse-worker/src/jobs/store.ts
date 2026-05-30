import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { Job } from "./types";

type StoreState = {
  jobs: Record<string, Job>;
};

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
  const dir = dirname(filePath);
  await ensureDir(dir);
  const tmpPath = `${filePath}.tmp`;
  await writeFile(tmpPath, JSON.stringify(value, null, 2), "utf8");
  await rename(tmpPath, filePath);
}

export class JobStore {
  private readonly filePath: string;
  private state: StoreState = { jobs: {} };

  constructor({ filePath }: { filePath: string }) {
    this.filePath = filePath;
  }

  async load() {
    let raw = "";
    try {
      raw = await readFile(this.filePath, "utf8");
    } catch {
      raw = "";
    }

    if (!raw.trim()) {
      this.state = { jobs: {} };
      return;
    }

    const parsed = safeParseJson(raw);
    if (!parsed || typeof parsed !== "object") {
      this.state = { jobs: {} };
      return;
    }

    const rec = parsed as Partial<StoreState>;
    this.state = { jobs: rec.jobs && typeof rec.jobs === "object" ? (rec.jobs as Record<string, Job>) : {} };
  }

  list({ status }: { status?: string } = {}) {
    const all = Object.values(this.state.jobs);
    const filtered = status ? all.filter((j) => j.status === status) : all;
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  get(jobId: string) {
    return this.state.jobs[jobId] ?? null;
  }

  async upsert(job: Job) {
    this.state.jobs[job.id] = job;
    await writeJsonAtomic(this.filePath, this.state);
  }
}

