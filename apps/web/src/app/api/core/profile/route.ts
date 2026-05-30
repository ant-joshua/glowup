const payload = {
  ok: true,
  user: {
    id: "usr_0001",
    name: "Alya Putri",
    age: 28,
    gender: "female",
    heightCm: 162,
    weightKg: 56,
    occupation: "Product Designer",
    budgetMonthlyIdr: 1500000,
  },
  goals: [
    { id: "goal_skin", label: "Better Skin" },
    { id: "goal_fashion", label: "Better Fashion" },
    { id: "goal_branding", label: "Personal Branding" },
  ],
  updatedAt: "2026-05-01T00:00:00.000Z",
};

export function GET() {
  return Response.json(payload);
}
