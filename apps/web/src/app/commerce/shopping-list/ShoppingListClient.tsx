"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ShoppingListItem = {
  id: string;
  productId: string;
  quantity: number;
  addedAt: string;
  subtotal: number;
  currency: string;
  product: {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    currency: string;
    imageUrl: string;
    affiliateUrl: string;
    marketplace: string;
    availability: string;
  };
};

type ShoppingList = {
  id: string;
  title: string;
  status: string;
  currency: string;
  items: ShoppingListItem[];
  estimatedTotal: number;
};

function clampQty(input: string) {
  const raw = Number(input);
  if (!Number.isFinite(raw)) return 1;
  const v = Math.round(raw);
  if (v < 1) return 1;
  if (v > 99) return 99;
  return v;
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function ShoppingListClient({ list }: { list: ShoppingList }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [qtyById, setQtyById] = useState<Record<string, string>>(() => {
    const next: Record<string, string> = {};
    for (const item of list.items) next[item.id] = String(item.quantity);
    return next;
  });

  const rows = useMemo(() => list.items, [list.items]);

  async function updateQty(itemId: string) {
    setBusyId(itemId);
    try {
      const res = await fetch(`/api/commerce/shopping-list/items/${encodeURIComponent(itemId)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ quantity: clampQty(qtyById[itemId] ?? "1") }),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok === true) {
        toast.success("Quantity updated.");
        router.refresh();
      } else {
        toast.error("Failed to update quantity.");
      }
    } finally {
      setBusyId(null);
    }
  }

  async function remove(itemId: string) {
    setBusyId(itemId);
    try {
      const res = await fetch(`/api/commerce/shopping-list/items/${encodeURIComponent(itemId)}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok === true) {
        toast.success("Item removed.");
        router.refresh();
      } else {
        toast.error("Failed to remove item.");
      }
    } finally {
      setBusyId(null);
    }
  }

  async function clear() {
    setClearing(true);
    try {
      const res = await fetch("/api/commerce/shopping-list/clear", { method: "POST" });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok === true) {
        toast.success("List cleared.");
        router.refresh();
      } else {
        toast.error("Failed to clear list.");
      }
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-secondary">
          {list.status} · <span className="font-mono">{list.id}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="secondary" disabled={rows.length === 0}>
            <Link href="/commerce/checkout">Checkout</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/commerce/orders">Orders</Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline" disabled={rows.length === 0}>
                Clear list
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear shopping list?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes all items from the list. You can still add them again later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={clearing}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clear} disabled={clearing}>
                  {clearing ? "Clearing…" : "Clear"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-[1.25rem] bg-surface-container-low p-6 text-center text-sm text-secondary">
          Belum ada item di shopping list.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="align-top">
                  <Link href={`/commerce/products/${item.product.id}`} className="font-medium hover:underline">
                    {item.product.name}
                  </Link>
                  <div className="mt-1 text-sm text-secondary">
                    {item.product.brand} · {item.product.marketplace}
                  </div>
                  <div className="mt-1 text-xs text-secondary">
                    Added {new Date(item.addedAt).toLocaleDateString("id-ID")}
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <div className="flex items-center gap-2">
                    <Input
                      value={qtyById[item.id] ?? String(item.quantity)}
                      onChange={(e) => setQtyById((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      className="w-20"
                      inputMode="numeric"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => updateQty(item.id)}
                      disabled={busyId != null}
                    >
                      {busyId === item.id ? "…" : "Update"}
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="align-top font-medium">
                  {formatCurrency(item.subtotal, item.currency)}
                </TableCell>
                <TableCell className="align-top text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button asChild variant="secondary">
                      <a
                        href={`/api/commerce/redirect?productId=${encodeURIComponent(item.product.id)}&source=shopping_list`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Beli
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => remove(item.id)}
                      disabled={busyId != null}
                    >
                      {busyId === item.id ? "…" : "Remove"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          Estimasi total:{" "}
          <span className="font-semibold">
            {formatCurrency(list.estimatedTotal, list.currency)}
          </span>
        </div>
        <Button asChild variant="outline">
          <Link href="/commerce/catalog">Add more</Link>
        </Button>
      </div>
    </div>
  );
}
