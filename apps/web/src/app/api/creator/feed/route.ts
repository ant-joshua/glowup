const payload = {
  ok: true,
  feed: {
    type: "for-you",
    cursor: null,
    items: [
      {
        id: "post_2001",
        type: "transformation-update",
        creator: { id: "cr_0007", username: "alya.glow", displayName: "Alya Putri", verified: true },
        createdAt: "2026-04-20T11:00:00.000Z",
        text: "Minggu ke-6: kulit lebih stabil setelah barrier reset. Fokus berikutnya: sunscreen re-apply dan tidur cukup.",
        media: [
          { kind: "image", url: "https://example.invalid/media/post_2001_1.jpg" },
          { kind: "image", url: "https://example.invalid/media/post_2001_2.jpg" },
        ],
        metrics: { likes: 1820, comments: 96, saves: 410, shares: 53 },
        tags: ["skincare", "barrier", "sunscreen"],
      },
      {
        id: "post_2002",
        type: "routine",
        creator: { id: "cr_0007", username: "alya.glow", displayName: "Alya Putri", verified: true },
        createdAt: "2026-04-05T12:00:00.000Z",
        routine: { id: "rt_0101", title: "7 Hari Barrier Reset (Kulit Kombinasi)", durationDays: 7 },
        text: "Rutinitas cepat untuk balik ke basics saat kulit lagi rewel. Cocok buat pemula.",
        media: [{ kind: "image", url: "https://example.invalid/media/rt_0101_cover.jpg" }],
        metrics: { likes: 940, comments: 31, saves: 260, shares: 18 },
        tags: ["routine", "skincare"],
      },
      {
        id: "post_2003",
        type: "outfit-showcase",
        creator: { id: "cr_0007", username: "alya.glow", displayName: "Alya Putri", verified: true },
        createdAt: "2026-03-28T08:15:00.000Z",
        text: "Smart-casual buat meeting: blazer navy + kaos putih + straight pants hitam. Kuncinya fit dan sepatu bersih.",
        media: [{ kind: "image", url: "https://example.invalid/media/post_2003_1.jpg" }],
        metrics: { likes: 1560, comments: 44, saves: 520, shares: 39 },
        tags: ["fashion", "smartcasual", "office"],
      },
    ],
  },
};

export function GET() {
  return Response.json(payload);
}
