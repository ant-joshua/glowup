import { findProduct, products } from "../../_data";

export function GET(
  _request: Request,
  { params }: { params: { productId: string } },
) {
  const product = findProduct(params.productId);

  if (!product) {
    return Response.json(
      { ok: false, error: "product_not_found", productId: params.productId },
      { status: 404 },
    );
  }

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return Response.json({
    ok: true,
    product,
    related,
    updatedAt: "2026-05-01T00:00:00.000Z",
  });
}

