import { normalizeGoals, normalizeProfilePatch, readCoreStore, writeCoreStore } from "../../../_lib/coreStore";

export async function GET() {
  const store = await readCoreStore();
  return Response.json({
    ok: true,
    user: store.user,
    goals: store.goals,
    updatedAt: store.updatedAt,
  });
}

export async function PUT(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const rec = body as Record<string, unknown>;
  const userPatch = normalizeProfilePatch(rec.user ?? rec);
  const goals = rec.goals !== undefined ? normalizeGoals(rec.goals) : null;

  if (!userPatch && rec.goals !== undefined && !goals) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readCoreStore();
  const next = {
    ...store,
    user: userPatch ? { ...store.user, ...userPatch } : store.user,
    goals: goals ?? store.goals,
  };
  const saved = await writeCoreStore(next);

  return Response.json({
    ok: true,
    user: saved.user,
    goals: saved.goals,
    updatedAt: saved.updatedAt,
  });
}
