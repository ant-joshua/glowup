import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getRequestOrigin } from "../../_lib/requestOrigin";
import { CatalogClient } from "./CatalogClient";
import { CatalogFiltersClient } from "./CatalogFiltersClient";

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

type ShoppingListResponse = {
  ok: boolean;
  list: { items: Array<{ productId: string }> };
};

const CATEGORIES = ["", "Skincare", "Fashion"] as const;

function normalizeParam(value: string | string[] | undefined) {
  if (!value) {
    return "";
  }
  return Array.isArray(value) ? (value[0] ?? "") : value;
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

  const listRes = await fetch(new URL("/api/commerce/shopping-list", origin).toString(), {
    cache: "no-store",
  });
  const listData = (await listRes.json()) as ShoppingListResponse;
  const inListProductIds =
    listRes.ok && listData.ok === true
      ? listData.list.items.map((item) => item.productId)
      : [];

  return (
    <PageShell
      title="Commerce · Catalog"
      description="Browse katalog produk dari mock API PRD-003."
    >
      <SectionCrumb href="/commerce" label="← Kembali ke PRD-003 Commerce" />
      <CatalogFiltersClient initialQ={q} initialCategory={category} categories={CATEGORIES} />

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
        <CatalogClient items={data.items} inListProductIds={inListProductIds} />
      )}
    </PageShell>
  );
}
