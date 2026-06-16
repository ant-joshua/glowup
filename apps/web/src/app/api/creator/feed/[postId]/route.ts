import { normalizePostInput, readCreatorStore, writeCreatorStore } from "../../../../_lib/creatorStore";

function nowIso() {
  return new Date().toISOString();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  const id = String(postId ?? "").trim();
  if (!id) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readCreatorStore();
  const post = store.feed.items.find((p) => p.id === id) ?? null;
  if (!post) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return Response.json({ ok: true, post });
}

export async function PUT(
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

  const normalized = normalizePostInput(body);
  if (!normalized) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readCreatorStore();
  const existing = store.feed.items.find((p) => p.id === id) ?? null;
  if (!existing) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const routine = normalized.routineId
    ? store.routines.find((r) => r.id === normalized.routineId) ?? null
    : null;

  const ts = nowIso();
  const nextStatus = normalized.status;
  const publishedAt =
    nextStatus === "published" ? (existing.publishedAt ?? ts) : null;

  const updated = {
    ...existing,
    type: normalized.type,
    text: normalized.text,
    tags: normalized.tags,
    media: normalized.media,
    routine: routine ? { id: routine.id, title: routine.title, durationDays: routine.durationDays } : undefined,
    status: nextStatus,
    publishedAt,
    updatedAt: ts,
  };

  const saved = await writeCreatorStore({
    ...store,
    feed: { ...store.feed, items: store.feed.items.map((p) => (p.id === id ? updated : p)) },
  });

  return Response.json({ ok: true, post: saved.feed.items.find((p) => p.id === id) ?? updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  const id = String(postId ?? "").trim();
  if (!id) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readCreatorStore();
  const exists = store.feed.items.some((p) => p.id === id);
  if (!exists) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const saved = await writeCreatorStore({
    ...store,
    feed: { ...store.feed, items: store.feed.items.filter((p) => p.id !== id) },
  });

  return Response.json({ ok: true, feed: saved.feed });
}

