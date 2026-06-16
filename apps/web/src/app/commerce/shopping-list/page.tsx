import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getRequestOrigin } from "../../_lib/requestOrigin";
import { ShoppingListClient } from "./ShoppingListClient";

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

export default async function CommerceShoppingListPage() {
  const origin = await getRequestOrigin();
  const url = new URL("/api/commerce/shopping-list", origin);
  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = (await res.json()) as ShoppingListResponse;

  return (
    <PageShell
      title="Commerce · Shopping List"
      description="Shopping list / wishlist dari mock API PRD-003."
    >
      <SectionCrumb href="/commerce" label="← Kembali ke PRD-003 Commerce" />
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {data.list.status} · {data.userId}
            </div>
            <div className="mt-1 text-lg font-semibold">{data.list.title}</div>
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Updated: <span className="font-mono">{data.updatedAt}</span>
          </div>
        </div>
      </div>

      <ShoppingListClient list={data.list} />

    </PageShell>
  );
}
