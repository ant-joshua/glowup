import { findProduct } from "../../_data";
import {
  createAffiliateEvent,
  createShoppingListItem,
  normalizeId,
  normalizeQuantity,
  readCommerceStore,
  writeCommerceStore,
} from "../../../../_lib/commerceStore";
import { buildShoppingList } from "../../_shoppingList";

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
  const quantity = normalizeQuantity(rec.quantity ?? 1);
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
  if (!productId || !quantity) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const product = findProduct(productId);
  if (!product) {
    return Response.json({ ok: false, error: "not_found", message: "Produk tidak ditemukan." }, { status: 404 });
  }

  const store = await readCommerceStore();
  const existing = store.shoppingList.items.find((item) => item.productId === productId) ?? null;
  const nextItems = existing
    ? store.shoppingList.items.map((item) =>
        item.id === existing.id
          ? {
              ...item,
              quantity: Math.min(99, item.quantity + quantity),
              productSnapshot:
                item.productSnapshot ??
                {
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  category: product.category,
                  price: product.price,
                  currency: product.currency,
                  imageUrl: product.imageUrl,
                  affiliateUrl: product.affiliateUrl,
                  marketplace: product.marketplace,
                  availability: product.availability,
                },
            }
          : item,
      )
    : [
        ...store.shoppingList.items,
        {
          ...createShoppingListItem({ productId, quantity }),
          productSnapshot: {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            currency: product.currency,
            imageUrl: product.imageUrl,
            affiliateUrl: product.affiliateUrl,
            marketplace: product.marketplace,
            availability: product.availability,
          },
        },
      ];

  const saved = await writeCommerceStore({
    ...store,
    shoppingList: { ...store.shoppingList, items: nextItems },
    affiliateEvents: [
      ...store.affiliateEvents,
      createAffiliateEvent({ productId, kind: "add_to_list", source, campaign }),
    ].slice(-5000),
  });

  return Response.json({
    ok: true,
    userId: saved.userId,
    list: buildShoppingList(saved),
    updatedAt: saved.updatedAt,
  });
}
