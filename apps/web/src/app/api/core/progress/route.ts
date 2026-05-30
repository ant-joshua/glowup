const payload = {
  ok: true,
  progress: {
    userId: "usr_0001",
    summary: {
      startDate: "2026-03-01",
      endDate: "2026-05-01",
      roadmapCompletionPct: 38,
      transformationScoreDelta: 6,
      weightKgDelta: -1.5,
    },
    entries: [
      {
        date: "2026-03-01",
        weightKg: 57.5,
        transformationScore: 65,
        completedActionIds: ["act_001", "act_004"],
      },
      {
        date: "2026-03-15",
        weightKg: 57.0,
        transformationScore: 67,
        completedActionIds: ["act_001", "act_007", "act_008"],
      },
      {
        date: "2026-04-01",
        weightKg: 56.4,
        transformationScore: 69,
        completedActionIds: ["act_001", "act_006", "act_007", "act_008"],
      },
      {
        date: "2026-04-20",
        weightKg: 56.0,
        transformationScore: 71,
        completedActionIds: ["act_001", "act_010", "act_011"],
      },
      {
        date: "2026-05-01",
        weightKg: 56.0,
        transformationScore: 71,
        completedActionIds: ["act_001", "act_012"],
      },
    ],
  },
};

export function GET() {
  return Response.json(payload);
}
