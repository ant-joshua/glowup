import { readCoreStore, writeCoreStore } from "../../../../_lib/coreStore";

function nowIso() {
  return new Date().toISOString();
}

export async function POST() {
  const store = await readCoreStore();
  const nextRoadmap = {
    ...store.roadmap,
    id: `rmp_${Date.now()}`,
    generatedAt: nowIso(),
  };
  const saved = await writeCoreStore({ ...store, roadmap: nextRoadmap });
  return Response.json({ ok: true, roadmap: saved.roadmap });
}

