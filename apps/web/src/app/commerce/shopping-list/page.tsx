import Link from "next/link";
import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getRequestOrigin } from "../../_lib/requestOrigin";

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

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

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
          <div className="text-sm">
            Estimasi total:{" "}
            <span className="font-semibold">
              {formatCurrency(data.list.estimatedTotal, data.list.currency)}
            </span>
          </div>
        </div>
      </div>

      {data.list.items.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Belum ada item di shopping list.
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="text-zinc-600 dark:text-zinc-400">
                <tr>
                  <th className="py-2 pr-4 font-medium">Produk</th>
                  <th className="py-2 pr-4 font-medium">Qty</th>
                  <th className="py-2 pr-4 font-medium">Subtotal</th>
                  <th className="py-2 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.list.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-zinc-200 dark:border-zinc-800"
                  >
                    <td className="py-3 pr-4 align-top">
                      <Link
                        href={`/commerce/products/${item.product.id}`}
                        className="font-medium hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {item.product.brand} · {item.product.marketplace}
                      </div>
                      <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                        Added {new Date(item.addedAt).toLocaleDateString("id-ID")}
                      </div>
                    </td>
                    <td className="py-3 pr-4 align-top">{item.quantity}</td>
                    <td className="py-3 pr-4 align-top font-medium">
                      {formatCurrency(item.subtotal, item.currency)}
                    </td>
                    <td className="py-3 align-top">
                      <a
                        href={item.product.affiliateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                      >
                        Beli
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Updated: <span className="font-mono">{data.updatedAt}</span>
      </div>
    </PageShell>
  );
}
