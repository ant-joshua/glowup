function getWorkerBaseUrl() {
  const raw = process.env.PIXVERSE_WORKER_URL?.trim();
  const base = raw && raw.length > 0 ? raw : "http://localhost:4107";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export async function GET() {
  const url = `${getWorkerBaseUrl()}/templates`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = (await res.json()) as unknown;
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ ok: false, error: "worker_unreachable" }, { status: 502 });
  }
}
