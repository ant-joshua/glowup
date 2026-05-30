import { findProduct } from "../_data";

const metricsByPeriod = {
  daily: {
    clicks: 214,
    ctr: 0.031,
    conversions: 9,
    revenueIdr: 1875000,
    commissionIdr: 225000,
  },
  weekly: {
    clicks: 1420,
    ctr: 0.036,
    conversions: 61,
    revenueIdr: 12975000,
    commissionIdr: 1557000,
  },
  monthly: {
    clicks: 6010,
    ctr: 0.034,
    conversions: 242,
    revenueIdr: 51900000,
    commissionIdr: 6228000,
  },
} as const;

const topProductRows = [
  { productId: "sku-002", clicks: 460, conversions: 24, revenueIdr: 4536000, commissionIdr: 544320 },
  { productId: "sku-001", clicks: 390, conversions: 18, revenueIdr: 2322000, commissionIdr: 278640 },
  { productId: "sku-003", clicks: 310, conversions: 12, revenueIdr: 1188000, commissionIdr: 142560 },
] as const;

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const periodRaw = (searchParams.get("period") ?? "weekly").toLowerCase();
  const period =
    periodRaw === "daily" || periodRaw === "weekly" || periodRaw === "monthly"
      ? periodRaw
      : "weekly";

  const summary = metricsByPeriod[period];
  const topProducts = topProductRows.map((row) => {
    const product = findProduct(row.productId);

    return {
      ...row,
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

  return Response.json({
    ok: true,
    creatorId: "cr_0001",
    period,
    summary,
    topProducts,
    updatedAt: "2026-05-20T00:00:00.000Z",
  });
}

