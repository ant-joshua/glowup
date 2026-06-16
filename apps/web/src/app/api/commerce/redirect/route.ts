import { findProduct } from "../_data";
import { createAffiliateEvent, normalizeId, readCommerceStore, writeCommerceStore } from "../../../_lib/commerceStore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = normalizeId(searchParams.get("productId"));
  const sourceRaw = normalizeId(searchParams.get("source")) ?? "";
  const campaign = normalizeId(searchParams.get("campaign")) ?? null;
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
  const event = createAffiliateEvent({ productId, kind: "click", source, campaign });
  await writeCommerceStore({
    ...store,
    affiliateEvents: [...store.affiliateEvents, event].slice(-5000),
  });

  return Response.redirect(product.affiliateUrl, 302);
}
