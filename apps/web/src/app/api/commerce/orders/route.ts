import {
  createAffiliateEvent,
  createOrderFromShoppingList,
  normalizeId,
  readCommerceStore,
  writeCommerceStore,
} from "../../../_lib/commerceStore";

function newListId() {
  return `list_${Date.now()}`;
}

export async function GET() {
  const store = await readCommerceStore();
  const orders = [...store.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50);
  return Response.json({ ok: true, userId: store.userId, orders, updatedAt: store.updatedAt });
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
  if (store.shoppingList.items.length === 0) {
    return Response.json({ ok: false, error: "empty_list" }, { status: 409 });
  }

  const order = createOrderFromShoppingList({
    userId: store.userId,
    listId: store.shoppingList.id,
    currency: store.shoppingList.currency,
    items: store.shoppingList.items,
  });

  const purchaseEvents = store.shoppingList.items.map((item) =>
    createAffiliateEvent({
      productId: item.productId,
      kind: "purchase",
      source,
      campaign,
      orderId: order.id,
    }),
  );

  const saved = await writeCommerceStore({
    ...store,
    orders: [order, ...store.orders].slice(0, 200),
    shoppingList: {
      ...store.shoppingList,
      id: newListId(),
      status: "draft",
      items: [],
    },
    affiliateEvents: [...store.affiliateEvents, ...purchaseEvents].slice(-5000),
  });

  return Response.json({ ok: true, order, updatedAt: saved.updatedAt }, { status: 201 });
}

