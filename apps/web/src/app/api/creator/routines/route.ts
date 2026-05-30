const payload = {
  ok: true,
  routines: [
    {
      id: "rt_0101",
      creatorId: "cr_0007",
      title: "7 Hari Barrier Reset (Kulit Kombinasi)",
      description:
        "Rutinitas singkat untuk menenangkan iritasi ringan dan menguatkan skin barrier. Fokus: gentle cleanse, hidrasi, dan sunscreen.",
      category: "skincare",
      targetAudience: ["combination", "sensitive"],
      difficulty: "beginner",
      budgetRangeIdr: { min: 150000, max: 450000 },
      durationDays: 7,
      steps: [
        {
          id: "st_001",
          title: "Cleanser lembut",
          timeOfDay: "am/pm",
          notes: "Pilih yang pH-balanced, tanpa parfum kuat.",
        },
        {
          id: "st_002",
          title: "Hydrating toner/essence",
          timeOfDay: "am/pm",
          notes: "Layer 1-2 kali sesuai kebutuhan.",
        },
        {
          id: "st_003",
          title: "Moisturizer ceramide",
          timeOfDay: "am/pm",
          notes: "Tekstur gel-cream untuk kulit kombinasi.",
        },
        {
          id: "st_004",
          title: "Sunscreen SPF 50",
          timeOfDay: "am",
          notes: "Re-apply 2-3 jam sekali jika outdoor.",
        },
      ],
      products: [
        { id: "pd_001", type: "cleanser", name: "Gentle Cleanser", affiliateUrl: null },
        { id: "pd_002", type: "moisturizer", name: "Ceramide Gel-Cream", affiliateUrl: null },
        { id: "pd_003", type: "sunscreen", name: "SPF 50 PA++++", affiliateUrl: null },
      ],
      expectedOutcome: [
        "Kemerahan berkurang",
        "Kulit terasa lebih lembap",
        "Minyak lebih terkontrol",
      ],
      createdAt: "2026-03-12T10:00:00.000Z",
      updatedAt: "2026-04-05T10:00:00.000Z",
    },
    {
      id: "rt_0102",
      creatorId: "cr_0007",
      title: "Wardrobe Capsule Smart-Casual (10 Item)",
      description:
        "Template wardrobe capsule untuk tampil rapi di kantor tanpa banyak mikir. Netral, mudah mix-and-match.",
      category: "fashion",
      targetAudience: ["office", "smart-casual"],
      difficulty: "intermediate",
      budgetRangeIdr: { min: 800000, max: 2500000 },
      durationDays: 14,
      steps: [
        { id: "st_101", title: "Pilih palet warna netral", timeOfDay: "any", notes: "Hitam, putih, navy, beige." },
        { id: "st_102", title: "Audit ukuran & fit", timeOfDay: "any", notes: "Prioritaskan bahu dan panjang celana." },
        { id: "st_103", title: "Tambah 1 statement item", timeOfDay: "any", notes: "Misal blazer atau loafers." },
      ],
      products: [
        { id: "pd_101", type: "apparel", name: "Blazer navy", affiliateUrl: null },
        { id: "pd_102", type: "apparel", name: "Straight pants hitam", affiliateUrl: null },
        { id: "pd_103", type: "footwear", name: "Loafers kulit", affiliateUrl: null },
      ],
      expectedOutcome: ["Outfit lebih konsisten", "Lebih hemat waktu", "Look terlihat lebih premium"],
      createdAt: "2026-02-02T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ],
};

export function GET() {
  return Response.json(payload);
}
