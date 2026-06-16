"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Action = { id: string; title: string; cadence: string };

type ProgressEntry = {
  date: string;
  weightKg: number;
  transformationScore: number;
  completedActionIds: string[];
};

type Props = {
  summary: {
    startDate: string;
    endDate: string;
    roadmapCompletionPct: number;
    transformationScoreDelta: number;
    weightKgDelta: number;
  };
  entries: ProgressEntry[];
  actions: Action[];
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function ProgressClient({ summary, entries, actions }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latest = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    return sorted[sorted.length - 1] ?? null;
  }, [entries]);

  const [date, setDate] = useState(today());
  const [weightKg, setWeightKg] = useState(latest ? String(latest.weightKg) : "");
  const [score, setScore] = useState(latest ? String(latest.transformationScore) : "");
  const [completed, setCompleted] = useState<Set<string>>(
    new Set(entries.find((e) => e.date === today())?.completedActionIds ?? []),
  );

  const actionMap = useMemo(() => new Map(actions.map((a) => [a.id, a])), [actions]);

  function toggle(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function saveEntry() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/core/progress/entries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          date,
          weightKg: Number(weightKg),
          transformationScore: Number(score),
          completedActionIds: [...completed],
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || data.ok !== true) {
        setError(data.error ?? "save_failed");
        return;
      }
      router.refresh();
    } catch {
      setError("save_failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Roadmap completion</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{summary.roadmapCompletionPct}%</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-secondary">
            {summary.startDate} → {summary.endDate}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Score delta</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {summary.transformationScoreDelta >= 0 ? "+" : ""}
              {summary.transformationScoreDelta}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-secondary">Periode yang sama</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Weight delta</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {summary.weightKgDelta >= 0 ? "+" : ""}
              {summary.weightKgDelta} kg
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-secondary">Periode yang sama</CardContent>
        </Card>
      </div>

      <Tabs defaultValue="checkin">
        <TabsList>
          <TabsTrigger value="checkin">Check-in</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="checkin">
          <Card>
            <CardHeader>
              <CardTitle>Daily check-in</CardTitle>
              <CardDescription>Catat berat, skor, dan action yang selesai.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold tracking-wide text-secondary">Tanggal</div>
                  <Input
                    type="date"
                    value={date}
                    disabled={busy}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold tracking-wide text-secondary">Berat (kg)</div>
                  <Input
                    inputMode="decimal"
                    value={weightKg}
                    disabled={busy}
                    onChange={(e) => setWeightKg(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold tracking-wide text-secondary">Skor</div>
                  <Input
                    inputMode="numeric"
                    value={score}
                    disabled={busy}
                    onChange={(e) => setScore(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold tracking-wide text-secondary">Completed actions</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {actions.map((a) => {
                    const checked = completed.has(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggle(a.id)}
                        className="flex items-start gap-3 rounded-[1.25rem] bg-surface-container-low px-4 py-3 text-left hover:bg-surface-container"
                      >
                        <div className="pt-1">
                          <Checkbox checked={checked} />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-on-surface">{a.title}</div>
                          <div className="text-xs text-secondary">{a.cadence}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary">Selected: {completed.size}</Badge>
                <Button onClick={saveEntry} disabled={busy}>
                  {busy ? "Saving…" : "Save check-in"}
                </Button>
              </div>

              {error ? (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  Gagal menyimpan ({error}).
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
              <CardDescription>Entry progres tersimpan di mock store.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-separate border-spacing-y-2 text-sm">
                <thead>
                  <tr className="text-left text-xs text-secondary">
                    <th className="px-3 py-1">Tanggal</th>
                    <th className="px-3 py-1">Berat (kg)</th>
                    <th className="px-3 py-1">Skor</th>
                    <th className="px-3 py-1">Actions selesai</th>
                  </tr>
                </thead>
                <tbody>
                  {[...entries]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((entry) => (
                      <tr key={entry.date} className="rounded-lg bg-surface-container-low">
                        <td className="px-3 py-2 font-medium">{entry.date}</td>
                        <td className="px-3 py-2 tabular-nums">{entry.weightKg}</td>
                        <td className="px-3 py-2 tabular-nums">{entry.transformationScore}</td>
                        <td className="px-3 py-2 tabular-nums">
                          {entry.completedActionIds
                            .map((id) => actionMap.get(id)?.title ?? id)
                            .slice(0, 3)
                            .join(" · ")}
                          {entry.completedActionIds.length > 3
                            ? ` · +${entry.completedActionIds.length - 3}`
                            : ""}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

