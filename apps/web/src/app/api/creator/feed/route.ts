import { normalizePostInput, readCreatorStore, writeCreatorStore } from "../../../_lib/creatorStore";

function nowIso() {
  return new Date().toISOString();
}

function newPostId() {
  return `post_${Date.now()}`;
}

export async function GET(request: Request) {
  const store = await readCreatorStore();
  const { searchParams } = new URL(request.url);
  const scopeRaw = (searchParams.get("scope") ?? "published").toLowerCase();
  const scope = scopeRaw === "all" || scopeRaw === "drafts" || scopeRaw === "published" ? scopeRaw : "published";

  const items =
    scope === "all"
      ? store.feed.items
      : scope === "drafts"
        ? store.feed.items.filter((item) => item.status === "draft")
        : store.feed.items.filter((item) => item.status === "published");

  return Response.json({ ok: true, feed: { ...store.feed, items } });
}

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const normalized = normalizePostInput(body);
  if (!normalized) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readCreatorStore();
  const routine = normalized.routineId
    ? store.routines.find((r) => r.id === normalized.routineId) ?? null
    : null;
  const ts = nowIso();
  const post = {
    id: newPostId(),
    type: normalized.type,
    creator: {
      id: store.creator.id,
      username: store.creator.username,
      displayName: store.creator.displayName,
      verified: store.creator.verified,
    },
    createdAt: ts,
    updatedAt: ts,
    text: normalized.text,
    routine: routine ? { id: routine.id, title: routine.title, durationDays: routine.durationDays } : undefined,
    media: normalized.media,
    metrics: { likes: 0, comments: 0, saves: 0, shares: 0 },
    tags: normalized.tags,
    viewer: { liked: false, saved: false },
    status: normalized.status,
    publishedAt: normalized.status === "published" ? ts : null,
  };

  const saved = await writeCreatorStore({
    ...store,
    feed: { ...store.feed, items: [post, ...store.feed.items].slice(0, 60) },
  });

  return Response.json({ ok: true, post: saved.feed.items[0] }, { status: 201 });
}
