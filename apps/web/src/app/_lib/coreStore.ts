import path from "node:path";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { withStoreLock } from "./storeLock";

export type CoreGoal = { id: string; label: string };

export type CoreUserProfile = {
  id: string;
  name: string;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  occupation: string;
  budgetMonthlyIdr: number;
};

export type CoreRoadmapAction = { id: string; title: string; cadence: string };

export type CoreRoadmapWeek = {
  week: number;
  focus: string;
  actions: CoreRoadmapAction[];
};

export type CoreRoadmap = {
  id: string;
  userId: string;
  horizonDays: number;
  generatedAt: string;
  weeks: CoreRoadmapWeek[];
};

export type CoreProgressEntry = {
  date: string;
  weightKg: number;
  transformationScore: number;
  completedActionIds: string[];
};

export type CoreAnalysisSummary = {
  id: string;
  userId: string;
  createdAt: string;
  confidencePct: number;
  faceShape: string;
  skin: { type: string; concerns: string[] };
  hair: { density: string; concerns: string[] };
  style: { vibe: string; notes: string[] };
  scores: Record<string, number>;
  highlights: string[];
  kind?: string;
};

export type CoreStore = {
  updatedAt: string;
  user: CoreUserProfile;
  goals: CoreGoal[];
  roadmap: CoreRoadmap;
  progressEntries: CoreProgressEntry[];
  analyses: CoreAnalysisSummary[];
};

const defaultStore: CoreStore = {
  updatedAt: "2026-05-01T00:00:00.000Z",
  user: {
    id: "usr_0001",
    name: "Alya Putri",
    age: 28,
    gender: "female",
    heightCm: 162,
    weightKg: 56,
    occupation: "Product Designer",
    budgetMonthlyIdr: 1500000,
  },
  goals: [
    { id: "goal_skin", label: "Better Skin" },
    { id: "goal_fashion", label: "Better Fashion" },
    { id: "goal_branding", label: "Personal Branding" },
  ],
  roadmap: {
    id: "rmp_0001",
    userId: "usr_0001",
    horizonDays: 90,
    generatedAt: "2026-04-20T08:45:00.000Z",
    weeks: [
      {
        week: 1,
        focus: "Baseline & kebiasaan inti",
        actions: [
          { id: "act_001", title: "Skincare AM/PM dasar", cadence: "daily" },
          { id: "act_002", title: "Haircut + konsultasi stylist", cadence: "once" },
          { id: "act_003", title: "Audit wardrobe 30 menit", cadence: "once" },
        ],
      },
      {
        week: 2,
        focus: "Upgrade tampil rapi",
        actions: [
          { id: "act_004", title: "Sunscreen re-apply", cadence: "daily" },
          { id: "act_005", title: "Tambah 2 outfit smart-casual", cadence: "once" },
          { id: "act_006", title: "Latihan postur 10 menit", cadence: "daily" },
        ],
      },
      {
        week: 3,
        focus: "Fitness & energi",
        actions: [
          { id: "act_007", title: "Strength training full body", cadence: "3x/week" },
          { id: "act_008", title: "Langkah 7.000/hari", cadence: "daily" },
          { id: "act_009", title: "Protein target 90g", cadence: "daily" },
        ],
      },
      {
        week: 4,
        focus: "Personal branding",
        actions: [
          { id: "act_010", title: "Update foto profil (natural lighting)", cadence: "once" },
          { id: "act_011", title: "Perbaiki bio & headline", cadence: "once" },
          { id: "act_012", title: "Konsisten grooming sebelum meeting", cadence: "daily" },
        ],
      },
      {
        week: 8,
        focus: "Refinement",
        actions: [
          { id: "act_013", title: "Evaluasi progres skor", cadence: "once" },
          { id: "act_014", title: "Tambah satu signature item", cadence: "once" },
          { id: "act_015", title: "Skin check-in mingguan", cadence: "weekly" },
        ],
      },
      {
        week: 12,
        focus: "Maintenance & scale",
        actions: [
          { id: "act_016", title: "Rencana 90 hari berikutnya", cadence: "once" },
          { id: "act_017", title: "Review wardrobe capsule", cadence: "once" },
          { id: "act_018", title: "Ulangi foto before/after", cadence: "once" },
        ],
      },
    ],
  },
  progressEntries: [
    {
      date: "2026-03-01",
      weightKg: 57.5,
      transformationScore: 65,
      completedActionIds: ["act_001", "act_004"],
    },
    {
      date: "2026-03-15",
      weightKg: 57.0,
      transformationScore: 67,
      completedActionIds: ["act_001", "act_007", "act_008"],
    },
    {
      date: "2026-04-01",
      weightKg: 56.4,
      transformationScore: 69,
      completedActionIds: ["act_001", "act_006", "act_007", "act_008"],
    },
    {
      date: "2026-04-20",
      weightKg: 56.0,
      transformationScore: 71,
      completedActionIds: ["act_001", "act_010", "act_011"],
    },
    {
      date: "2026-05-01",
      weightKg: 56.0,
      transformationScore: 71,
      completedActionIds: ["act_001", "act_012"],
    },
  ],
  analyses: [
    {
      id: "ana_0001",
      userId: "usr_0001",
      createdAt: "2026-04-20T08:30:00.000Z",
      confidencePct: 84,
      faceShape: "oval",
      skin: { type: "combination", concerns: ["acne", "dullness"] },
      hair: { density: "medium", concerns: ["frizz"] },
      style: { vibe: "smart-casual", notes: ["clean lines", "neutral palette"] },
      scores: {
        skin: 72,
        hair: 80,
        fashion: 65,
        grooming: 70,
        fitness: 60,
        personalBranding: 74,
        overall: 71,
      },
      highlights: [
        "Potensi peningkatan terbesar ada di fitness dan fashion.",
        "Konsistensi skincare sudah baik, tinggal fokus pada barrier dan sunscreen.",
        "Gaya smart-casual cocok; optimasi fit dan layering untuk terlihat lebih premium.",
      ],
      kind: "skin",
    },
  ],
};

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

