import { readIntelligenceStore, resetCoachThread, writeIntelligenceStore } from "../../../../_lib/intelligenceStore";

export async function POST() {
  const store = await readIntelligenceStore();
  const saved = await writeIntelligenceStore(resetCoachThread(store));

  return Response.json({
    ok: true,
    thread: saved.coach,
    updatedAt: saved.updatedAt,
  });
}

