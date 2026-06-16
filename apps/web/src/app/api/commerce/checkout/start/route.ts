import { createAffiliateEvent, normalizeId, readCommerceStore, writeCommerceStore } from "../../../../_lib/commerceStore";

function nowIso() {
  return new Date().toISOString();
}

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
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
      : "checkout";

  const store = await readCommerceStore();
  const startedAt = nowIso();
  const cutoff = Date.now() - 5 * 60 * 1000;

  const existingKey = new Set(
    store.affiliateEvents
      .filter((evt) => evt.kind === "checkout_started")
      .filter((evt) => Date.parse(evt.createdAt) >= cutoff)
      .map((evt) => `${evt.productId}:${evt.source}:${evt.campaign ?? ""}`),
  );

  const nextEvents = [...store.affiliateEvents];
  for (const item of store.shoppingList.items) {
    const key = `${item.productId}:${source}:${campaign ?? ""}`;
    if (existingKey.has(key)) continue;
    nextEvents.push(
      createAffiliateEvent({
        productId: item.productId,
        kind: "checkout_started",
        source,
        campaign,
      }),
    );
  }

  const saved = await writeCommerceStore({
    ...store,
    affiliateEvents: nextEvents.slice(-5000),
  });

  return Response.json({
    ok: true,
    listId: store.shoppingList.id,
    startedAt,
    itemsCount: store.shoppingList.items.length,
    updatedAt: saved.updatedAt,
  });
}

