"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type Routine = {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: string;
  targetAudience: string[];
  difficulty: string;
  budgetRangeIdr: { min: number; max: number };
  durationDays: number;
  steps: Array<{ id: string; title: string; timeOfDay: string; notes: string }>;
  products: Array<{ id: string; type: string; name: string; affiliateUrl: string | null }>;
  expectedOutcome: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RoutinesClient({ routines }: { routines: Routine[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return routines;
    return routines.filter((r) => {
      const hay = `${r.title} ${r.description} ${r.category} ${r.difficulty} ${r.targetAudience.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, routines]);

  async function remove(routineId: string) {
    setBusyId(routineId);
    try {
      const res = await fetch(`/api/creator/routines/${encodeURIComponent(routineId)}`, { method: "DELETE" });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok === true) router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function setPublished(routineId: string, published: boolean) {
    setBusyId(routineId);
    try {
      const res = await fetch(`/api/creator/routines/${encodeURIComponent(routineId)}/publish`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ published }),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok === true) router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Routines</CardTitle>
              <CardDescription>Create, edit, and publish your routines.</CardDescription>
            </div>
            <Button asChild>
              <Link href="/creator/routines/new">New routine</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search routines…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Badge variant="secondary" className="w-fit">
            {filtered.length}/{routines.length}
          </Badge>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-secondary">
            No routines found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((routine) => (
            <Card key={routine.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">
                      <Link href={`/creator/routines/${routine.id}`} className="hover:underline">
                        {routine.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {routine.category} · {routine.difficulty} · {routine.durationDays} days
                    </CardDescription>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" disabled={busyId === routine.id}>
                        <MoreHorizontal data-icon="inline-start" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setPublished(routine.id, routine.status !== "published")}
                      >
                        {routine.status === "published" ? "Unpublish" : "Publish"}
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/creator/routines/${routine.id}/edit`}>
                          <Pencil data-icon="inline-start" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => remove(routine.id)}>
                        <Trash2 data-icon="inline-start" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-secondary">{routine.description}</div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Budget {formatIdr(routine.budgetRangeIdr.min)}–{formatIdr(routine.budgetRangeIdr.max)}
                  </Badge>
                  <Badge variant="secondary">Steps {routine.steps.length}</Badge>
                  <Badge variant="secondary">Products {routine.products.length}</Badge>
                  <Badge variant={routine.status === "published" ? "default" : "outline"}>{routine.status}</Badge>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-[1.25rem] bg-surface-container-low p-4">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Steps (preview)</div>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-on-surface">
                      {routine.steps.slice(0, 3).map((step) => (
                        <li key={step.id}>
                          <span className="font-medium">{step.title}</span>{" "}
                          <span className="text-xs text-secondary">({step.timeOfDay})</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="rounded-[1.25rem] bg-surface-container-low p-4">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Expected outcome</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-on-surface">
                      {routine.expectedOutcome.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-xs text-secondary">
                  Updated {new Date(routine.updatedAt).toLocaleString("id-ID")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
