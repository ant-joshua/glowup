"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function RoutineDetailClient({
  routineId,
  status,
}: {
  routineId: string;
  status: "draft" | "published";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    try {
      const res = await fetch(`/api/creator/routines/${encodeURIComponent(routineId)}`, { method: "DELETE" });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok === true) {
        router.push("/creator/routines");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function togglePublish() {
    setBusy(true);
    try {
      const res = await fetch(`/api/creator/routines/${encodeURIComponent(routineId)}/publish`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ published: status !== "published" }),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok === true) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardDescription>Manage this routine.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href="/creator/routines">Back</Link>
        </Button>
        <Button type="button" variant="secondary" onClick={togglePublish} disabled={busy}>
          {status === "published" ? "Unpublish" : "Publish"}
        </Button>
        <Button asChild variant="outline">
          <Link href={`/creator/routines/${encodeURIComponent(routineId)}/edit`}>
            <Pencil data-icon="inline-start" />
            Edit
          </Link>
        </Button>
        <Button variant="destructive" onClick={remove} disabled={busy}>
          <Trash2 data-icon="inline-start" />
          {busy ? "Deleting…" : "Delete"}
        </Button>
      </CardContent>
    </Card>
  );
}
