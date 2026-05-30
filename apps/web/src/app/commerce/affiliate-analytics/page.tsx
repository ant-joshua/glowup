import Link from "next/link";
import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getRequestOrigin } from "../../_lib/requestOrigin";

type Period = "daily" | "weekly" | "monthly";

type AffiliateAnalyticsResponse = {
  ok: boolean;
  creatorId: string;
  period: Period;
  summary: {
    clicks: number;
    ctr: number;
    conversions: number;
    revenueIdr: number;
    commissionIdr: number;
  };
  topProducts: Array<{
    productId: string;
    clicks: number;
    conversions: number;
    revenueIdr: number;
    commissionIdr: number;
    product: { id: string; name: string; brand: string; category: string } | null;
  }>;
  updatedAt: string;
};

const PERIODS: Period[] = ["daily", "weekly", "monthly"];

function normalizeParam(value: string | string[] | undefined) {
  if (!value) {
    return "";
  }
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}

export default async function CommerceAffiliateAnalyticsPage({
  searchParams,
}: {
  searchParams?: { period?: string | string[] };
}) {
  const periodRaw = normalizeParam(searchParams?.period).toLowerCase();
  const period: Period = PERIODS.includes(periodRaw as Period)
    ? (periodRaw as Period)
    : "weekly";

  const origin = await getRequestOrigin();
  const url = new URL("/api/commerce/affiliate-analytics", origin);
  url.searchParams.set("period", period);
  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = (await res.json()) as AffiliateAnalyticsResponse;

  return (
    <PageShell
      title="Commerce · Affiliate Analytics"
      description="Ringkasan performa affiliate creator dari mock API PRD-003."
    >
      <SectionCrumb href="/commerce" label="← Kembali ke PRD-003 Commerce" />
      <form className="flex flex-wrap items-end gap-3" method="get">
        <div className="flex flex-col gap-1">
          <label
            className="text-sm text-zinc-600 dark:text-zinc-400"
            htmlFor="period"
          >
            Periode
          </label>
          <select
            id="period"
            name="period"
            defaultValue={period}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-zinc-700"
          >
            {PERIODS.map((value) => (
              <option key={value} value={value}>
                {value}
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
        <div className="ml-auto text-sm text-zinc-600 dark:text-zinc-400">
          Creator: <span className="font-mono">{data.creatorId}</span>
        </div>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Clicks</div>
          <div className="mt-1 text-lg font-semibold">{data.summary.clicks}</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">CTR</div>
          <div className="mt-1 text-lg font-semibold">
            {formatPercent(data.summary.ctr)}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Conversions
          </div>
          <div className="mt-1 text-lg font-semibold">
            {data.summary.conversions}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Revenue</div>
          <div className="mt-1 text-lg font-semibold">
            {formatIdr(data.summary.revenueIdr)}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Commission
          </div>
          <div className="mt-1 text-lg font-semibold">
            {formatIdr(data.summary.commissionIdr)}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-medium">Top Products</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Updated: <span className="font-mono">{data.updatedAt}</span>
          </div>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="py-2 pr-4 font-medium">Produk</th>
                <th className="py-2 pr-4 font-medium">Clicks</th>
                <th className="py-2 pr-4 font-medium">Conv</th>
                <th className="py-2 pr-4 font-medium">Revenue</th>
                <th className="py-2 font-medium">Commission</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.map((row) => (
                <tr
                  key={row.productId}
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  <td className="py-3 pr-4">
                    {row.product ? (
                      <Link
                        href={`/commerce/products/${row.product.id}`}
                        className="font-medium hover:underline"
                      >
                        {row.product.name}
                      </Link>
                    ) : (
                      <span className="font-mono">{row.productId}</span>
                    )}
                    {row.product ? (
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {row.product.brand} · {row.product.category}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4">{row.clicks}</td>
                  <td className="py-3 pr-4">{row.conversions}</td>
                  <td className="py-3 pr-4 font-medium">{formatIdr(row.revenueIdr)}</td>
                  <td className="py-3 font-medium">{formatIdr(row.commissionIdr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
