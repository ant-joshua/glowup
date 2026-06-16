"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type TopProductRow = {
  productId: string;
  clicks: number;
  adds: number;
  checkouts: number;
  purchases: number;
  conversions: number;
  revenueIdr: number;
  commissionIdr: number;
  product: { id: string; name: string; brand: string; category: string } | null;
};

function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function AnalyticsClient({ topProducts }: { topProducts: TopProductRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function addPurchase(productId: string) {
    setBusyId(productId);
    try {
      const res = await fetch("/api/commerce/conversions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, source: "analytics" }),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok === true) {
        toast.success("Mock purchase added.");
        router.refresh();
      } else {
        toast.error("Failed to add purchase.");
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produk</TableHead>
          <TableHead>Clicks</TableHead>
          <TableHead>Adds</TableHead>
          <TableHead>Purch</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>Commission</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topProducts.map((row) => (
          <TableRow key={row.productId}>
            <TableCell className="align-top">
              {row.product ? (
                <Link href={`/commerce/products/${row.product.id}`} className="font-medium hover:underline">
                  {row.product.name}
                </Link>
              ) : (
                <span className="font-mono">{row.productId}</span>
              )}
              {row.product ? (
                <div className="mt-1 text-sm text-secondary">
                  {row.product.brand} · {row.product.category}
                </div>
              ) : null}
            </TableCell>
            <TableCell className="align-top">{row.clicks}</TableCell>
            <TableCell className="align-top">{row.adds}</TableCell>
            <TableCell className="align-top">{row.purchases}</TableCell>
            <TableCell className="align-top font-medium">{formatIdr(row.revenueIdr)}</TableCell>
            <TableCell className="align-top font-medium">{formatIdr(row.commissionIdr)}</TableCell>
            <TableCell className="align-top text-right">
              <Button
                type="button"
                variant="outline"
                onClick={() => addPurchase(row.productId)}
                disabled={busyId != null}
              >
                {busyId === row.productId ? "…" : "Add purchase"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
