"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ShoppingListItem = {
  id: string;
  productId: string;
  quantity: number;
  subtotal: number;
  currency: string;
  product: { id: string; name: string; brand: string; marketplace: string };
};

type ShoppingList = {
  id: string;
  title: string;
  status: string;
  currency: string;
  items: ShoppingListItem[];
  estimatedTotal: number;
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function CheckoutClient({ list }: { list: ShoppingList }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState("");
  const [starting, setStarting] = useState(false);
  const [placing, setPlacing] = useState(false);

  const rows = useMemo(() => list.items, [list.items]);
  const currency = list.currency || "IDR";

  async function startCheckout() {
    setStarting(true);
    try {
      const res = await fetch("/api/commerce/checkout/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source: "checkout", campaign: campaign.trim() || null }),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok === true) {
        toast.success("Checkout started.");
        router.refresh();
      } else {
        toast.error("Failed to start checkout.");
      }
    } catch {
      toast.error("Failed to start checkout.");
    } finally {
      setStarting(false);
    }
  }

  async function placeOrder() {
    setPlacing(true);
    try {
      const res = await fetch("/api/commerce/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source: "checkout", campaign: campaign.trim() || null }),
      });
      const json = (await res.json()) as { ok?: boolean; order?: { id: string } };
      if (res.ok && json.ok === true && json.order?.id) {
        toast.success("Order placed.");
        router.push(`/commerce/orders/${encodeURIComponent(json.order.id)}`);
        router.refresh();
      } else if (res.status === 409) {
        toast.error("Shopping list is empty.");
      } else {
        toast.error("Failed to place order.");
      }
    } catch {
      toast.error("Failed to place order.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Mock funnel events + order creation.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-secondary">Campaign (optional)</div>
            <Input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="ramadan-2026" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={startCheckout} disabled={starting || rows.length === 0}>
              {starting ? "Starting…" : "Start checkout"}
            </Button>
            <Button type="button" onClick={placeOrder} disabled={placing || rows.length === 0}>
              {placing ? "Placing…" : "Place order"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-secondary">No items to checkout.</CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>
              Estimated total: <span className="font-medium text-on-surface">{formatCurrency(list.estimatedTotal, currency)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-secondary">
                        {item.product.brand} · {item.product.marketplace}
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.subtotal, item.currency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

