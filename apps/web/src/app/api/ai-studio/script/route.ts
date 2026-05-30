const supportedTones = [
  "Professional",
  "Educational",
  "Luxury",
  "Friendly",
  "Funny",
  "Inspirational",
  "Expert",
] as const;

function normalizeInput(input: unknown) {
  const obj = (input ?? {}) as Record<string, unknown>;

  const goal = typeof obj.goal === "string" && obj.goal.trim() ? obj.goal.trim() : "kulit lebih sehat";
  const audience =
    typeof obj.audience === "string" && obj.audience.trim()
      ? obj.audience.trim()
      : "pemula skincare";
  const platform =
    typeof obj.platform === "string" && obj.platform.trim() ? obj.platform.trim() : "TikTok";
  const tone = typeof obj.tone === "string" && obj.tone.trim() ? obj.tone.trim() : "Educational";

  const productsRaw = Array.isArray(obj.products) ? obj.products : [];
  const products = productsRaw
    .map((p) => {
      if (typeof p === "string" && p.trim()) {
        return { id: null, name: p.trim() };
      }

      if (p && typeof p === "object") {
        const rec = p as Record<string, unknown>;
        const name = typeof rec.name === "string" ? rec.name.trim() : "";
        if (!name) {
          return null;
        }

        return {
          id: typeof rec.id === "string" && rec.id.trim() ? rec.id.trim() : null,
          name,
        };
      }

      return null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .slice(0, 5);

  return { goal, audience, platform, tone, products };
}

function buildScript({
  goal,
  audience,
  platform,
  tone,
  products,
}: {
  goal: string;
  audience: string;
  platform: string;
  tone: string;
  products: Array<{ id: string | null; name: string }>;
}) {
  const productLine =
    products.length > 0
      ? products.map((p, idx) => `${idx + 1}) ${p.name}`).join("\n")
      : "1) Cleanser\n2) Serum\n3) Sunscreen";

  const hook = `Untuk ${audience} yang pengin ${goal}, ini versi singkat yang bisa kamu ikuti.`;

  const body = [
    `Tone: ${tone}. Platform: ${platform}.`,
    "Mulai dari basic dulu: bersihkan, rawat, lalu proteksi.",
    `Produk yang aku pakai hari ini:\n${productLine}`,
    "Kalau kulit kamu sensitif, mulai pelan-pelan dan patch test dulu.",
  ].join("\n\n");

  const cta =
    platform.toLowerCase() === "youtube"
      ? "Kalau kamu mau versi lengkapnya, tulis pertanyaan kamu di komentar dan cek link rekomendasi di deskripsi."
      : "Kalau kamu mau link produknya, cek rekomendasi yang aku taruh di profil/keranjang ya.";

  const affiliateMentions =
    products.length > 0
      ? products.map((p) => ({
          productId: p.id,
          label: p.name,
          disclosure: "Tautan ini bisa mengandung affiliate link.",
        }))
      : [
          {
            productId: null,
            label: "Produk rekomendasi (contoh)",
            disclosure: "Tautan ini bisa mengandung affiliate link.",
          },
        ];

  return { hook, body, cta, affiliateMentions };
}

export function GET() {
  const exampleInput = {
    goal: "glowing untuk ngantor",
    audience: "professional yang super sibuk",
    platform: "TikTok",
    tone: "Professional",
    products: [
      { id: "sku-001", name: "Daily Glow Cleanser" },
      { id: "sku-003", name: "Matte Finish Sunscreen SPF50" },
    ],
  };

  return Response.json({
    ok: true,
    supportedTones,
    example: {
      input: exampleInput,
      output: buildScript(normalizeInput(exampleInput)),
    },
    updatedAt: "2026-05-01T00:00:00.000Z",
  });
}

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const input = normalizeInput(body);
  const output = buildScript(input);

  return Response.json({
    ok: true,
    input,
    output,
    updatedAt: "2026-05-01T00:00:00.000Z",
  });
}

