import { readCreatorStore, writeCreatorStore } from "../../../../../_lib/creatorStore";

function normalizeAction(input: unknown) {
  const v = typeof input === "string" ? input.trim().toLowerCase() : "";
  if (v === "like" || v === "save" || v === "share") return v;
  return null;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  const id = String(postId ?? "").trim();
  if (!id) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const action = normalizeAction(rec.action);
  if (!action) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readCreatorStore();
  const existing = store.feed.items.find((p) => p.id === id);
  if (!existing) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const viewer = existing.viewer ?? { liked: false, saved: false };
  const next = { ...existing, viewer: { ...viewer }, metrics: { ...existing.metrics } };

  if (action === "like") {
    const liked = !viewer.liked;
    next.viewer.liked = liked;
    next.metrics.likes = Math.max(0, next.metrics.likes + (liked ? 1 : -1));
  }

  if (action === "save") {
    const savedFlag = !viewer.saved;
    next.viewer.saved = savedFlag;
    next.metrics.saves = Math.max(0, next.metrics.saves + (savedFlag ? 1 : -1));
  }

  if (action === "share") {
    next.metrics.shares = Math.max(0, next.metrics.shares + 1);
  }

  const savedStore = await writeCreatorStore({
    ...store,
    feed: {
      ...store.feed,
      items: store.feed.items.map((p) => (p.id === id ? next : p)),
    },
  });

  const post = savedStore.feed.items.find((p) => p.id === id) ?? next;
  return Response.json({ ok: true, post });
}