export function getCoreStorePath() {
  const raw = process.env.CORE_STORE_PATH?.trim();
  const fileName = raw ? path.basename(raw) : "core-store.json";
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

export async function readCoreStore(): Promise<CoreStore> {
  const filePath = getCoreStorePath();
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as CoreStore;
    if (!parsed || typeof parsed !== "object") return { ...defaultStore };
    return parsed;
  } catch {
    await writeJsonAtomic(filePath, defaultStore);
    return { ...defaultStore };
  }
}

export async function writeCoreStore(nextStore: CoreStore) {
  const store: CoreStore = { ...nextStore, updatedAt: nowIso() };
  await writeJsonAtomic(getCoreStorePath(), store);
  return store;
}

export function getAllRoadmapActions(roadmap: CoreRoadmap) {
  return roadmap.weeks.flatMap((w) => w.actions);
}

export function todayDateId() {
  return new Date().toISOString().slice(0, 10);
}

export function computeProgressSummary(store: CoreStore) {
  const entries = [...store.progressEntries].sort((a, b) => a.date.localeCompare(b.date));
  const start = entries[0];
  const end = entries[entries.length - 1];

  const startDate = start?.date ?? todayDateId();
  const endDate = end?.date ?? todayDateId();
  const transformationScoreDelta = end && start ? end.transformationScore - start.transformationScore : 0;
  const weightKgDelta = end && start ? Number((end.weightKg - start.weightKg).toFixed(1)) : 0;

  const actions = getAllRoadmapActions(store.roadmap);
  const totalActions = actions.length || 1;
  const completed = new Set<string>();
  for (const entry of entries) {
    for (const id of entry.completedActionIds) completed.add(id);
  }
  const roadmapCompletionPct = Math.round((completed.size / totalActions) * 100);

  return {
    startDate,
    endDate,
    roadmapCompletionPct,
    transformationScoreDelta,
    weightKgDelta,
  };
}

export function normalizeGoals(input: unknown): CoreGoal[] | null {
  if (!Array.isArray(input)) return null;
  const items = input
    .map((v) => {
      if (v && typeof v === "object") {
        const rec = v as Record<string, unknown>;
        const id = typeof rec.id === "string" ? rec.id.trim().slice(0, 80) : "";
        const label = typeof rec.label === "string" ? rec.label.trim().slice(0, 80) : "";
        if (!label) return null;
        return { id: id || `goal_${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "_").slice(0, 40)}`, label };
      }
      const label = String(v ?? "").trim().slice(0, 80);
      if (!label) return null;
      return { id: `goal_${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "_").slice(0, 40)}`, label };
    })
    .filter(Boolean) as CoreGoal[];
  return items.slice(0, 12);
}

