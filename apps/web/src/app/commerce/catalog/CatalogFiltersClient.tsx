"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CatalogFiltersClient({
  initialQ,
  initialCategory,
  categories,
}: {
  initialQ: string;
  initialCategory: string;
  categories: readonly string[];
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);

  function submit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category.trim()) params.set("category", category.trim());

    const qs = params.toString();
    router.push(qs ? `/commerce/catalog?${qs}` : "/commerce/catalog");
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={submit}>
      <div className="flex flex-1 flex-col gap-1">
        <label className="text-sm text-zinc-600 dark:text-zinc-400" htmlFor="q">
          Pencarian
        </label>
        <Input
          id="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari brand, nama, tag..."
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-zinc-600 dark:text-zinc-400" htmlFor="category">
          Kategori
        </label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44" id="category">
            <SelectValue placeholder="Semua" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat || "all"} value={cat}>
                {cat ? cat : "Semua"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" variant="outline">
        Terapkan
      </Button>
    </form>
  );
}
