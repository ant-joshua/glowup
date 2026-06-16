"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Order = {
  id: string;
  status: string;
  currency: string;
  total: number;
  createdAt: string;
  items: Array<{ id: string; quantity: number }>;
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function OrdersClient({ orders, updatedAt }: { orders: Order[]; updatedAt: string | null }) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-secondary">No orders yet.</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {updatedAt ? (
        <div className="text-sm text-secondary">
          Updated: <span className="font-mono">{updatedAt}</span>
        </div>
      ) : null}

      {orders.map((order) => {
        const itemsCount = order.items.reduce((sum, it) => sum + (it.quantity ?? 0), 0);
        return (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    <Link href={`/commerce/orders/${encodeURIComponent(order.id)}`} className="hover:underline">
                      {order.id}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {new Date(order.createdAt).toLocaleString("id-ID")} · {itemsCount} items
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={order.status === "paid" ? "default" : "secondary"}>{order.status}</Badge>
                  <div className="text-base font-semibold">{formatCurrency(order.total, order.currency)}</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}

