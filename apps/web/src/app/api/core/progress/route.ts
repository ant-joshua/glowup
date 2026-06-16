import { computeProgressSummary, readCoreStore } from "../../../_lib/coreStore";

export async function GET() {
  const store = await readCoreStore();
  return Response.json({
    ok: true,
    progress: {
      userId: store.user.id,
      summary: computeProgressSummary(store),
      entries: store.progressEntries,
    },
  });
}
