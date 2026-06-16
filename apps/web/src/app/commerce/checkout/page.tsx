import Link from "next/link";

import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getRequestOrigin } from "../../_lib/requestOrigin";
import { CheckoutClient } from "./CheckoutClient";

type ShoppingListItem = {
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

type ShoppingListResponse = {
  ok: boolean;
  userId: string;
  list: {
    id: string;
    title: string;
    status: string;
    currency: string;
    items: ShoppingListItem[];
    estimatedTotal: number;
  };
  updatedAt: string;
};

export const dynamic = "force-dynamic";

export default async function CommerceCheckoutPage() {
  const origin = await getRequestOrigin();
  const res = await fetch(new URL("/api/commerce/shopping-list", origin).toString(), { cache: "no-store" });
  const data = (await res.json()) as ShoppingListResponse;

  return (
    <PageShell
      title="Commerce · Checkout"
      description="Mock checkout flow: start checkout → place order."
    >
      <SectionCrumb href="/commerce" label="← Kembali ke PRD-003 Commerce" />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <div className="text-sm text-secondary">List · {data.userId}</div>
          <div className="mt-1 text-lg font-semibold">{data.list.title}</div>
        </div>
        <Link href="/commerce/shopping-list" className="text-sm text-zinc-700 hover:underline dark:text-zinc-200">
          Back to shopping list
        </Link>
      </div>

      <CheckoutClient list={data.list} />
    </PageShell>
  );
}

