const payload = {
  ok: true,
  analysis: {
    id: "ana_0001",
    userId: "usr_0001",
    createdAt: "2026-04-20T08:30:00.000Z",
    confidencePct: 84,
    faceShape: "oval",
    skin: { type: "combination", concerns: ["acne", "dullness"] },
    hair: { density: "medium", concerns: ["frizz"] },
    style: { vibe: "smart-casual", notes: ["clean lines", "neutral palette"] },
    scores: {
      skin: 72,
      hair: 80,
      fashion: 65,
      grooming: 70,
      fitness: 60,
      personalBranding: 74,
      overall: 71,
    },
    highlights: [
      "Potensi peningkatan terbesar ada di fitness dan fashion.",
      "Konsistensi skincare sudah baik, tinggal fokus pada barrier dan sunscreen.",
      "Gaya smart-casual cocok; optimasi fit dan layering untuk terlihat lebih premium.",
    ],
  },
};

export function GET() {
  return Response.json(payload);
}
