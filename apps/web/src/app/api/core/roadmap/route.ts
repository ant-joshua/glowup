import { readCoreStore } from "../../../_lib/coreStore";

export async function GET() {
  const store = await readCoreStore();
  return Response.json({ ok: true, roadmap: store.roadmap });
}
