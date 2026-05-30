import { findProduct } from "../_data";

const listItems = [
  { id: "item-001", productId: "sku-001", quantity: 1, addedAt: "2026-05-10T00:00:00.000Z" },
  { id: "item-002", productId: "sku-003", quantity: 2, addedAt: "2026-05-11T00:00:00.000Z" },
  { id: "item-003", productId: "sku-004", quantity: 1, addedAt: "2026-05-12T00:00:00.000Z" },
] as const;

export function GET() {
  const items = listItems
    .map((item) => {
      const product = findProduct(item.productId);
      if (!product) {
        return null;
      }

      return {
        ...item,
        product: {
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
        subtotal: product.price * item.quantity,
        currency: product.currency,
      };
    })
    .filter((item) => item !== null);

  const estimatedTotalIdr = items.reduce((sum, item) => sum + item.subtotal, 0);

  return Response.json({
    ok: true,
    userId: "usr_0001",
    list: {
      id: "list-001",
      title: "Office Refresh",
      status: "draft",
      currency: "IDR",
      items,
      estimatedTotal: estimatedTotalIdr,
    },
    updatedAt: "2026-05-12T00:00:00.000Z",
  });
}

