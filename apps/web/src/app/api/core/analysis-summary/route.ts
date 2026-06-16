import { createAnalysisFromKind, readCoreStore, writeCoreStore } from "../../../_lib/coreStore";

export async function GET() {
  const store = await readCoreStore();
  const latest = store.analyses[store.analyses.length - 1];
  if (latest) {
    return Response.json({ ok: true, analysis: latest });
  }

  const created = createAnalysisFromKind("skin", store.user.id);
  const saved = await writeCoreStore({ ...store, analyses: [created] });
  return Response.json({ ok: true, analysis: saved.analyses[saved.analyses.length - 1] });
}
