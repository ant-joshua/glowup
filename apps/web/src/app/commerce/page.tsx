import { LinkCards } from "../_components/LinkCards";
import { PageShell } from "../_components/PageShell";

export default function CommerceLandingPage() {
  return (
    <PageShell
      title="PRD-003 Commerce"
      description="Affiliate Commerce & Creator Monetization (UI scaffold)."
    >
      <LinkCards
        items={[
          {
            href: "/commerce/catalog",
            title: "Product Catalog",
            description: "Browse katalog produk dan kategori.",
          },
          {
            href: "/commerce/products/sku-001",
            title: "Product Detail",
            description: "Detail produk (dynamic route).",
          },
          {
            href: "/commerce/shopping-list",
            title: "Shopping List",
            description: "Daftar belanja / wishlist.",
          },
          {
            href: "/commerce/checkout",
            title: "Checkout",
            description: "Start checkout & place mock order.",
          },
          {
            href: "/commerce/orders",
            title: "Orders",
            description: "Order history + detail.",
          },
          {
            href: "/commerce/affiliate-analytics",
            title: "Affiliate Analytics",
            description: "Ringkasan performa affiliate creator.",
          },
        ]}
      />
    </PageShell>
  );
}
