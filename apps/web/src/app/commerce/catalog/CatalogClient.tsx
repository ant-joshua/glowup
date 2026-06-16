"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CatalogItem = {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  marketplace: string;
  availability: string;
  creatorRating: number;
  communityRating: number;
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function CatalogClient({
  items,
  inListProductIds,
}: {
  items: CatalogItem[];
  inListProductIds: string[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [inList, setInList] = useState(() => new Set(inListProductIds));

  async function add(productId: string) {
    if (inList.has(productId)) return;
    setBusyId(productId);
    try {
      const res = await fetch("/api/commerce/shopping-list/items", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1, source: "catalog" }),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok === true) {
        toast.success("Added to list.");
        setInList((prev) => new Set([...prev, productId]));
        router.refresh();
      } else {
        toast.error("Failed to add.");
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg">
                  <Link href={`/commerce/products/${item.id}`} className="hover:underline">
                    {item.name}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {item.brand} · {item.category}
                </CardDescription>
              </div>
              <div className="shrink-0 text-sm font-semibold">
                {formatCurrency(item.price, item.currency)}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Creator {item.creatorRating.toFixed(1)}</Badge>
              <Badge variant="secondary">Community {item.communityRating.toFixed(1)}</Badge>
              <Badge variant="secondary">{item.marketplace}</Badge>
              {inList.has(item.id) ? <Badge>In list</Badge> : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-secondary">{item.description}</div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge variant="outline">{item.availability}</Badge>
              <Button
                type="button"
                onClick={() => add(item.id)}
                disabled={busyId != null || inList.has(item.id)}
              >
                {busyId === item.id ? "Adding…" : "Add to list"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
