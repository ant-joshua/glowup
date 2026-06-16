import path from "node:path";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { withStoreLock } from "./storeLock";

export type IntelligenceCoachMessage = {
  id: string;
  role: "user" | "coach";
  content: string;
  createdAt: string;
};

export type IntelligenceStore = {
  updatedAt: string;
  selectedGoalId: string;
  selectedPersonaId: string;
  coach: { threadId: string; messages: IntelligenceCoachMessage[] };
};

const STARTER_MESSAGES: IntelligenceCoachMessage[] = [
  {
    id: "msg-001",
    role: "user",
    content: "Aku missed routine kemarin.",
    createdAt: "2026-05-30T00:00:00.000Z",
  },
  {
    id: "msg-002",
    role: "coach",
    content: "Lanjutkan besok. Jangan restart dari awal. Yang penting konsisten kembali.",
    createdAt: "2026-05-30T00:00:01.000Z",
  },
];

const defaultStore: IntelligenceStore = {
  updatedAt: "2026-05-30T00:00:00.000Z",
  selectedGoalId: "goal-skin-01",
  selectedPersonaId: "persona-01",
  coach: { threadId: "coach-thread-001", messages: STARTER_MESSAGES },
};

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

export function getIntelligenceStorePath() {
  const raw = process.env.INTELLIGENCE_STORE_PATH?.trim();
  const fileName = raw ? path.basename(raw) : "intelligence-store.json";
  return path.join(process.cwd(), "data", fileName);
}

async function writeJsonAtomic(filePath: string, value: unknown) {
  await withStoreLock(filePath, async () => {
    const dir = path.dirname(filePath);
    await mkdir(dir, { recursive: true });
    const tmp = `${filePath}.${randomBytes(8).toString("hex")}.tmp`;
    await writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
    await rename(tmp, filePath);
  });
}

export async function readIntelligenceStore(): Promise<IntelligenceStore> {
  const filePath = getIntelligenceStorePath();
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as IntelligenceStore;
    if (!parsed || typeof parsed !== "object") return { ...defaultStore };
    return parsed;
  } catch {
    await writeJsonAtomic(filePath, defaultStore);
    return { ...defaultStore };
  }
}

export async function writeIntelligenceStore(next: IntelligenceStore) {
  const saved: IntelligenceStore = { ...next, updatedAt: nowIso() };
  await writeJsonAtomic(getIntelligenceStorePath(), saved);
  return saved;
}

export function normalizeId(input: unknown) {
  const v = typeof input === "string" ? input.trim() : "";
  if (!v) return null;
  if (v.length > 80) return null;
  return v;
}

export function normalizeCoachContent(input: unknown) {
  const v = typeof input === "string" ? input.trim() : "";
  if (!v) return null;
  return v.slice(0, 1000);
}

export function appendCoachMessages(
  store: IntelligenceStore,
  input: { userContent: string; coachContent: string },
) {
  const user: IntelligenceCoachMessage = {
    id: newId("msg"),
    role: "user",
    content: input.userContent,
    createdAt: nowIso(),
  };
  const coach: IntelligenceCoachMessage = {
    id: newId("msg"),
    role: "coach",
    content: input.coachContent,
    createdAt: nowIso(),
  };

  const nextMessages = [...store.coach.messages, user, coach].slice(-80);
  return { ...store, coach: { ...store.coach, messages: nextMessages } };
}

export function resetCoachThread(store: IntelligenceStore) {
  return {
    ...store,
    coach: { threadId: "coach-thread-001", messages: STARTER_MESSAGES },
  };
}
