import type { NextRequest } from "next/server";

type ExpertService = {
  id: string;
  name: string;
  durationMinutes: number;
  priceIdr: number;
  modes: Array<"online" | "in_person">;
};

type ExpertProfile = {
  id: string;
  name: string;
  category: string;
  location: string;
  experienceYears: number;
  bio: string;
  verificationStatus: "unverified" | "verified" | "professional" | "premium" | "partner";
  rating: number;
  reviewCount: number;
  services: ExpertService[];
  highlights: string[];
};

const EXPERTS: Record<string, ExpertProfile> = {
  "dr-001": {
    id: "dr-001",
    name: "Dr. Nara Putri, Sp.KK",
    category: "Dermatology",
    location: "Jakarta",
    experienceYears: 9,
    bio: "Fokus pada acne management, acne scars, dan prosedur kulit berbasis evidence. Pendekatan bertahap, terukur, dan realistis.",
    verificationStatus: "professional",
    rating: 4.8,
    reviewCount: 128,
    services: [
      {
        id: "svc-derm-001",
        name: "Acne Consultation",
        durationMinutes: 30,
        priceIdr: 350000,
        modes: ["online", "in_person"],
      },
      {
        id: "svc-derm-002",
        name: "Microneedling Session",
        durationMinutes: 60,
        priceIdr: 1200000,
        modes: ["in_person"],
      },
    ],
    highlights: [
      "Rencana 8 minggu untuk kontrol jerawat",
      "Perkiraan downtime prosedur (realistis)",
      "Checklist skincare yang kompatibel dengan budget",
    ],
  },
  "ex-002": {
    id: "ex-002",
    name: "Raka Wibowo (Personal Trainer)",
    category: "Fitness",
    location: "Bandung",
    experienceYears: 6,
    bio: "Program strength & fat loss yang sederhana dan konsisten. Fokus pada kebiasaan dan progres yang bisa diukur.",
    verificationStatus: "verified",
    rating: 4.6,
    reviewCount: 76,
    services: [
      {
        id: "svc-fit-001",
        name: "Assessment + Plan 4 Minggu",
        durationMinutes: 60,
        priceIdr: 450000,
        modes: ["online", "in_person"],
      },
      {
        id: "svc-fit-002",
        name: "Strength Coaching (1 sesi)",
        durationMinutes: 60,
        priceIdr: 250000,
        modes: ["in_person"],
      },
    ],
    highlights: [
      "Template latihan 2x/minggu",
      "Tracking langkah & berat badan",
      "Progressive overload yang aman",
    ],
  },
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ expertId: string }> },
) {
  const { expertId } = await params;
  const expert = EXPERTS[expertId];

  if (expert == null) {
    return Response.json(
      {
        ok: false,
        error: "NOT_FOUND",
        message: `Expert "${expertId}" tidak ditemukan.`,
      },
      { status: 404 },
    );
  }

  return Response.json({
    ok: true,
    expert,
    generatedAt: "2026-05-30T00:00:00.000Z",
  });
}
