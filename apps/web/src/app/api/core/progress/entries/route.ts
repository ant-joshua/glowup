import { computeProgressSummary, normalizeProgressEntryInput, readCoreStore, writeCoreStore } from "../../../../_lib/coreStore";

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const normalized = normalizeProgressEntryInput(body);
  if (!normalized) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  if (!normalized.date || normalized.date.length !== 10) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  if (!(normalized.weightKg > 0) || !(normalized.transformationScore > 0)) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readCoreStore();
  const idx = store.progressEntries.findIndex((e) => e.date === normalized.date);
  const nextEntries =
    idx >= 0
      ? store.progressEntries.map((e, i) => (i === idx ? { ...e, ...normalized } : e))
      : [...store.progressEntries, normalized];
  nextEntries.sort((a, b) => a.date.localeCompare(b.date));

  const saved = await writeCoreStore({ ...store, progressEntries: nextEntries });
  return Response.json({
    ok: true,
    progress: {
      userId: saved.user.id,
      summary: computeProgressSummary(saved),
      entries: saved.progressEntries,
    },
  });
}

