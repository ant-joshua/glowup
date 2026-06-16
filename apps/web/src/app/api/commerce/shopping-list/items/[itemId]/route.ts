import type { NextRequest } from "next/server";

import { normalizeQuantity, readCommerceStore, writeCommerceStore } from "../../../../../_lib/commerceStore";
import { buildShoppingList } from "../../../_shoppingList";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await params;

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const quantity = normalizeQuantity((body as Record<string, unknown>).quantity);
  if (!quantity) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readCommerceStore();
  const existing = store.shoppingList.items.find((item) => item.id === itemId) ?? null;
  if (!existing) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const saved = await writeCommerceStore({
    ...store,
    shoppingList: {
      ...store.shoppingList,
      items: store.shoppingList.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    },
  });

  return Response.json({
    ok: true,
    userId: saved.userId,
    list: buildShoppingList(saved),
    updatedAt: saved.updatedAt,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await params;
  const store = await readCommerceStore();
  if (!store.shoppingList.items.some((item) => item.id === itemId)) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const saved = await writeCommerceStore({
    ...store,
    shoppingList: {
      ...store.shoppingList,
      items: store.shoppingList.items.filter((item) => item.id !== itemId),
    },
  });

  return Response.json({
    ok: true,
    userId: saved.userId,
    list: buildShoppingList(saved),
    updatedAt: saved.updatedAt,
  });
}