export function normalizeProfilePatch(input: unknown) {
  if (!input || typeof input !== "object") return null;
  const rec = input as Record<string, unknown>;
  const out: Partial<Omit<CoreUserProfile, "id">> = {};

  const name = typeof rec.name === "string" ? rec.name.trim().slice(0, 80) : null;
  if (name != null) out.name = name;
  const occupation = typeof rec.occupation === "string" ? rec.occupation.trim().slice(0, 80) : null;
  if (occupation != null) out.occupation = occupation;
  const gender = typeof rec.gender === "string" ? rec.gender.trim().slice(0, 40) : null;
  if (gender != null) out.gender = gender;

  const age = typeof rec.age === "number" ? rec.age : Number(rec.age);
  if (Number.isFinite(age)) out.age = Math.max(10, Math.min(99, Math.round(age)));

  const heightCm = typeof rec.heightCm === "number" ? rec.heightCm : Number(rec.heightCm);
  if (Number.isFinite(heightCm)) out.heightCm = Math.max(100, Math.min(220, Math.round(heightCm)));

  const weightKg = typeof rec.weightKg === "number" ? rec.weightKg : Number(rec.weightKg);
  if (Number.isFinite(weightKg)) out.weightKg = Math.max(30, Math.min(200, Number(weightKg.toFixed(1))));

  const budgetMonthlyIdr = typeof rec.budgetMonthlyIdr === "number" ? rec.budgetMonthlyIdr : Number(rec.budgetMonthlyIdr);
  if (Number.isFinite(budgetMonthlyIdr)) out.budgetMonthlyIdr = Math.max(0, Math.min(200000000, Math.round(budgetMonthlyIdr)));

  return out;
}

export function normalizeProgressEntryInput(input: unknown) {
  if (!input || typeof input !== "object") return null;
  const rec = input as Record<string, unknown>;
  const date = typeof rec.date === "string" && rec.date.trim() ? rec.date.trim().slice(0, 10) : todayDateId();

  const weightKg = typeof rec.weightKg === "number" ? rec.weightKg : Number(rec.weightKg);
  const transformationScore = typeof rec.transformationScore === "number" ? rec.transformationScore : Number(rec.transformationScore);

  const completedActionIds = Array.isArray(rec.completedActionIds)
    ? rec.completedActionIds.map((v) => String(v).trim()).filter(Boolean).slice(0, 200)
    : [];

  return {
    date,
    weightKg: Number.isFinite(weightKg) ? Number(weightKg.toFixed(1)) : 0,
    transformationScore: Number.isFinite(transformationScore) ? Math.round(transformationScore) : 0,
    completedActionIds,
  };
}

export function createAnalysisFromKind(kind: string, userId: string): CoreAnalysisSummary {
  const createdAt = nowIso();
  if (kind === "color") {
    return {
      id: newId("ana"),
      userId,
      createdAt,
      confidencePct: 78,
      faceShape: "oval",
      skin: { type: "normal", concerns: ["dullness"] },
      hair: { density: "medium", concerns: ["dryness"] },
      style: { vibe: "refined-minimal", notes: ["warm neutrals", "soft contrast"] },
      scores: { skin: 74, hair: 72, fashion: 73, grooming: 74, fitness: 66, personalBranding: 70, overall: 72 },
      highlights: ["Undertone cenderung warm.", "Palet earthy akan terlihat paling konsisten.", "Optimasi kontras agar terlihat lebih polished."],
      kind,
    };
  }

  if (kind === "style") {
    return {
      id: newId("ana"),
      userId,
      createdAt,
      confidencePct: 82,
      faceShape: "oval",
      skin: { type: "combination", concerns: ["sensitivity"] },
      hair: { density: "medium", concerns: ["frizz"] },
      style: { vibe: "smart-casual", notes: ["clean lines", "capsule wardrobe", "fit > trend"] },
      scores: { skin: 70, hair: 78, fashion: 72, grooming: 71, fitness: 62, personalBranding: 76, overall: 72 },
      highlights: ["Arah style cocok ke smart-casual.", "Fokus terbesar: fit, layering, dan grooming konsisten.", "Pilih 1–2 signature items untuk membangun identitas."],
      kind,
    };
  }

  return {
    id: newId("ana"),
    userId,
    createdAt,
    confidencePct: 84,
    faceShape: "oval",
    skin: { type: "combination", concerns: ["acne", "dullness"] },
    hair: { density: "medium", concerns: ["frizz"] },
    style: { vibe: "smart-casual", notes: ["clean lines", "neutral palette"] },
    scores: { skin: 72, hair: 80, fashion: 65, grooming: 70, fitness: 60, personalBranding: 74, overall: 71 },
    highlights: [
      "Potensi peningkatan terbesar ada di fitness dan fashion.",
      "Konsistensi skincare sudah baik, tinggal fokus pada barrier dan sunscreen.",
      "Gaya smart-casual cocok; optimasi fit dan layering untuk terlihat lebih premium.",
    ],
    kind,
  };
}
