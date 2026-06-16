"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Roadmap = {
  id: string;
  userId: string;
  horizonDays: number;
  generatedAt: string;
  weeks: Array<{
    week: number;
    focus: string;
    actions: Array<{ id: string; title: string; cadence: string }>;
  }>;
};

type Props = {
  roadmap: Roadmap;
  date: string;
  completedActionIds: string[];
};

export function RoadmapClient({ roadmap, date, completedActionIds }: Props) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(() => new Set(completedActionIds));
  const [regenBusy, setRegenBusy] = useState(false);

  const allActions = useMemo(() => roadmap.weeks.flatMap((w) => w.actions), [roadmap.weeks]);

  async function toggleAction(actionId: string) {
    setBusyId(actionId);
    try {
      const res = await fetch(`/api/core/roadmap/actions/${encodeURIComponent(actionId)}/toggle`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date }),
      });
      const data = (await res.json()) as { ok?: boolean; entry?: { completedActionIds?: string[] } };
      if (res.ok && data.ok === true && data.entry?.completedActionIds) {
        setCompleted(new Set(data.entry.completedActionIds));
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function regenerate() {
    setRegenBusy(true);
    try {
      const res = await fetch("/api/core/roadmap/regenerate", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean };
      if (res.ok && data.ok === true) {
        router.refresh();
      }
    } finally {
      setRegenBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Roadmap</CardTitle>
              <CardDescription>
                Horizon {roadmap.horizonDays} hari · Generated{" "}
                {new Date(roadmap.generatedAt).toLocaleString("id-ID")}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={regenerate} disabled={regenBusy}>
              {regenBusy ? "Regenerating…" : "Regenerate"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="secondary">Today: {date}</Badge>
          <Badge variant="secondary">
            Done: {completed.size}/{allActions.length}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {roadmap.weeks.map((week) => (
          <Card key={week.week}>
            <CardHeader>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <CardTitle className="text-xl">Week {week.week}</CardTitle>
                <CardDescription>{week.focus}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {week.actions.map((action) => {
                const checked = completed.has(action.id);
                const busy = busyId === action.id;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => toggleAction(action.id)}
                    disabled={busy}
                    className="flex w-full items-center justify-between gap-3 rounded-[1.25rem] bg-surface-container-low px-4 py-3 text-left transition-colors hover:bg-surface-container"
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1">
                        <Checkbox checked={checked} />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-on-surface">{action.title}</div>
                        <div className="text-xs text-secondary">{action.cadence}</div>
                      </div>
                    </div>
                    <Badge variant={checked ? "default" : "outline"}>
                      {busy ? "…" : checked ? "Done" : "Todo"}
                    </Badge>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

