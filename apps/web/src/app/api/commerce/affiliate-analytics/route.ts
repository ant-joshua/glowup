import { findProduct } from "../_data";
import { readCommerceStore } from "../../../_lib/commerceStore";

const conversionRateByPeriod = {
  daily: 0.04,
  weekly: 0.045,
  monthly: 0.04,
} as const;

const impressionsByPeriod = {
  daily: 7000,
  weekly: 40000,
  monthly: 180000,
} as const;

const periodWindowMs = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
} as const;

const COMMISSION_RATE = 0.12;

function aovFromProductPrice(productPrice: number) {
  return Math.round(productPrice * 1.2);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const periodRaw = (searchParams.get("period") ?? "weekly").toLowerCase();
  const period =
    periodRaw === "daily" || periodRaw === "weekly" || periodRaw === "monthly"
      ? periodRaw
      : "weekly";

  const store = await readCommerceStore();
  const now = Date.now();
  const since = now - periodWindowMs[period];

  const events = store.affiliateEvents.filter((evt) => {
    const ts = Date.parse(evt.createdAt);
    return Number.isFinite(ts) && ts >= since;
  });

  const clickEvents = events.filter((evt) => evt.kind === "click");
  const addEvents = events.filter((evt) => evt.kind === "add_to_list");
  const checkoutEvents = events.filter((evt) => evt.kind === "checkout_started");
  const purchaseEvents = events.filter((evt) => evt.kind === "purchase" || evt.kind === "conversion");

  const clicks = clickEvents.length;
  const adds = addEvents.length;
  const checkouts = checkoutEvents.length;
  const purchases = purchaseEvents.length;
  const impressions = impressionsByPeriod[period];
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const conversions = purchases > 0 ? purchases : Math.round(clicks * conversionRateByPeriod[period]);
  const orderCount = new Set(purchaseEvents.map((evt) => evt.orderId).filter(Boolean)).size;

  const revenueEvents = purchases > 0 ? purchaseEvents : clickEvents;
  const sumPrice = revenueEvents.reduce(
    (sum, evt) => sum + (findProduct(evt.productId)?.price ?? 150000),
    0,
  );
  const avgPrice = revenueEvents.length > 0 ? sumPrice / revenueEvents.length : 150000;
  const revenueIdr = conversions * aovFromProductPrice(avgPrice);
  const commissionIdr = Math.round(revenueIdr * COMMISSION_RATE);

  const byProduct = new Map<string, { clicks: number; adds: number; checkouts: number; purchases: number }>();
  for (const evt of events) {
    const kind =
      evt.kind === "click"
        ? "click"
        : evt.kind === "add_to_list"
          ? "add"
          : evt.kind === "checkout_started"
            ? "checkout"
            : "purchase";
    const prev = byProduct.get(evt.productId) ?? { clicks: 0, adds: 0, checkouts: 0, purchases: 0 };
    byProduct.set(evt.productId, {
      clicks: prev.clicks + (kind === "click" ? 1 : 0),
      adds: prev.adds + (kind === "add" ? 1 : 0),
      checkouts: prev.checkouts + (kind === "checkout" ? 1 : 0),
      purchases: prev.purchases + (kind === "purchase" ? 1 : 0),
    });
  }

  const topProducts = [...byProduct.entries()]
    .sort((a, b) => b[1].clicks - a[1].clicks)
    .slice(0, 3)
    .map(([productId, stats]) => {
      const product = findProduct(productId);
      const productPrice = product?.price ?? 150000;
      const productConversions = stats.purchases > 0 ? stats.purchases : Math.round(stats.clicks * conversionRateByPeriod[period]);
      const productRevenue = productConversions * aovFromProductPrice(productPrice);
      const productCommission = Math.round(productRevenue * COMMISSION_RATE);

      return {
        productId,
        clicks: stats.clicks,
        adds: stats.adds,
        checkouts: stats.checkouts,
        purchases: stats.purchases,
        conversions: productConversions,
        revenueIdr: productRevenue,
        commissionIdr: productCommission,
        product: product
          ? {
              id: product.id,
              name: product.name,
              brand: product.brand,
              category: product.category,
            }
          : null,
      };
    });

  const bySource = new Map<string, { clicks: number; adds: number; checkouts: number; purchases: number }>();
  for (const evt of events) {
    const source = evt.source ?? "unknown";
    const prev = bySource.get(source) ?? { clicks: 0, adds: 0, checkouts: 0, purchases: 0 };
    bySource.set(source, {
      clicks: prev.clicks + (evt.kind === "click" ? 1 : 0),
      adds: prev.adds + (evt.kind === "add_to_list" ? 1 : 0),
      checkouts: prev.checkouts + (evt.kind === "checkout_started" ? 1 : 0),
      purchases: prev.purchases + (evt.kind === "purchase" || evt.kind === "conversion" ? 1 : 0),
    });
  }
  const sources = [...bySource.entries()]
    .sort((a, b) => b[1].clicks - a[1].clicks)
    .map(([source, stats]) => ({ source, ...stats }));

  const byCampaign = new Map<string, { clicks: number; adds: number; checkouts: number; purchases: number }>();
  for (const evt of events) {
    const campaign = evt.campaign ?? "none";
    const prev = byCampaign.get(campaign) ?? { clicks: 0, adds: 0, checkouts: 0, purchases: 0 };
    byCampaign.set(campaign, {
      clicks: prev.clicks + (evt.kind === "click" ? 1 : 0),
      adds: prev.adds + (evt.kind === "add_to_list" ? 1 : 0),
      checkouts: prev.checkouts + (evt.kind === "checkout_started" ? 1 : 0),
      purchases: prev.purchases + (evt.kind === "purchase" || evt.kind === "conversion" ? 1 : 0),
    });
  }
  const campaigns = [...byCampaign.entries()]
    .sort((a, b) => b[1].clicks - a[1].clicks)
    .map(([campaign, stats]) => ({ campaign, ...stats }));

  const byDay = new Map<string, { clicks: number; adds: number; checkouts: number; purchases: number }>();
  for (const evt of events) {
    const kind =
      evt.kind === "click"
        ? "click"
        : evt.kind === "add_to_list"
          ? "add"
          : evt.kind === "checkout_started"
            ? "checkout"
            : "purchase";
    const day = evt.createdAt.slice(0, 10);
    const prev = byDay.get(day) ?? { clicks: 0, adds: 0, checkouts: 0, purchases: 0 };
    byDay.set(day, {
      clicks: prev.clicks + (kind === "click" ? 1 : 0),
      adds: prev.adds + (kind === "add" ? 1 : 0),
      checkouts: prev.checkouts + (kind === "checkout" ? 1 : 0),
      purchases: prev.purchases + (kind === "purchase" ? 1 : 0),
    });
  }
  const series = [...byDay.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, stats]) => ({ day, ...stats }));

  return Response.json({
    ok: true,
    creatorId: store.creatorId,
    period,
    summary: {
      clicks,
      adds,
      checkouts,
      purchases,
      orders: orderCount,
      ctr,
      conversions,
      revenueIdr,
      commissionIdr,
    },
    topProducts,
    sources,
    campaigns,
    series,
    updatedAt: store.updatedAt,
  });
}
