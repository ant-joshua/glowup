import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getRequestOrigin } from "../../_lib/requestOrigin";
import { Button } from "@/components/ui/button";
import { AnalyticsClient } from "./AnalyticsClient";

type Period = "daily" | "weekly" | "monthly";

type AffiliateAnalyticsResponse = {
  ok: boolean;
  creatorId: string;
  period: Period;
  summary: {
    clicks: number;
    adds: number;
    checkouts: number;
    purchases: number;
    orders: number;
    ctr: number;
    conversions: number;
    revenueIdr: number;
    commissionIdr: number;
  };
  topProducts: Array<{
    productId: string;
    clicks: number;
    adds: number;
    checkouts: number;
    purchases: number;
    conversions: number;
    revenueIdr: number;
    commissionIdr: number;
    product: { id: string; name: string; brand: string; category: string } | null;
  }>;
  sources: Array<{ source: string; clicks: number; adds: number; checkouts: number; purchases: number }>;
  campaigns: Array<{ campaign: string; clicks: number; adds: number; checkouts: number; purchases: number }>;
  series: Array<{ day: string; clicks: number; adds: number; checkouts: number; purchases: number }>;
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
        <Button type="submit" variant="outline">
          Terapkan
        </Button>
        <div className="ml-auto text-sm text-zinc-600 dark:text-zinc-400">
          Creator: <span className="font-mono">{data.creatorId}</span>
        </div>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Clicks</div>
          <div className="mt-1 text-lg font-semibold">{data.summary.clicks}</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Adds</div>
          <div className="mt-1 text-lg font-semibold">{data.summary.adds}</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">CTR</div>
          <div className="mt-1 text-lg font-semibold">
            {formatPercent(data.summary.ctr)}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Purchases
          </div>
          <div className="mt-1 text-lg font-semibold">
            {data.summary.purchases}
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
        <div className="mt-3">
          <AnalyticsClient topProducts={data.topProducts} />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm font-medium">Funnel by source</div>
          <div className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            {data.sources.length === 0 ? (
              <div className="text-secondary">No events yet.</div>
            ) : (
              data.sources.map((row) => (
                <div key={row.source} className="flex items-center justify-between gap-3">
                  <span className="font-mono">{row.source}</span>
                  <span className="text-secondary">
                    c <span className="font-medium text-on-surface">{row.clicks}</span> · a{" "}
                    <span className="font-medium text-on-surface">{row.adds}</span> · co{" "}
                    <span className="font-medium text-on-surface">{row.checkouts}</span> · p{" "}
                    <span className="font-medium text-on-surface">{row.purchases}</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm font-medium">Series</div>
          <div className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            {data.series.length === 0 ? (
              <div className="text-secondary">No events yet.</div>
            ) : (
              data.series.map((row) => (
                <div key={row.day} className="flex items-center justify-between gap-3">
                  <span className="font-mono">{row.day}</span>
                  <span className="text-secondary">
                    c <span className="font-medium text-on-surface">{row.clicks}</span> · a{" "}
                    <span className="font-medium text-on-surface">{row.adds}</span> · co{" "}
                    <span className="font-medium text-on-surface">{row.checkouts}</span> · p{" "}
                    <span className="font-medium text-on-surface">{row.purchases}</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-sm font-medium">Funnel by campaign</div>
        <div className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          {data.campaigns.length === 0 ? (
            <div className="text-secondary">No campaigns yet.</div>
          ) : (
            data.campaigns.map((row) => (
              <div key={row.campaign} className="flex items-center justify-between gap-3">
                <span className="font-mono">{row.campaign}</span>
                <span className="text-secondary">
                  c <span className="font-medium text-on-surface">{row.clicks}</span> · a{" "}
                  <span className="font-medium text-on-surface">{row.adds}</span> · co{" "}
                  <span className="font-medium text-on-surface">{row.checkouts}</span> · p{" "}
                  <span className="font-medium text-on-surface">{row.purchases}</span>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </PageShell>
  );
}
