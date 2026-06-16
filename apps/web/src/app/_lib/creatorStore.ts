import "server-only";

import path from "node:path";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { withStoreLock } from "./storeLock";

export type CreatorLinks = {
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  website: string | null;
};

export type CreatorProfile = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  verified: boolean;
  avatar: { url: string; blurhash: string };
  links: CreatorLinks;
  stats: {
    followers: number;
    following: number;
    routines: number;
    collections: number;
  };
  updatedAt: string;
};

export type CreatorRoutineStep = {
  id: string;
  title: string;
  timeOfDay: string;
  notes: string;
};

export type CreatorRoutineProduct = {
  id: string;
  type: string;
  name: string;
  affiliateUrl: string | null;
};

export type CreatorRoutine = {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: string;
  targetAudience: string[];
  difficulty: string;
  budgetRangeIdr: { min: number; max: number };
  durationDays: number;
  steps: CreatorRoutineStep[];
  products: CreatorRoutineProduct[];
  expectedOutcome: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatorFeedItem = {
  id: string;
  type: string;
  creator: { id: string; username: string; displayName: string; verified: boolean };
  createdAt: string;
  updatedAt: string;
  text: string;
  routine?: { id: string; title: string; durationDays: number };
  media: Array<{ kind: string; url: string }>;
  metrics: { likes: number; comments: number; saves: number; shares: number };
  tags: string[];
  viewer?: { liked: boolean; saved: boolean };
  status: "draft" | "published";
  publishedAt: string | null;
};

export type CreatorStore = {
  updatedAt: string;
  creator: CreatorProfile;
  routines: CreatorRoutine[];
  feed: { type: string; cursor: string | null; items: CreatorFeedItem[] };
};

function nowIso() {
  return new Date().toISOString();
}

function toImageUrl(prompt: string, imageSize: string) {
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${encodeURIComponent(imageSize)}`;
}

function newId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

const defaultStore: CreatorStore = {
  updatedAt: "2026-05-01T00:00:00.000Z",
  creator: {
    id: "cr_0007",
    userId: "usr_0001",
    username: "alya.glow",
    displayName: "Alya Putri",
    bio: "Skincare minimalis + gaya smart-casual untuk kerja. Fokus: barrier, sunscreen, dan wardrobe capsule.",
    verified: true,
    avatar: {
      url: toImageUrl(
        "portrait photo, Indonesian woman, soft natural light, warm neutral background, high-end editorial headshot, 85mm, ultra realistic",
        "square",
      ),
      blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
    },
    links: {
      instagram: "https://instagram.com/alya.glow",
      tiktok: "https://tiktok.com/@alya.glow",
      youtube: null,
      website: "https://example.com/alya",
    },
    stats: {
      followers: 12840,
      following: 214,
      routines: 2,
      collections: 3,
    },
    updatedAt: "2026-05-01T00:00:00.000Z",
  },
  routines: [
    {
      id: "rt_0101",
      creatorId: "cr_0007",
      title: "7 Hari Barrier Reset (Kulit Kombinasi)",
      description:
        "Rutinitas singkat untuk menenangkan iritasi ringan dan menguatkan skin barrier. Fokus: gentle cleanse, hidrasi, dan sunscreen.",
      category: "skincare",
      targetAudience: ["combination", "sensitive"],
      difficulty: "beginner",
      budgetRangeIdr: { min: 150000, max: 450000 },
      durationDays: 7,
      steps: [
        {
          id: "st_001",
          title: "Cleanser lembut",
          timeOfDay: "am/pm",
          notes: "Pilih yang pH-balanced, tanpa parfum kuat.",
        },
        {
          id: "st_002",
          title: "Hydrating toner/essence",
          timeOfDay: "am/pm",
          notes: "Layer 1-2 kali sesuai kebutuhan.",
        },
        {
          id: "st_003",
          title: "Moisturizer ceramide",
          timeOfDay: "am/pm",
          notes: "Tekstur gel-cream untuk kulit kombinasi.",
        },
        {
          id: "st_004",
          title: "Sunscreen SPF 50",
          timeOfDay: "am",
          notes: "Re-apply 2-3 jam sekali jika outdoor.",
        },
      ],
      products: [
        { id: "pd_001", type: "cleanser", name: "Gentle Cleanser", affiliateUrl: null },
        { id: "pd_002", type: "moisturizer", name: "Ceramide Gel-Cream", affiliateUrl: null },
        { id: "pd_003", type: "sunscreen", name: "SPF 50 PA++++", affiliateUrl: null },
      ],
      expectedOutcome: ["Kemerahan berkurang", "Kulit terasa lebih lembap", "Minyak lebih terkontrol"],
      status: "published",
      publishedAt: "2026-03-12T10:00:00.000Z",
      createdAt: "2026-03-12T10:00:00.000Z",
      updatedAt: "2026-04-05T10:00:00.000Z",
    },
    {
      id: "rt_0102",
      creatorId: "cr_0007",
      title: "Wardrobe Capsule Smart-Casual (10 Item)",
      description:
        "Template wardrobe capsule untuk tampil rapi di kantor tanpa banyak mikir. Netral, mudah mix-and-match.",
      category: "fashion",
      targetAudience: ["office", "smart-casual"],
      difficulty: "intermediate",
      budgetRangeIdr: { min: 800000, max: 2500000 },
      durationDays: 14,
      steps: [
        { id: "st_101", title: "Pilih palet warna netral", timeOfDay: "any", notes: "Hitam, putih, navy, beige." },
        { id: "st_102", title: "Audit ukuran & fit", timeOfDay: "any", notes: "Prioritaskan bahu dan panjang celana." },
        { id: "st_103", title: "Tambah 1 statement item", timeOfDay: "any", notes: "Misal blazer atau loafers." },
      ],
      products: [
        { id: "pd_101", type: "apparel", name: "Blazer navy", affiliateUrl: null },
        { id: "pd_102", type: "apparel", name: "Straight pants hitam", affiliateUrl: null },
        { id: "pd_103", type: "footwear", name: "Loafers kulit", affiliateUrl: null },
      ],
      expectedOutcome: ["Outfit lebih konsisten", "Lebih hemat waktu", "Look terlihat lebih premium"],
      status: "published",
      publishedAt: "2026-02-02T09:00:00.000Z",
      createdAt: "2026-02-02T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ],
  feed: {
    type: "for-you",
    cursor: null,
    items: [
      {
        id: "post_2001",
        type: "transformation-update",
        creator: { id: "cr_0007", username: "alya.glow", displayName: "Alya Putri", verified: true },
        createdAt: "2026-04-20T11:00:00.000Z",
        updatedAt: "2026-04-20T11:00:00.000Z",
        text: "Minggu ke-6: kulit lebih stabil setelah barrier reset. Fokus berikutnya: sunscreen re-apply dan tidur cukup.",
        media: [
          {
            kind: "image",
            url: toImageUrl(
              "editorial skincare, minimal skincare products on warm stone, soft daylight, clean composition, premium aesthetic, ultra realistic",
              "landscape_16_9",
            ),
          },
          {
            kind: "image",
            url: toImageUrl(
              "close-up skin texture, soft natural light, premium editorial beauty photography, ultra realistic, shallow depth of field",
              "landscape_16_9",
            ),
          },
        ],
        metrics: { likes: 1820, comments: 96, saves: 410, shares: 53 },
        tags: ["skincare", "barrier", "sunscreen"],
        viewer: { liked: false, saved: false },
        status: "published",
        publishedAt: "2026-04-20T11:00:00.000Z",
      },
      {
        id: "post_2002",
        type: "routine",
        creator: { id: "cr_0007", username: "alya.glow", displayName: "Alya Putri", verified: true },
        createdAt: "2026-04-05T12:00:00.000Z",
        updatedAt: "2026-04-05T12:00:00.000Z",
        routine: { id: "rt_0101", title: "7 Hari Barrier Reset (Kulit Kombinasi)", durationDays: 7 },
        text: "Rutinitas cepat untuk balik ke basics saat kulit lagi rewel. Cocok buat pemula.",
        media: [
          {
            kind: "image",
            url: toImageUrl(
              "flatlay skincare routine, cleanser toner moisturizer sunscreen arranged neatly, warm minimal background, editorial, ultra realistic",
              "landscape_16_9",
            ),
          },
        ],
        metrics: { likes: 940, comments: 31, saves: 260, shares: 18 },
        tags: ["routine", "skincare"],
        viewer: { liked: false, saved: false },
        status: "published",
        publishedAt: "2026-04-05T12:00:00.000Z",
      },
      {
        id: "post_2003",
        type: "outfit-showcase",
        creator: { id: "cr_0007", username: "alya.glow", displayName: "Alya Putri", verified: true },
        createdAt: "2026-03-28T08:15:00.000Z",
        updatedAt: "2026-03-28T08:15:00.000Z",
        text: "Smart-casual buat meeting: blazer navy + kaos putih + straight pants hitam. Kuncinya fit dan sepatu bersih.",
        media: [
          {
            kind: "image",
            url: toImageUrl(
              "smart casual outfit laid out, navy blazer white tee black straight pants loafers, warm neutral background, editorial flatlay, ultra realistic",
              "landscape_16_9",
            ),
          },
        ],
        metrics: { likes: 1560, comments: 44, saves: 520, shares: 39 },
        tags: ["fashion", "smartcasual", "office"],
        viewer: { liked: false, saved: false },
        status: "published",
        publishedAt: "2026-03-28T08:15:00.000Z",
      },
    ],
  },
};

export function getCreatorStorePath() {
  const raw = process.env.CREATOR_STORE_PATH?.trim();
  const fileName = raw ? path.basename(raw) : "creator-store.json";
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

export async function readCreatorStore(): Promise<CreatorStore> {
  const filePath = getCreatorStorePath();
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<CreatorStore>;
    if (!parsed || typeof parsed !== "object") return { ...defaultStore };

    const routinesIn = Array.isArray(parsed.routines) ? parsed.routines : defaultStore.routines;
    const routines = routinesIn.map((r) => ({
      ...r,
      status: (r as { status?: string }).status === "draft" ? "draft" : "published",
      publishedAt: (r as { publishedAt?: string | null }).publishedAt ?? ((r as { createdAt?: string }).createdAt ?? null),
    })) as CreatorRoutine[];

    const feedIn = parsed.feed && typeof parsed.feed === "object" ? parsed.feed : defaultStore.feed;
    const itemsIn = Array.isArray(feedIn.items) ? feedIn.items : defaultStore.feed.items;
    const items = itemsIn.map((item) => ({
      ...item,
      updatedAt: (item as { updatedAt?: string }).updatedAt ?? (item as { createdAt?: string }).createdAt ?? nowIso(),
      status: (item as { status?: string }).status === "draft" ? "draft" : "published",
      publishedAt:
        (item as { publishedAt?: string | null }).publishedAt ??
        ((item as { createdAt?: string }).createdAt ?? null),
    })) as CreatorFeedItem[];

    return {
      ...defaultStore,
      ...parsed,
      routines,
      feed: { ...defaultStore.feed, ...feedIn, items },
    };
  } catch {
    await writeJsonAtomic(filePath, defaultStore);
    return { ...defaultStore };
  }
}

export async function writeCreatorStore(next: CreatorStore) {
  const store: CreatorStore = { ...next, updatedAt: nowIso() };
  store.creator = { ...store.creator, updatedAt: store.updatedAt };
  store.creator.stats = {
    ...store.creator.stats,
    routines: store.routines.length,
  };
  await writeJsonAtomic(getCreatorStorePath(), store);
  return store;
}

export function normalizeLink(value: unknown) {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) return null;
  if (v.length > 200) return null;
  return v;
}

export function normalizeProfilePatch(input: unknown) {
  if (!input || typeof input !== "object") return null;
  const rec = input as Record<string, unknown>;

  const displayName =
    typeof rec.displayName === "string" ? rec.displayName.trim().slice(0, 80) : undefined;
  const bio = typeof rec.bio === "string" ? rec.bio.trim().slice(0, 280) : undefined;
  const avatarUrl =
    typeof rec.avatarUrl === "string" ? rec.avatarUrl.trim().slice(0, 400) : undefined;

  const linksIn = rec.links && typeof rec.links === "object" ? (rec.links as Record<string, unknown>) : null;
  const links: Partial<CreatorLinks> | undefined = linksIn
    ? {
        instagram: normalizeLink(linksIn.instagram),
        tiktok: normalizeLink(linksIn.tiktok),
        youtube: normalizeLink(linksIn.youtube),
        website: normalizeLink(linksIn.website),
      }
    : undefined;

  return { displayName, bio, avatarUrl, links };
}

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function normalizeRoutineInput(input: unknown) {
  if (!input || typeof input !== "object") return null;
  const rec = input as Record<string, unknown>;
  const title = typeof rec.title === "string" ? rec.title.trim().slice(0, 120) : "";
  if (!title) return null;

  const description = typeof rec.description === "string" ? rec.description.trim().slice(0, 800) : "";
  const category = typeof rec.category === "string" ? rec.category.trim().slice(0, 40) : "skincare";
  const difficulty = typeof rec.difficulty === "string" ? rec.difficulty.trim().slice(0, 40) : "beginner";
  const durationDays = clampInt(rec.durationDays, 1, 90, 7);

  const targetAudience = Array.isArray(rec.targetAudience)
    ? rec.targetAudience.map((v) => String(v).trim()).filter(Boolean).slice(0, 12)
    : typeof rec.targetAudience === "string"
      ? rec.targetAudience.split(",").map((v) => v.trim()).filter(Boolean).slice(0, 12)
      : [];

  const budgetIn = rec.budgetRangeIdr && typeof rec.budgetRangeIdr === "object" ? (rec.budgetRangeIdr as Record<string, unknown>) : null;
  const budgetMin = clampInt(budgetIn?.min, 0, 200000000, 0);
  const budgetMax = clampInt(budgetIn?.max, 0, 200000000, Math.max(budgetMin, 500000));

  const steps = Array.isArray(rec.steps)
    ? rec.steps
        .map((v) => {
          if (!v || typeof v !== "object") return null;
          const s = v as Record<string, unknown>;
          const stTitle = typeof s.title === "string" ? s.title.trim().slice(0, 120) : "";
          if (!stTitle) return null;
          return {
            id: typeof s.id === "string" && s.id.trim() ? s.id.trim().slice(0, 80) : newId("st"),
            title: stTitle,
            timeOfDay: typeof s.timeOfDay === "string" ? s.timeOfDay.trim().slice(0, 20) : "any",
            notes: typeof s.notes === "string" ? s.notes.trim().slice(0, 240) : "",
          };
        })
        .filter(
          (s): s is { id: string; title: string; timeOfDay: string; notes: string } => Boolean(s),
        )
        .slice(0, 30)
    : [];

  const products = Array.isArray(rec.products)
    ? rec.products
        .map((v) => {
          if (!v || typeof v !== "object") return null;
          const p = v as Record<string, unknown>;
          const name = typeof p.name === "string" ? p.name.trim().slice(0, 120) : "";
          if (!name) return null;
          return {
            id: typeof p.id === "string" && p.id.trim() ? p.id.trim().slice(0, 80) : newId("pd"),
            type: typeof p.type === "string" ? p.type.trim().slice(0, 40) : "product",
            name,
            affiliateUrl: normalizeLink(p.affiliateUrl),
          };
        })
        .filter(
          (p): p is { id: string; type: string; name: string; affiliateUrl: string | null } => Boolean(p),
        )
        .slice(0, 30)
    : [];

  const expectedOutcome = Array.isArray(rec.expectedOutcome)
    ? rec.expectedOutcome.map((v) => String(v).trim()).filter(Boolean).slice(0, 12)
    : typeof rec.expectedOutcome === "string"
      ? rec.expectedOutcome.split("\n").map((v) => v.trim()).filter(Boolean).slice(0, 12)
      : [];

  return {
    title,
    description,
    category,
    difficulty,
    durationDays,
    targetAudience,
    budgetRangeIdr: { min: budgetMin, max: budgetMax },
    steps,
    products,
    expectedOutcome,
  };
}

export function normalizePostInput(input: unknown) {
  if (!input || typeof input !== "object") return null;
  const rec = input as Record<string, unknown>;
  const type = typeof rec.type === "string" ? rec.type.trim().slice(0, 40) : "transformation-update";
  const text = typeof rec.text === "string" ? rec.text.trim().slice(0, 800) : "";
  if (!text) return null;

  const tags = Array.isArray(rec.tags)
    ? rec.tags.map((v) => String(v).trim()).filter(Boolean).slice(0, 12)
    : typeof rec.tags === "string"
      ? rec.tags.split(",").map((v) => v.trim().replaceAll("#", "")).filter(Boolean).slice(0, 12)
      : [];

  const media = Array.isArray(rec.media)
    ? rec.media
        .map((v) => {
          if (!v || typeof v !== "object") return null;
          const m = v as Record<string, unknown>;
          const url = typeof m.url === "string" ? m.url.trim().slice(0, 500) : "";
          if (!url) return null;
          return { kind: typeof m.kind === "string" ? m.kind.trim().slice(0, 20) : "image", url };
        })
        .filter((m): m is { kind: string; url: string } => Boolean(m))
        .slice(0, 6)
    : typeof rec.mediaUrl === "string" && rec.mediaUrl.trim()
      ? [{ kind: "image", url: rec.mediaUrl.trim().slice(0, 500) }]
      : [];

  const routineId = typeof rec.routineId === "string" ? rec.routineId.trim() : "";
  const statusRaw = typeof rec.status === "string" ? rec.status.trim().toLowerCase() : "";
  const status = statusRaw === "draft" ? ("draft" as const) : ("published" as const);
  return { type, text, tags, media, routineId, status };
}
