import Link from "next/link";
import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getRequestOrigin } from "../../_lib/requestOrigin";

type CatalogItem = {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  affiliateUrl: string;
  marketplace: string;
  availability: string;
  creatorRating: number;
  communityRating: number;
  tags: string[];
};

type CatalogResponse = {
  ok: boolean;
  query: { q: string; category: string };
  items: CatalogItem[];
  total: number;
  updatedAt: string;
};

const CATEGORIES = ["", "Skincare", "Fashion"] as const;

function normalizeParam(value: string | string[] | undefined) {
  if (!value) {
    return "";
  }
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function CommerceCatalogPage({
  searchParams,
}: {
  searchParams?: { q?: string | string[]; category?: string | string[] };
}) {
  const q = normalizeParam(searchParams?.q).trim();
  const category = normalizeParam(searchParams?.category).trim();
  const origin = await getRequestOrigin();
  const url = new URL("/api/commerce/catalog", origin);

  if (q) {
    url.searchParams.set("q", q);
  }
  if (category) {
    url.searchParams.set("category", category);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = (await res.json()) as CatalogResponse;

  return (
    <PageShell
      title="Commerce · Catalog"
      description="Browse katalog produk dari mock API PRD-003."
    >
      <SectionCrumb href="/commerce" label="← Kembali ke PRD-003 Commerce" />
      <form className="flex flex-col gap-3 sm:flex-row sm:items-end" method="get">
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-sm text-zinc-600 dark:text-zinc-400" htmlFor="q">
            Pencarian
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Cari brand, nama, tag..."
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-zinc-700"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="text-sm text-zinc-600 dark:text-zinc-400"
            htmlFor="category"
          >
            Kategori
          </label>
          <select
            id="category"
            name="category"
            defaultValue={category}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-zinc-700"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat || "all"} value={cat}>
                {cat ? cat : "Semua"}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          Terapkan
        </button>
      </form>

      <div className="flex items-center justify-between gap-3 text-sm text-zinc-600 dark:text-zinc-400">
        <div>
          Total:{" "}
          <span className="font-medium text-zinc-950 dark:text-zinc-50">
            {data.total}
          </span>
        </div>
        <div className="font-mono">{data.updatedAt}</div>
      </div>

      {data.items.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Tidak ada produk yang cocok.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.items.map((item) => (
            <Link
              key={item.id}
              href={`/commerce/products/${item.id}`}
              className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{item.name}</div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.brand} · {item.category}
                  </div>
                </div>
                <div className="shrink-0 text-sm font-medium">
                  {formatCurrency(item.price, item.currency)}
                </div>
              </div>
              <div className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                {item.description}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                  Creator {item.creatorRating.toFixed(1)}
                </span>
                <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                  Community {item.communityRating.toFixed(1)}
                </span>
                <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                  {item.marketplace}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
