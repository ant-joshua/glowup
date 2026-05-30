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

export function GET() {
  return Response.json({
    ok: true,
    threadId: "coach-thread-001",
    messages: [
      {
        id: "msg-001",
        role: "user",
        content: "Aku missed routine kemarin.",
        createdAt: "2026-05-30T00:00:00.000Z",
      },
      {
        id: "msg-002",
        role: "coach",
        content: "Lanjutkan besok. Jangan restart dari awal. Yang penting konsisten kembali.",
        createdAt: "2026-05-30T00:00:01.000Z",
      },
    ],
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;
  const message =
    body != null &&
    typeof body === "object" &&
    "message" in body &&
    typeof (body as { message?: unknown }).message === "string"
      ? (body as { message: string }).message
      : "";

  return Response.json({
    ok: true,
    threadId: "coach-thread-001",
    input: { message },
    output: { message: generateCoachReply(message) },
    generatedAt: "2026-05-30T00:00:00.000Z",
  });
}
