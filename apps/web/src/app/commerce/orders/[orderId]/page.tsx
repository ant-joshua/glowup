import Link from "next/link";

import { PageShell } from "../../../_components/PageShell";
import { SectionCrumb } from "../../../_components/SectionCrumb";
import { getRequestOrigin } from "../../../_lib/requestOrigin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  lineTotal: number;
  productSnapshot: { id: string; name: string; brand: string; marketplace: string } | null;
};

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
  items: OrderItem[];
};

type OrderResponse = {
  ok?: boolean;
  order?: Order;
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export const dynamic = "force-dynamic";

export default async function CommerceOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const origin = await getRequestOrigin();
  const res = await fetch(new URL(`/api/commerce/orders/${encodeURIComponent(orderId)}`, origin).toString(), {
    cache: "no-store",
  });
  const data = (await res.json()) as OrderResponse;
  const order = res.ok && data.ok === true ? data.order ?? null : null;

  if (!order) {
    return (
      <PageShell title="Commerce · Order" description="Order not found.">
        <SectionCrumb href="/commerce/orders" label="← Back to orders" />
        <Card>
          <CardContent className="py-10 text-center text-sm text-secondary">Order not found.</CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell title={`Order · ${order.id}`} description="Mock order detail.">
      <SectionCrumb href="/commerce/orders" label="← Back to orders" />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg">{order.id}</CardTitle>
              <CardDescription>
                {new Date(order.createdAt).toLocaleString("id-ID")} ·{" "}
                <Link href="/commerce/affiliate-analytics" className="hover:underline">
                  View analytics
                </Link>
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={order.status === "paid" ? "default" : "secondary"}>{order.status}</Badge>
              <div className="text-base font-semibold">{formatCurrency(order.total, order.currency)}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2 text-sm text-secondary sm:grid-cols-2">
            <div>
              Subtotal: <span className="font-medium text-on-surface">{formatCurrency(order.subtotal, order.currency)}</span>
            </div>
            <div>
              Shipping: <span className="font-medium text-on-surface">{formatCurrency(order.shipping, order.currency)}</span>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell>
                    <div className="font-medium">{it.productSnapshot?.name ?? it.productId}</div>
                    <div className="text-sm text-secondary">
                      {it.productSnapshot?.brand ?? ""} {it.productSnapshot?.marketplace ? `· ${it.productSnapshot.marketplace}` : ""}
                    </div>
                  </TableCell>
                  <TableCell>{it.quantity}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(it.lineTotal, order.currency)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}

