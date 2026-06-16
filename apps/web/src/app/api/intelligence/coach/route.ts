import {
  appendCoachMessages,
  normalizeCoachContent,
  readIntelligenceStore,
  writeIntelligenceStore,
} from "../../../_lib/intelligenceStore";

function generateCoachReply(input: string) {
  const normalized = input.trim().toLowerCase();

  if (
    normalized.includes("miss") ||
    normalized.includes("ketinggalan") ||
    normalized.includes("bolong") ||
    normalized.includes("skip")
  ) {
    return "Lanjutkan besok. Jangan restart dari awal. Yang penting konsisten kembali.";
  }

  if (normalized.includes("jerawat") || normalized.includes("acne")) {
    return "Mulai dari rutinitas sederhana dan konsisten: cleanser lembut, moisturizer, dan sunscreen. Setelah 2 minggu stabil, baru pertimbangkan aktives (mis. BHA) 2-3x/minggu.";
  }

  if (normalized.includes("outfit") || normalized.includes("style")) {
    return "Pilih 2 warna netral, 1 aksen, lalu buat 3 kombinasi outfit yang bisa diulang. Fokus pada fit dan bahan yang terlihat rapi di kamera.";
  }

  return "Sebutkan goal utama kamu minggu ini (mis. kulit, fitness, style), lalu aku bantu langkah paling kecil yang bisa kamu lakukan hari ini.";
}

export async function GET() {
  const store = await readIntelligenceStore();
  return Response.json({
    ok: true,
    thread: store.coach,
    updatedAt: store.updatedAt,
    generatedAt: "2026-05-30T00:00:00.000Z",
  });
}

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const message = normalizeCoachContent((body as Record<string, unknown>).message);
  if (!message) {
    return Response.json(
      { ok: false, error: "invalid_message", message: "Pesan tidak valid." },
      { status: 400 },
    );
  }

  const store = await readIntelligenceStore();
  const reply = generateCoachReply(message);
  const next = appendCoachMessages(store, { userContent: message, coachContent: reply });
  const saved = await writeIntelligenceStore(next);

  return Response.json({
    ok: true,
    thread: saved.coach,
    input: { message },
    output: { message: reply },
    updatedAt: saved.updatedAt,
  });
}
