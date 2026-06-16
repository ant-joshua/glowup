import { normalizeId, readIntelligenceStore, writeIntelligenceStore } from "../../../_lib/intelligenceStore";

const goals = [
  {
    id: "goal-skin-01",
    title: "Better Skin",
    category: "Skincare",
    summary: "Kurangi jerawat aktif dan bekasnya, serta perbaiki tekstur kulit.",
    primaryMetric: "skin_clarity_score",
    target: { from: 62, to: 80, unit: "/100" },
  },
  {
    id: "goal-fitness-01",
    title: "Weight Loss",
    category: "Fitness",
    summary: "Turunkan berat badan secara bertahap dan konsisten.",
    primaryMetric: "weight_kg",
    target: { from: 78, to: 72, unit: "kg" },
  },
  {
    id: "goal-style-01",
    title: "Professional Appearance",
    category: "Fashion",
    summary: "Bangun wardrobe yang rapi dan sesuai konteks profesional.",
    primaryMetric: "style_consistency_score",
    target: { from: 55, to: 75, unit: "/100" },
  },
  {
    id: "goal-event-01",
    title: "Wedding Preparation",
    category: "Lifestyle",
    summary: "Rencana 90 hari untuk siap acara besar: kulit, rambut, dan stamina.",
    primaryMetric: "readiness_score",
    target: { from: 48, to: 82, unit: "/100" },
  },
  {
    id: "goal-brand-01",
    title: "Tech Founder Look",
    category: "Personal Branding",
    summary: "Perkuat persona founder: tampilan, grooming, dan kehadiran profesional.",
    primaryMetric: "presence_score",
    target: { from: 50, to: 78, unit: "/100" },
  },
  {
    id: "goal-lux-01",
    title: "Luxury Lifestyle Image",
    category: "Personal Branding",
    summary: "Upgrade citra visual: outfit, aksesori, dan konsistensi konten.",
    primaryMetric: "brand_consistency_score",
    target: { from: 44, to: 70, unit: "/100" },
  },
] as const;

const recommendedGoalIds = ["goal-skin-01", "goal-style-01", "goal-brand-01"] as const;

function reconcileSelectedGoalId(selectedGoalId: string) {
  return goals.some((g) => g.id === selectedGoalId) ? selectedGoalId : goals[0]?.id ?? null;
}

export async function GET() {
  const store = await readIntelligenceStore();
  const selectedGoalId = reconcileSelectedGoalId(store.selectedGoalId);
  const saved =
    selectedGoalId && selectedGoalId !== store.selectedGoalId
      ? await writeIntelligenceStore({ ...store, selectedGoalId })
      : store;

  return Response.json({
    ok: true,
    goals,
    recommendedGoalIds,
    selectedGoalId,
    generatedAt: "2026-05-30T00:00:00.000Z",
    updatedAt: saved.updatedAt,
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

  const selectedGoalId = normalizeId((body as Record<string, unknown>).selectedGoalId);
  if (!selectedGoalId || !goals.some((g) => g.id === selectedGoalId)) {
    return Response.json(
      { ok: false, error: "invalid_goal_id", message: "Goal tidak valid." },
      { status: 400 },
    );
  }

  const store = await readIntelligenceStore();
  const saved = await writeIntelligenceStore({ ...store, selectedGoalId });

  return Response.json({ ok: true, selectedGoalId: saved.selectedGoalId, updatedAt: saved.updatedAt });
}
