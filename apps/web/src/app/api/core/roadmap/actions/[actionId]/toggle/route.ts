import { computeProgressSummary, readCoreStore, todayDateId, writeCoreStore } from "../../../../../../_lib/coreStore";

function normalizeDate(input: unknown) {
  if (typeof input !== "string") return todayDateId();
  const v = input.trim().slice(0, 10);
  return v.length === 10 ? v : todayDateId();
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ actionId: string }> },
) {
  const { actionId } = await params;
  const id = String(actionId ?? "").trim();
  if (!id) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const rec =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const date = normalizeDate(rec.date);

  const store = await readCoreStore();
  const actionKnown = store.roadmap.weeks.some((w) => w.actions.some((a) => a.id === id));
  if (!actionKnown) {
    return Response.json({ ok: false, error: "unknown_action" }, { status: 404 });
  }

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
