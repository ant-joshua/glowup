"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Goal = {
  id: string;
  title: string;
  category: string;
  summary: string;
  primaryMetric: string;
  target: { from: number; to: number; unit: string };
};

export function GoalsClient({
  goals,
  recommendedGoalIds,
  selectedGoalId,
}: {
  goals: Goal[];
  recommendedGoalIds: string[];
  selectedGoalId: string | null;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState(selectedGoalId);

  async function choose(goalId: string) {
    setBusyId(goalId);
    try {
      const res = await fetch("/api/intelligence/goals", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selectedGoalId: goalId }),
      });
      const json = (await res.json()) as { ok?: boolean; selectedGoalId?: string };
      if (res.ok && json.ok === true && json.selectedGoalId) {
        setSelected(json.selectedGoalId);
        toast.success("Goal updated.");
        router.refresh();
      } else {
        toast.error("Failed to update goal.");
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {goals.map((goal) => {
        const isSelected = goal.id === selected;
        const isRecommended = recommendedGoalIds.includes(goal.id);

        return (
          <Card
            key={goal.id}
            className={isSelected ? "border-emerald-300 dark:border-emerald-800" : undefined}
          >
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <CardDescription>
                    {goal.category} · <span className="font-mono">{goal.id}</span>
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {isSelected ? <Badge>Selected</Badge> : null}
                  {!isSelected && isRecommended ? <Badge variant="secondary">Recommended</Badge> : null}
                </div>
              </div>
              <div className="text-xs text-secondary">
                Metric{" "}
                <span className="font-mono text-on-surface">{goal.primaryMetric}</span> · Target{" "}
                <span className="font-mono text-on-surface">
                  {goal.target.from} → {goal.target.to} {goal.target.unit}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-secondary">{goal.summary}</div>
              <Button
                type="button"
                variant={isSelected ? "secondary" : "default"}
                onClick={() => choose(goal.id)}
                disabled={busyId != null}
              >
                {busyId === goal.id ? "Saving…" : isSelected ? "Selected" : "Select"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
