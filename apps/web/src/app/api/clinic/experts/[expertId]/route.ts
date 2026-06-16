import type { NextRequest } from "next/server";
import { getExpertProfile } from "../../_experts";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ expertId: string }> },
) {
  const { expertId } = await params;
  const expert = getExpertProfile(expertId);

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
