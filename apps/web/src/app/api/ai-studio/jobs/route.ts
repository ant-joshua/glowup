function getWorkerBaseUrl() {
  const raw = process.env.PIXVERSE_WORKER_URL?.trim();
  const base = raw && raw.length > 0 ? raw : "http://localhost:4107";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

type TemplatesResponse = { ok: boolean; items?: Array<{ id: string }> };

function validateCreateBody(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const rec = body as Record<string, unknown>;
  const templateId = typeof rec.templateId === "string" ? rec.templateId.trim() : "";
  const variables = rec.variables && typeof rec.variables === "object" ? (rec.variables as Record<string, unknown>) : null;

  if (!templateId || templateId.length > 80) return null;
  if (!variables) return null;

  const entries = Object.entries(variables);
  if (entries.length > 20) return null;

  for (const [k, v] of entries) {
    if (k.length > 80) return null;
    if (typeof v === "string" && v.length > 4000) return null;
    if (Array.isArray(v) && v.length > 50) return null;
  }

  return { templateId, variables };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") ?? "").trim().toLowerCase();
  const url = new URL(`${getWorkerBaseUrl()}/jobs`);
  if (status) url.searchParams.set("status", status);

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = (await res.json()) as unknown;
  return Response.json(data, { status: res.status });
}

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const validated = validateCreateBody(body);
  if (!validated) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const templatesRes = await fetch(`${getWorkerBaseUrl()}/templates`, { cache: "no-store" });
  const templatesData = (await templatesRes.json()) as TemplatesResponse;
  const known = templatesData.ok === true && Array.isArray(templatesData.items)
    ? templatesData.items.some((t) => t.id === validated.templateId)
    : false;

  if (!known) {
    return Response.json({ ok: false, error: "unknown_template" }, { status: 400 });
  }

  const res = await fetch(`${getWorkerBaseUrl()}/jobs`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(validated),
  });
  const data = (await res.json()) as unknown;
  return Response.json(data, { status: res.status });
}

