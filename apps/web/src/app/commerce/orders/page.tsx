import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getRequestOrigin } from "../../_lib/requestOrigin";
import { OrdersClient } from "./OrdersClient";

type Order = {
  id: string;
  status: string;
  currency: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  createdAt: string;
  paidAt: string | null;
  items: Array<{ id: string; productId: string; quantity: number; unitPrice: number; lineTotal: number }>;
};

type OrdersResponse = {
  ok?: boolean;
  orders?: Order[];
  updatedAt?: string;
};

export const dynamic = "force-dynamic";

export default async function CommerceOrdersPage() {
  const origin = await getRequestOrigin();
  const res = await fetch(new URL("/api/commerce/orders", origin).toString(), { cache: "no-store" });
  const data = (await res.json()) as OrdersResponse;
  const orders = res.ok && data.ok === true && Array.isArray(data.orders) ? data.orders : [];

  return (
    <PageShell title="Commerce · Orders" description="Mock order history." >
      <SectionCrumb href="/commerce" label="← Kembali ke PRD-003 Commerce" />
      <OrdersClient orders={orders} updatedAt={data.updatedAt ?? null} />
    </PageShell>
  );
}

