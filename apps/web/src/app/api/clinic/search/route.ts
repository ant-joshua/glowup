type SearchItem = {
  id: string;
  type: "expert" | "clinic";
  name: string;
  category: string;
  location: string;
  rating: number;
  startingPriceIdr: number;
  tags: string[];
  nextAvailableAt: string;
};

const ITEMS: SearchItem[] = [
  {
    id: "dr-001",
    type: "expert",
    name: "Dr. Nara Putri, Sp.KK",
    category: "Dermatology",
    location: "Jakarta",
    rating: 4.8,
    startingPriceIdr: 350000,
    tags: ["acne", "acne scars", "microneedling"],
    nextAvailableAt: "2026-06-01T09:00:00+07:00",
  },
  {
    id: "ex-002",
    type: "expert",
    name: "Raka Wibowo (Personal Trainer)",
    category: "Fitness",
    location: "Bandung",
    rating: 4.6,
    startingPriceIdr: 250000,
    tags: ["strength", "fat loss", "habit"],
    nextAvailableAt: "2026-06-01T18:00:00+07:00",
  },
  {
    id: "cl-001",
    type: "clinic",
    name: "GlowDerm Aesthetic Clinic",
    category: "Aesthetic Clinics",
    location: "Jakarta",
    rating: 4.7,
    startingPriceIdr: 650000,
    tags: ["laser", "chemical peel", "hydrafacial"],
    nextAvailableAt: "2026-06-02T10:00:00+07:00",
  },
  {
    id: "cl-002",
    type: "clinic",
    name: "Prime Hair & Scalp Center",
    category: "Hair Clinics",
    location: "Surabaya",
    rating: 4.5,
    startingPriceIdr: 550000,
    tags: ["hair restoration", "scalp treatment", "prp"],
    nextAvailableAt: "2026-06-03T11:30:00+07:00",
  },
];

function matchesQuery(item: SearchItem, q: string | null) {
  if (q == null || q.trim().length === 0) return true;
  const normalized = q.trim().toLowerCase();
  return (
    item.name.toLowerCase().includes(normalized) ||
    item.tags.some((tag) => tag.toLowerCase().includes(normalized))
  );
}

function matchesCategory(item: SearchItem, category: string | null) {
  if (category == null || category.trim().length === 0) return true;
  return item.category.toLowerCase() === category.trim().toLowerCase();
}

function matchesLocation(item: SearchItem, location: string | null) {
  if (location == null || location.trim().length === 0) return true;
  return item.location.toLowerCase() === location.trim().toLowerCase();
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const location = searchParams.get("location");

  const results = ITEMS.filter(
    (item) =>
      matchesQuery(item, q) &&
      matchesCategory(item, category) &&
      matchesLocation(item, location),
  );

  const experts = results.filter((item) => item.type === "expert");
  const clinics = results.filter((item) => item.type === "clinic");

  return Response.json({
    ok: true,
    query: { q, category, location },
    totals: { all: results.length, experts: experts.length, clinics: clinics.length },
    results: { experts, clinics },
    generatedAt: "2026-05-30T00:00:00.000Z",
  });
}
