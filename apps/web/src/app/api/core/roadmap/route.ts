const payload = {
  ok: true,
  roadmap: {
    id: "rmp_0001",
    userId: "usr_0001",
    horizonDays: 90,
    generatedAt: "2026-04-20T08:45:00.000Z",
    weeks: [
      {
        week: 1,
        focus: "Baseline & kebiasaan inti",
        actions: [
          { id: "act_001", title: "Skincare AM/PM dasar", cadence: "daily" },
          { id: "act_002", title: "Haircut + konsultasi stylist", cadence: "once" },
          { id: "act_003", title: "Audit wardrobe 30 menit", cadence: "once" },
        ],
      },
      {
        week: 2,
        focus: "Upgrade tampil rapi",
        actions: [
          { id: "act_004", title: "Sunscreen re-apply", cadence: "daily" },
          { id: "act_005", title: "Tambah 2 outfit smart-casual", cadence: "once" },
          { id: "act_006", title: "Latihan postur 10 menit", cadence: "daily" },
        ],
      },
      {
        week: 3,
        focus: "Fitness & energi",
        actions: [
          { id: "act_007", title: "Strength training full body", cadence: "3x/week" },
          { id: "act_008", title: "Langkah 7.000/hari", cadence: "daily" },
          { id: "act_009", title: "Protein target 90g", cadence: "daily" },
        ],
      },
      {
        week: 4,
        focus: "Personal branding",
        actions: [
          { id: "act_010", title: "Update foto profil (natural lighting)", cadence: "once" },
          { id: "act_011", title: "Perbaiki bio & headline", cadence: "once" },
          { id: "act_012", title: "Konsisten grooming sebelum meeting", cadence: "daily" },
        ],
      },
      {
        week: 8,
        focus: "Refinement",
        actions: [
          { id: "act_013", title: "Evaluasi progres skor", cadence: "once" },
          { id: "act_014", title: "Tambah satu signature item", cadence: "once" },
          { id: "act_015", title: "Skin check-in mingguan", cadence: "weekly" },
        ],
      },
      {
        week: 12,
        focus: "Maintenance & scale",
        actions: [
          { id: "act_016", title: "Rencana 90 hari berikutnya", cadence: "once" },
          { id: "act_017", title: "Review wardrobe capsule", cadence: "once" },
          { id: "act_018", title: "Ulangi foto before/after", cadence: "once" },
        ],
      },
    ],
  },
};

export function GET() {
  return Response.json(payload);
}
