"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Goal = { id: string; label: string };

type Props = {
  user: {
    id: string;
    name: string;
    age: number;
    gender: string;
    heightCm: number;
    weightKg: number;
    occupation: string;
    budgetMonthlyIdr: number;
  };
  goals: Goal[];
  updatedAt: string;
};

function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeGoalLabel(label: string) {
  return label.trim().replaceAll(/\s+/g, " ").slice(0, 80);
}

export function ProfileClient({ user, goals, updatedAt }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState(() => ({
    name: user.name,
    age: String(user.age),
    gender: user.gender,
    heightCm: String(user.heightCm),
    weightKg: String(user.weightKg),
    occupation: user.occupation,
    budgetMonthlyIdr: String(user.budgetMonthlyIdr),
  }));

  const [goalItems, setGoalItems] = useState<Goal[]>(goals);
  const [newGoal, setNewGoal] = useState("");

  const goalLabels = useMemo(
    () => new Set(goalItems.map((g) => g.label.toLowerCase())),
    [goalItems],
  );

  async function save() {
    setIsSaving(true);
    setError(null);

    const payload = {
      user: {
        name: draft.name,
        age: Number(draft.age),
        gender: draft.gender,
        heightCm: Number(draft.heightCm),
        weightKg: Number(draft.weightKg),
        occupation: draft.occupation,
        budgetMonthlyIdr: Number(draft.budgetMonthlyIdr),
      },
      goals: goalItems,
    };

    try {
      const res = await fetch("/api/core/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || data.ok !== true) {
        setError(data.error ?? "save_failed");
        return;
      }
      setIsEditing(false);
      router.refresh();
    } catch {
      setError("save_failed");
    } finally {
      setIsSaving(false);
    }
  }

  function addGoal() {
    const label = normalizeGoalLabel(newGoal);
    if (!label) return;
    if (goalLabels.has(label.toLowerCase())) return;
    setGoalItems((prev) => [...prev, { id: `goal_${Date.now()}`, label }]);
    setNewGoal("");
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Baseline untuk roadmap, analisis, dan rekomendasi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <div className="text-xs font-semibold tracking-wide text-secondary">Nama</div>
              <Input
                value={draft.name}
                disabled={!isEditing || isSaving}
                onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold tracking-wide text-secondary">Usia</div>
              <Input
                value={draft.age}
                inputMode="numeric"
                disabled={!isEditing || isSaving}
                onChange={(e) => setDraft((p) => ({ ...p, age: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold tracking-wide text-secondary">Gender</div>
              <Input
                value={draft.gender}
                disabled={!isEditing || isSaving}
                onChange={(e) => setDraft((p) => ({ ...p, gender: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold tracking-wide text-secondary">Pekerjaan</div>
              <Input
                value={draft.occupation}
                disabled={!isEditing || isSaving}
                onChange={(e) => setDraft((p) => ({ ...p, occupation: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold tracking-wide text-secondary">Tinggi (cm)</div>
              <Input
                value={draft.heightCm}
                inputMode="numeric"
                disabled={!isEditing || isSaving}
                onChange={(e) => setDraft((p) => ({ ...p, heightCm: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold tracking-wide text-secondary">Berat (kg)</div>
              <Input
                value={draft.weightKg}
                inputMode="decimal"
                disabled={!isEditing || isSaving}
                onChange={(e) => setDraft((p) => ({ ...p, weightKg: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <div className="text-xs font-semibold tracking-wide text-secondary">Budget bulanan</div>
              <Input
                value={draft.budgetMonthlyIdr}
                inputMode="numeric"
                disabled={!isEditing || isSaving}
                onChange={(e) => setDraft((p) => ({ ...p, budgetMonthlyIdr: e.target.value }))}
              />
              <div className="text-xs text-secondary">{formatIdr(Number(draft.budgetMonthlyIdr) || 0)}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-secondary">
              Updated: {new Date(updatedAt).toLocaleString("id-ID")}
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setError(null);
                      setDraft({
                        name: user.name,
                        age: String(user.age),
                        gender: user.gender,
                        heightCm: String(user.heightCm),
                        weightKg: String(user.weightKg),
                        occupation: user.occupation,
                        budgetMonthlyIdr: String(user.budgetMonthlyIdr),
                      });
                      setGoalItems(goals);
                      setNewGoal("");
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button onClick={save} disabled={isSaving}>
                    {isSaving ? "Saving…" : "Save"}
                  </Button>
                </>
              )}
            </div>
          </div>

          {error ? (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Gagal menyimpan ({error}).
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Goals</CardTitle>
          <CardDescription>Digunakan untuk prioritas roadmap.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {goalItems.map((goal) => (
              <Badge key={goal.id} variant="secondary" className="gap-2 pr-2">
                <span>{goal.label}</span>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => setGoalItems((prev) => prev.filter((g) => g.id !== goal.id))}
                    className="grid size-5 place-items-center rounded-full bg-surface-container-highest text-on-surface"
                    aria-label={`Remove ${goal.label}`}
                  >
                    <X className="size-3" />
                  </button>
                ) : null}
              </Badge>
            ))}
          </div>

          {isEditing ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={newGoal}
                placeholder="Add a goal (e.g., Better Skin)"
                disabled={isSaving}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addGoal();
                }}
              />
              <Button variant="outline" onClick={addGoal} disabled={isSaving}>
                Add
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

