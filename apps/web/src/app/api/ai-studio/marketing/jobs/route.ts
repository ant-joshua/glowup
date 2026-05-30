function getWorkerBaseUrl() {
  const raw = process.env.PIXVERSE_WORKER_URL?.trim();
  const base = raw && raw.length > 0 ? raw : "http://localhost:4107";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") ?? "").trim().toLowerCase();
  const url = new URL(`${getWorkerBaseUrl()}/marketing/jobs`);

  if (status) {
    url.searchParams.set("status", status);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = (await res.json()) as unknown;
  return Response.json(data, { status: res.status });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;

  const res = await fetch(`${getWorkerBaseUrl()}/marketing/jobs`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as unknown;
  return Response.json(data, { status: res.status });
}
