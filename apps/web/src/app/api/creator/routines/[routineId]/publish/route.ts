import { readCreatorStore, writeCreatorStore } from "../../../../../_lib/creatorStore";

function nowIso() {
  return new Date().toISOString();
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ routineId: string }> },
) {
  const { routineId } = await params;
  const id = String(routineId ?? "").trim();
  if (!id) return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const published = rec.published === true;

  const store = await readCreatorStore();
  const existing = store.routines.find((r) => r.id === id) ?? null;
  if (!existing) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const ts = nowIso();
  const updated = {
    ...existing,
    status: published ? ("published" as const) : ("draft" as const),
    publishedAt: published ? (existing.publishedAt ?? ts) : null,
    updatedAt: ts,
  };

  const saved = await writeCreatorStore({
    ...store,
    routines: store.routines.map((r) => (r.id === id ? updated : r)),
  });

  return Response.json({ ok: true, routine: saved.routines.find((r) => r.id === id) ?? updated });
}

