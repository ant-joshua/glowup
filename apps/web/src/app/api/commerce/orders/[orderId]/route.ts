import { normalizeId, readCommerceStore } from "../../../../_lib/commerceStore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const id = normalizeId(orderId);
  if (!id) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readCommerceStore();
  const order = store.orders.find((o) => o.id === id) ?? null;
  if (!order) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return Response.json({ ok: true, order, updatedAt: store.updatedAt });
}

