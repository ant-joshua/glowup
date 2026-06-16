import { createAnalysisFromKind, readCoreStore, writeCoreStore } from "../../../_lib/coreStore";

function normalizeKind(value: unknown) {
  const v = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (v === "skin" || v === "style" || v === "color") return v;
  return "skin";
}

function buildResult(kind: string) {
  const base = {
    skinAnalysis: {
      skinType: "Berminyak",
      identifiedIssues: [
        "Jerawat aktif (pustul dan papul)",
        "Kemerahan (eritema)",
        "Pori-pori besar",
        "Bekas jerawat (PIE/PIH)",
      ],
    },
    skincareRecommendations: [
      {
        category: "Cleanser",
        brandAndProduct: "Cosrx Salicylic Acid Daily Gentle Cleanser",
        reason:
          "Mengandung Salicylic Acid (BHA) yang efektif membersihkan minyak berlebih di pori-pori dan meredakan jerawat aktif.",
      },
      {
        category: "Toner",
        brandAndProduct: "Avoskin Miraculous Acne Solution Toner",
        reason:
          "Kombinasi BHA dan Tea Tree membantu mengeksfoliasi kulit berjerawat secara lembut dan mengurangi kemerahan.",
      },
      {
        category: "Serum",
        brandAndProduct: "Somethinc 5% Niacinamide + Moisture Sabi Beet Serum",
        reason:
          "Membantu memudarkan bekas jerawat, mengontrol produksi sebum, dan memperkuat skin barrier tanpa memicu iritasi.",
      },
      {
        category: "Moisturizer",
        brandAndProduct: "The Originote Cica-B5 Soothing Moisturizer",
        reason:
          "Tekstur gel yang ringan dan menenangkan berkat kandungan Centella Asiatica, sangat baik untuk menghidrasi kulit berjerawat tanpa menyumbat pori.",
      },
      {
        category: "Sunscreen",
        brandAndProduct: "Skin Aqua UV Moisture Gel SPF 30 PA++",
        reason:
          "Sunscreen berbasis air yang ringan, tidak lengket, dan cocok untuk jenis kulit berminyak serta berjerawat.",
      },
    ],
    usageSchedule: {
      amRoutine: [
        "Cuci muka dengan Cosrx Salicylic Acid Daily Gentle Cleanser",
        "Gunakan Somethinc 5% Niacinamide Serum",
        "Gunakan The Originote Cica-B5 Soothing Moisturizer",
        "Aplikasikan Skin Aqua UV Moisture Gel SPF 30 PA++",
      ],
      pmRoutine: [
        "Cuci muka dengan Cosrx Salicylic Acid Daily Gentle Cleanser",
        "Gunakan Avoskin Miraculous Acne Solution Toner (2-3 kali seminggu)",
        "Gunakan Somethinc 5% Niacinamide Serum",
        "Gunakan The Originote Cica-B5 Soothing Moisturizer",
      ],
    },
    avoidances: {
      ingredients: [
        "Fragrance tinggi",
        "Alkohol denat",
        "High-concentration Retinol bersamaan dengan BHA",
        "Heavy oils (seperti Coconut Oil)",
      ],
      habits: [
        "Memencet atau menyentuh jerawat dengan tangan kotor",
        "Sering mengonsumsi makanan tinggi gula dan produk olahan susu (dairy)",
        "Jarang mengganti sarung bantal",
        "Eksfoliasi fisik (scrub) yang terlalu kasar",
      ],
    },
    personalColor: {
      undertone: "Warm",
      seasonalColor: "True Autumn",
      recommendedClothingColors: [
        "Terracotta",
        "Olive Green",
        "Mustard Gold",
        "Warm Beige",
        "Burnt Orange",
      ],
      colorsToAvoid: ["Icy Blue", "Neon Pink", "Stark White", "Lavender"],
    },
  };

  if (kind === "style") {
    return {
      ...base,
      skinAnalysis: {
        skinType: "Kombinasi",
        identifiedIssues: ["Kulit tampak kusam saat kurang tidur", "Sedikit kemerahan di area pipi"],
      },
      personalColor: {
        undertone: "Neutral-Warm",
        seasonalColor: "Soft Autumn",
        recommendedClothingColors: ["Camel", "Warm Grey", "Olive", "Cream", "Deep Teal"],
        colorsToAvoid: ["Neon Green", "High-contrast Black/White", "Icy Pastels"],
      },
    };
  }

  if (kind === "color") {
    return {
      ...base,
      skinAnalysis: {
        skinType: "Normal",
        identifiedIssues: ["Kulit terlihat dehidrasi ringan", "Sedikit dark circle"],
      },
      personalColor: {
        undertone: "Warm",
        seasonalColor: "True Autumn",
        recommendedClothingColors: ["Terracotta", "Olive Green", "Mustard Gold", "Warm Beige", "Burnt Orange"],
        colorsToAvoid: ["Icy Blue", "Neon Pink", "Stark White", "Lavender"],
      },
    };
  }

  return base;
}

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const rec =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const kind = normalizeKind(rec.kind ?? rec.analysisKind ?? rec.selectedOption);
  const store = await readCoreStore();
  const analysis = createAnalysisFromKind(kind, store.user.id);
  const saved = await writeCoreStore({ ...store, analyses: [...store.analyses, analysis].slice(-25) });
  return Response.json({
    ok: true,
    analysis: saved.analyses[saved.analyses.length - 1],
    result: buildResult(kind),
  });
}
