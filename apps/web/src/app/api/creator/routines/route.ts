import { normalizeRoutineInput, readCreatorStore, writeCreatorStore } from "../../../_lib/creatorStore";

function nowIso() {
  return new Date().toISOString();
}

function newRoutineId() {
  return `rt_${Date.now()}`;
}

export async function GET() {
  const store = await readCreatorStore();
  return Response.json({ ok: true, routines: store.routines });
}

export async function POST(request: Request) {
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
  const id = newRoutineId();
  const ts = nowIso();
  const routine = {
    id,
    creatorId: store.creator.id,
    status: "draft" as const,
    publishedAt: null,
    createdAt: ts,
    updatedAt: ts,
    ...normalized,
  };
  const saved = await writeCreatorStore({ ...store, routines: [routine, ...store.routines] });
  return Response.json({ ok: true, routine: saved.routines.find((r) => r.id === id) ?? routine }, { status: 201 });
}
