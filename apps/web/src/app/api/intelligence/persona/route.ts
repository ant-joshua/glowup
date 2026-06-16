import { normalizeId, readIntelligenceStore, writeIntelligenceStore } from "../../../_lib/intelligenceStore";

const personas = [
  {
    id: "persona-founder",
    title: "Founder",
    traits: ["Visioner", "Tegas", "Minimalis"],
    styleKeywords: ["clean", "smart casual", "neutral palette"],
  },
  {
    id: "persona-executive",
    title: "Executive",
    traits: ["Profesional", "Berwibawa", "Rapi"],
    styleKeywords: ["tailored", "formal", "classic"],
  },
  {
    id: "persona-consultant",
    title: "Consultant",
    traits: ["Adaptif", "Praktis", "Polished"],
    styleKeywords: ["versatile", "business casual", "layering"],
  },
  {
    id: "persona-designer",
    title: "Designer",
    traits: ["Eksperimental", "Kreatif", "Detail-oriented"],
    styleKeywords: ["statement", "textures", "artsy"],
  },
  {
    id: "persona-influencer",
    title: "Influencer",
    traits: ["Trendi", "Expressive", "On-camera"],
    styleKeywords: ["trend-driven", "bold", "photogenic"],
  },
  {
    id: "persona-athlete",
    title: "Athlete",
    traits: ["Enerjik", "Fungsional", "Disiplin"],
    styleKeywords: ["performance", "athleisure", "lightweight"],
  },
  {
    id: "persona-creator",
    title: "Creator",
    traits: ["Konsisten", "Brand-aware", "Storytelling"],
    styleKeywords: ["signature look", "content-ready", "repeatable"],
  },
  {
    id: "persona-custom",
    title: "Custom Persona",
    traits: ["Fleksibel"],
    styleKeywords: ["user-defined"],
  },
] as const;

function reconcileSelectedPersonaId(selectedPersonaId: string) {
  return personas.some((p) => p.id === selectedPersonaId) ? selectedPersonaId : personas[0]?.id ?? null;
}

export async function GET() {
  const store = await readIntelligenceStore();
  const selectedPersonaId = reconcileSelectedPersonaId(store.selectedPersonaId);
  const saved =
    selectedPersonaId && selectedPersonaId !== store.selectedPersonaId
      ? await writeIntelligenceStore({ ...store, selectedPersonaId })
      : store;

  return Response.json({
    ok: true,
    personas,
    selectedPersonaId,
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

  const selectedPersonaId = normalizeId((body as Record<string, unknown>).selectedPersonaId);
  if (!selectedPersonaId || !personas.some((p) => p.id === selectedPersonaId)) {
    return Response.json(
      { ok: false, error: "invalid_persona_id", message: "Persona tidak valid." },
      { status: 400 },
    );
  }

  const store = await readIntelligenceStore();
  const saved = await writeIntelligenceStore({ ...store, selectedPersonaId });

  return Response.json({
    ok: true,
    selectedPersonaId: saved.selectedPersonaId,
    updatedAt: saved.updatedAt,
  });
}
