import Link from "next/link";
import { PageShell } from "../../../_components/PageShell";
import { SectionCrumb } from "../../../_components/SectionCrumb";
import { getRequestOrigin } from "../../../_lib/requestOrigin";

type ProductVariant = {
  id: string;
  label: string;
  price: number;
  currency: string;
};

type Product = {
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
  variants: ProductVariant[];
};

type ProductDetailResponseOk = {
  ok: true;
  product: Product;
  related: Product[];
  updatedAt: string;
};

type ProductDetailResponseErr = {
  ok: false;
  error: string;
  productId: string;
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function CommerceProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  const origin = await getRequestOrigin();
  const url = new URL(
    `/api/commerce/products/${encodeURIComponent(params.productId)}`,
    origin,
  );
  const res = await fetch(url.toString(), { cache: "no-store" });
  const json = (await res.json()) as ProductDetailResponseOk | ProductDetailResponseErr;

  return (
    <PageShell
      title="Commerce · Product Detail"
      description="Detail produk dari mock API PRD-003."
    >
      <SectionCrumb href="/commerce" label="← Kembali ke PRD-003 Commerce" />
      {!res.ok || !json.ok ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Produk tidak ditemukan:{" "}
          <span className="font-mono text-zinc-950 dark:text-zinc-50">
            {params.productId}
          </span>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {json.product.brand} · {json.product.category}
                </div>
                <div className="mt-1 text-lg font-semibold">{json.product.name}</div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {json.product.description}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                    ID {json.product.id}
                  </span>
                  <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                    {json.product.availability}
                  </span>
                  <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                    {json.product.marketplace}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <div className="text-lg font-semibold">
                  {formatCurrency(json.product.price, json.product.currency)}
                </div>
                <a
                  href={json.product.affiliateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                >
                  Buka tautan affiliate
                </a>
              </div>
            </div>
          </div>

          {json.product.variants.length > 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-sm font-medium">Varian</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {json.product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
                  >
                    <div className="font-medium">{variant.label}</div>
                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {formatCurrency(variant.price, variant.currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-sm font-medium">Rating</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Creator
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {json.product.creatorRating.toFixed(1)}
                </div>
              </div>
              <div className="rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Community
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {json.product.communityRating.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {json.related.length > 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-sm font-medium">Produk terkait</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {json.related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/commerce/products/${item.id}`}
                    className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {item.brand} · {formatCurrency(item.price, item.currency)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Updated: <span className="font-mono">{json.updatedAt}</span>
          </div>
        </>
      )}
    </PageShell>
  );
}
