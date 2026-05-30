function normalizeInput(input: unknown) {
  const obj = (input ?? {}) as Record<string, unknown>;

  const platform =
    typeof obj.platform === "string" && obj.platform.trim() ? obj.platform.trim() : "TikTok";

  const scriptObj = obj.script && typeof obj.script === "object" ? (obj.script as Record<string, unknown>) : null;
  const hook = scriptObj && typeof scriptObj.hook === "string" ? scriptObj.hook.trim() : "";
  const body = scriptObj && typeof scriptObj.body === "string" ? scriptObj.body.trim() : "";
  const cta = scriptObj && typeof scriptObj.cta === "string" ? scriptObj.cta.trim() : "";

  const text =
    typeof obj.text === "string" && obj.text.trim()
      ? obj.text.trim()
      : [hook, body, cta].filter(Boolean).join("\n\n");

  return {
    platform,
    text: text || "Video edukasi singkat dengan struktur hook → problem → solution → CTA.",
  };
}

function baseDuration(platform: string) {
  const key = platform.toLowerCase();
  if (key.includes("youtube")) {
    return 60;
  }
  if (key.includes("instagram")) {
    return 45;
  }
  return 30;
}

function buildStoryboard(input: { platform: string; text: string }) {
  const total = baseDuration(input.platform);
  const d1 = Math.round(total * 0.17);
  const d2 = Math.round(total * 0.33);
  const d3 = Math.round(total * 0.27);
  const d4 = total - d1 - d2 - d3;

  return {
    platform: input.platform,
    durationSec: total,
    scenes: [
      {
        id: "scene-1",
        title: "Hook",
        durationSec: d1,
        description: "Buka dengan satu kalimat yang langsung mengarah ke masalah/audience.",
        visualDirections: "Close-up wajah, teks besar 1 baris, cut cepat.",
        transition: "Hard cut",
      },
      {
        id: "scene-2",
        title: "Problem",
        durationSec: d2,
        description: "Jelaskan problem utama dalam 2-3 poin singkat.",
        visualDirections: "B-roll kondisi sebelum, overlay bullet points.",
        transition: "Swipe",
      },
      {
        id: "scene-3",
        title: "Solution + Product",
        durationSec: d3,
        description: "Tunjukkan langkah solusi dan contoh produk/routine.",
        visualDirections: "Shoot produk, cut-in tekstur, demo 1 langkah.",
        transition: "Match cut",
      },
      {
        id: "scene-4",
        title: "CTA",
        durationSec: d4,
        description: "Ajak penonton melakukan aksi: follow, save, atau cek link.",
        visualDirections: "On-cam + overlay CTA, tampilan profil/keranjang.",
        transition: "Fade out",
      },
    ],
    scriptExcerpt: input.text.slice(0, 280),
  };
}

export function GET() {
  const exampleInput = {
    platform: "TikTok",
    script: {
      hook: "Untuk kamu yang super sibuk, ini 3 langkah biar kulit tetap sehat.",
      body: "Bersihkan, rawat, proteksi. Pilih produk yang ringan dan konsisten.",
      cta: "Cek rekomendasi produknya di profil ya.",
    },
  };

  return Response.json({
    ok: true,
    example: {
      input: exampleInput,
      output: buildStoryboard(normalizeInput(exampleInput)),
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
  const output = buildStoryboard(input);

  return Response.json({
    ok: true,
    input,
    output,
    updatedAt: "2026-05-01T00:00:00.000Z",
  });
}

