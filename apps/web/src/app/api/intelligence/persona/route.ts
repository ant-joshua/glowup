export function GET() {
  return Response.json({
    ok: true,
    personas: [
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
    ],
    selectedPersonaId: "persona-founder",
    generatedAt: "2026-05-30T00:00:00.000Z",
  });
}
