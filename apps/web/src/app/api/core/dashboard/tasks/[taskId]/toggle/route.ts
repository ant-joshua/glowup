import { computeProgressSummary, readCoreStore, todayDateId, writeCoreStore } from "../../../../../../_lib/coreStore";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;
  const id = String(taskId ?? "").trim();
  if (!id) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readCoreStore();
  const actionKnown = store.roadmap.weeks.some((w) => w.actions.some((a) => a.id === id));
  if (!actionKnown) {
    return Response.json({ ok: false, error: "unknown_task" }, { status: 404 });
  }

  const date = todayDateId();
  const entries = [...store.progressEntries].sort((a, b) => a.date.localeCompare(b.date));
  const last = entries[entries.length - 1];
  const idx = entries.findIndex((e) => e.date === date);
  const current =
    idx >= 0
      ? entries[idx]
      : {
          date,
          weightKg: last?.weightKg ?? store.user.weightKg,
          transformationScore: last?.transformationScore ?? store.analyses.at(-1)?.scores.overall ?? 70,
          completedActionIds: [],
        };

  const set = new Set(current.completedActionIds);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  const updatedEntry = { ...current, completedActionIds: [...set] };

  const nextEntries =
    idx >= 0 ? entries.map((e, i) => (i === idx ? updatedEntry : e)) : [...entries, updatedEntry];
  nextEntries.sort((a, b) => a.date.localeCompare(b.date));
  const saved = await writeCoreStore({ ...store, progressEntries: nextEntries });

  return Response.json({
    ok: true,
    date,
    entry: saved.progressEntries.find((e) => e.date === date) ?? updatedEntry,
    progress: {
      userId: saved.user.id,
      summary: computeProgressSummary(saved),
      entries: saved.progressEntries,
    },
  });
}

