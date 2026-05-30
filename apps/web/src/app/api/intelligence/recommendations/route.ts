type Recommendation = {
  id: string;
  domain:
    | "skincare"
    | "hair"
    | "fashion"
    | "fitness"
    | "nutrition"
    | "grooming"
    | "branding";
  title: string;
  rationale: string;
  impact: "low" | "medium" | "high";
  cost: "low" | "medium" | "high";
  difficulty: "easy" | "moderate" | "hard";
  timeRequiredMinutesPerWeek: number;
  nextActions: Array<{ id: string; label: string; cadence: string }>;
};

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-skin-001",
    domain: "skincare",
    title: "Routine 3-step untuk jerawat ringan",
    rationale:
      "Skin clarity score masih di bawah target. Fokus ke cleanser gentle, moisturizer non-comedogenic, dan sunscreen.",
    impact: "high",
    cost: "low",
    difficulty: "easy",
    timeRequiredMinutesPerWeek: 70,
    nextActions: [
      { id: "act-001", label: "Cleanser (2x/hari)", cadence: "daily" },
      { id: "act-002", label: "Moisturizer (2x/hari)", cadence: "daily" },
      { id: "act-003", label: "Sunscreen SPF 50 (pagi)", cadence: "daily" },
    ],
  },
  {
    id: "rec-fitness-001",
    domain: "fitness",
    title: "Strength training 2x/minggu + langkah 8k/hari",
    rationale:
      "Target weight loss lebih stabil dengan latihan beban ringan dan peningkatan aktivitas harian.",
    impact: "high",
    cost: "low",
    difficulty: "moderate",
    timeRequiredMinutesPerWeek: 150,
    nextActions: [
      { id: "act-010", label: "Full-body strength", cadence: "2x/week" },
      { id: "act-011", label: "Jalan 8.000 langkah", cadence: "daily" },
    ],
  },
  {
    id: "rec-style-001",
    domain: "fashion",
    title: "Capsule wardrobe 12 item untuk tampilan profesional",
    rationale:
      "Style consistency score masih rendah. Mulai dari palet netral dan potongan yang fit.",
    impact: "medium",
    cost: "medium",
    difficulty: "easy",
    timeRequiredMinutesPerWeek: 45,
    nextActions: [
      { id: "act-020", label: "Audit lemari (pilih 12 item)", cadence: "once" },
      {
        id: "act-021",
        label: "3 kombinasi outfit untuk kerja",
        cadence: "weekly",
      },
    ],
  },
  {
    id: "rec-brand-001",
    domain: "branding",
    title: "Update foto profil + headline yang konsisten",
    rationale:
      "Presence score meningkat jika visual dan positioning profesional selaras dengan persona target.",
    impact: "medium",
    cost: "medium",
    difficulty: "moderate",
    timeRequiredMinutesPerWeek: 60,
    nextActions: [
      {
        id: "act-030",
        label: "Pilih 2 style guideline (warna & potongan)",
        cadence: "once",
      },
      { id: "act-031", label: "Foto profil baru", cadence: "once" },
      { id: "act-032", label: "Perbarui headline", cadence: "once" },
    ],
  },
];

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain")?.toLowerCase() ?? null;

  const items =
    domain == null
      ? RECOMMENDATIONS
      : RECOMMENDATIONS.filter((item) => item.domain === domain);

  return Response.json({
    ok: true,
    filters: { domain },
    recommendations: items,
    generatedAt: "2026-05-30T00:00:00.000Z",
  });
}
