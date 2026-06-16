import type { CommerceStore } from "../../_lib/commerceStore";
import { findProduct } from "./_data";

type EnrichedItem = {
  id: string;
  productId: string;
  quantity: number;
  addedAt: string;
  subtotal: number;
  currency: string;
  product: {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    currency: string;
    imageUrl: string;
    affiliateUrl: string;
    marketplace: string;
    availability: string;
  };
};

export function buildShoppingList(store: CommerceStore) {
  const items: EnrichedItem[] = store.shoppingList.items
    .map((item) => {
      const snapshot = item.productSnapshot ?? null;
      const product = snapshot ?? findProduct(item.productId);
      if (!product) return null;

      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        addedAt: item.addedAt,
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
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const estimatedTotalIdr = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    id: store.shoppingList.id,
    title: store.shoppingList.title,
    status: store.shoppingList.status,
    currency: store.shoppingList.currency,
    items,
    estimatedTotal: estimatedTotalIdr,
  };
}

