import { normalizeRoutineInput, readCreatorStore, writeCreatorStore } from "../../../../_lib/creatorStore";

function nowIso() {
  return new Date().toISOString();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ routineId: string }> },
) {
  const { routineId } = await params;
  const id = String(routineId ?? "").trim();
  const store = await readCreatorStore();
  const routine = store.routines.find((r) => r.id === id) ?? null;
  if (!routine) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return Response.json({ ok: true, routine });
}

export async function PUT(
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

  const normalized = normalizeRoutineInput(body);
  if (!normalized) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readCreatorStore();
  const existing = store.routines.find((r) => r.id === id);
  if (!existing) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const updated = { ...existing, ...normalized, updatedAt: nowIso() };
  const saved = await writeCreatorStore({
    ...store,
    routines: store.routines.map((r) => (r.id === id ? updated : r)),
  });

  return Response.json({ ok: true, routine: saved.routines.find((r) => r.id === id) ?? updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ routineId: string }> },
) {
  const { routineId } = await params;
  const id = String(routineId ?? "").trim();
  if (!id) return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });

  const store = await readCreatorStore();
  const exists = store.routines.some((r) => r.id === id);
  if (!exists) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const saved = await writeCreatorStore({ ...store, routines: store.routines.filter((r) => r.id !== id) });
  return Response.json({ ok: true, routines: saved.routines });
}

