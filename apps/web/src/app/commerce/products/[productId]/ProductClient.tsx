"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function clampQty(input: string) {
  const raw = Number(input);
  if (!Number.isFinite(raw)) return 1;
  const v = Math.round(raw);
  if (v < 1) return 1;
  if (v > 99) return 99;
  return v;
}

export function ProductClient({ productId }: { productId: string }) {
  const router = useRouter();
  const [qty, setQty] = useState("1");
  const [busy, setBusy] = useState(false);

  async function add() {
    setBusy(true);
    try {
      const res = await fetch("/api/commerce/shopping-list/items", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, quantity: clampQty(qty), source: "product" }),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok === true) {
        toast.success("Added to list.");
        router.refresh();
      } else {
        toast.error("Failed to add.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col gap-1">
        <div className="text-xs text-secondary">Qty</div>
        <Input
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          inputMode="numeric"
          className="w-24"
        />
      </div>
      <Button type="button" onClick={add} disabled={busy}>
        {busy ? "Adding…" : "Add to list"}
      </Button>
      <Button asChild variant="secondary">
        <Link href="/commerce/shopping-list">Open list</Link>
      </Button>
    </div>
  );
}
