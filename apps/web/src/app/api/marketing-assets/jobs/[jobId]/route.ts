import type { NextRequest } from "next/server";

function getWorkerBaseUrl() {
  const raw = process.env.PIXVERSE_WORKER_URL?.trim();
  const base = raw && raw.length > 0 ? raw : "http://localhost:4107";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  return (async () => {
    const { jobId } = await params;
    const url = `${getWorkerBaseUrl()}/marketing/jobs/${encodeURIComponent(jobId)}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = (await res.json()) as unknown;
    return Response.json(data, { status: res.status });
  })();
}
