import { findProduct } from "../_data";
import { createAffiliateEvent, normalizeId, readCommerceStore, writeCommerceStore } from "../../../_lib/commerceStore";

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

  const rec = body as Record<string, unknown>;
  const productId = normalizeId(rec.productId);
  const sourceRaw = normalizeId(rec.source) ?? "";
  const campaign = normalizeId(rec.campaign) ?? null;
  const source =
    sourceRaw === "catalog" ||
    sourceRaw === "product" ||
    sourceRaw === "shopping_list" ||
    sourceRaw === "analytics" ||
    sourceRaw === "checkout" ||
    sourceRaw === "orders"
      ? sourceRaw
      : "unknown";

  if (!productId) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const product = findProduct(productId);
  if (!product) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const store = await readCommerceStore();
  const event = createAffiliateEvent({ productId, kind: "conversion", source, campaign });
  const saved = await writeCommerceStore({
    ...store,
    affiliateEvents: [...store.affiliateEvents, event].slice(-5000),
  });

  return Response.json({ ok: true, event, updatedAt: saved.updatedAt });
}
