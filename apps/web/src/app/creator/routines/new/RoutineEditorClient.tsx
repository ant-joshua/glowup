"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type RoutineDraft = {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  durationDays: number;
  targetAudience: string[];
  budgetRangeIdr: { min: number; max: number };
  steps: Array<{ id: string; title: string; timeOfDay: string; notes: string }>;
  products: Array<{ id: string; type: string; name: string; affiliateUrl: string | null }>;
  expectedOutcome: string[];
};

function newId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function parseListComma(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export function RoutineEditorClient({
  creatorUsername,
  categoryHints,
  existingTitles,
  initialDraft,
  routineId,
}: {
  creatorUsername: string;
  categoryHints: string[];
  existingTitles: string[];
  initialDraft?: RoutineDraft;
  routineId?: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<RoutineDraft>(
    initialDraft ?? {
      title: "",
      description: "",
      category: categoryHints[0] ?? "skincare",
      difficulty: "beginner",
      durationDays: 7,
      targetAudience: [],
      budgetRangeIdr: { min: 0, max: 500000 },
      steps: [{ id: newId("st"), title: "", timeOfDay: "am/pm", notes: "" }],
      products: [],
      expectedOutcome: [],
    },
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleDup = useMemo(() => {
    const t = draft.title.trim().toLowerCase();
    if (!t) return false;
    if (routineId && initialDraft?.title.trim().toLowerCase() === t) return false;
    return existingTitles.some((x) => x.trim().toLowerCase() === t);
  }, [draft.title, existingTitles, routineId, initialDraft?.title]);

  const canSubmit = useMemo(() => draft.title.trim().length > 0 && !titleDup, [draft.title, titleDup]);

  async function save() {
    if (!canSubmit) return;
    setIsSaving(true);
    setError(null);

    const payload = {
      title: draft.title,
      description: draft.description,
      category: draft.category,
      difficulty: draft.difficulty,
      durationDays: draft.durationDays,
      targetAudience: draft.targetAudience,
      budgetRangeIdr: draft.budgetRangeIdr,
      steps: draft.steps.filter((s) => s.title.trim().length > 0),
      products: draft.products.filter((p) => p.name.trim().length > 0),
      expectedOutcome: draft.expectedOutcome.filter(Boolean),
    };

    try {
      const url = routineId ? `/api/creator/routines/${encodeURIComponent(routineId)}` : "/api/creator/routines";
      const method = routineId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; routine?: { id: string } };
      if (!res.ok || json.ok !== true) {
        setError(json.error ?? "save_failed");
        return;
      }
      const id = json.routine?.id ?? routineId;
      if (id) router.push(`/creator/routines/${id}`);
      else router.push("/creator/routines");
      router.refresh();
    } catch {
      setError("save_failed");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{routineId ? "Edit routine" : "New routine"}</CardTitle>
          <CardDescription>Creator: @{creatorUsername}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <div className="text-xs font-semibold tracking-wide text-secondary">Title</div>
              <Input
                value={draft.title}
                disabled={isSaving}
                placeholder="Contoh: 14 Hari Skincare Basics"
                onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
              />
              {titleDup ? <div className="text-xs text-destructive">Title already exists.</div> : null}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <div className="text-xs font-semibold tracking-wide text-secondary">Description</div>
              <Textarea
                value={draft.description}
                disabled={isSaving}
                placeholder="Ringkas, fokus ke outcome."
                onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold tracking-wide text-secondary">Category</div>
              <Input
                value={draft.category}
                disabled={isSaving}
                placeholder={categoryHints.join(", ")}
                onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold tracking-wide text-secondary">Difficulty</div>
              <Input
                value={draft.difficulty}
                disabled={isSaving}
                placeholder="beginner | intermediate | advanced"
                onChange={(e) => setDraft((p) => ({ ...p, difficulty: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold tracking-wide text-secondary">Duration (days)</div>
              <Input
                inputMode="numeric"
                value={String(draft.durationDays)}
                disabled={isSaving}
                onChange={(e) => setDraft((p) => ({ ...p, durationDays: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold tracking-wide text-secondary">Target audience</div>
              <Input
                value={draft.targetAudience.join(", ")}
                disabled={isSaving}
                placeholder="combination, sensitive"
                onChange={(e) => setDraft((p) => ({ ...p, targetAudience: parseListComma(e.target.value) }))}
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold tracking-wide text-secondary">Budget min (IDR)</div>
              <Input
                inputMode="numeric"
                value={String(draft.budgetRangeIdr.min)}
                disabled={isSaving}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, budgetRangeIdr: { ...p.budgetRangeIdr, min: Number(e.target.value) } }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold tracking-wide text-secondary">Budget max (IDR)</div>
              <Input
                inputMode="numeric"
                value={String(draft.budgetRangeIdr.max)}
                disabled={isSaving}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, budgetRangeIdr: { ...p.budgetRangeIdr, max: Number(e.target.value) } }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold tracking-wide text-secondary">Steps</div>
              <Button
                variant="outline"
                size="sm"
                disabled={isSaving}
                onClick={() =>
                  setDraft((p) => ({
                    ...p,
                    steps: [...p.steps, { id: newId("st"), title: "", timeOfDay: "any", notes: "" }].slice(0, 30),
                  }))
                }
              >
                <Plus data-icon="inline-start" />
                Add step
              </Button>
            </div>

            <div className="grid gap-3">
              {draft.steps.map((step, idx) => (
                <div key={step.id} className="rounded-[1.25rem] bg-surface-container-low p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">Step {idx + 1}</Badge>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      disabled={isSaving || draft.steps.length <= 1}
                      onClick={() => setDraft((p) => ({ ...p, steps: p.steps.filter((s) => s.id !== step.id) }))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <div className="text-xs font-semibold tracking-wide text-secondary">Title</div>
                      <Input
                        value={step.title}
                        disabled={isSaving}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            steps: p.steps.map((s) => (s.id === step.id ? { ...s, title: e.target.value } : s)),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold tracking-wide text-secondary">Time of day</div>
                      <Input
                        value={step.timeOfDay}
                        disabled={isSaving}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            steps: p.steps.map((s) => (s.id === step.id ? { ...s, timeOfDay: e.target.value } : s)),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold tracking-wide text-secondary">Notes</div>
                      <Input
                        value={step.notes}
                        disabled={isSaving}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            steps: p.steps.map((s) => (s.id === step.id ? { ...s, notes: e.target.value } : s)),
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold tracking-wide text-secondary">Products</div>
              <Button
                variant="outline"
                size="sm"
                disabled={isSaving}
                onClick={() =>
                  setDraft((p) => ({
                    ...p,
                    products: [
                      ...p.products,
                      { id: newId("pd"), type: "product", name: "", affiliateUrl: "" },
                    ].slice(0, 30),
                  }))
                }
              >
                <Plus data-icon="inline-start" />
                Add product
              </Button>
            </div>

            <div className="grid gap-3">
              {draft.products.map((prod, idx) => (
                <div key={prod.id} className="rounded-[1.25rem] bg-surface-container-low p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">Product {idx + 1}</Badge>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      disabled={isSaving}
                      onClick={() => setDraft((p) => ({ ...p, products: p.products.filter((x) => x.id !== prod.id) }))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold tracking-wide text-secondary">Type</div>
                      <Input
                        value={prod.type}
                        disabled={isSaving}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            products: p.products.map((x) => (x.id === prod.id ? { ...x, type: e.target.value } : x)),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold tracking-wide text-secondary">Name</div>
                      <Input
                        value={prod.name}
                        disabled={isSaving}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            products: p.products.map((x) => (x.id === prod.id ? { ...x, name: e.target.value } : x)),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <div className="text-xs font-semibold tracking-wide text-secondary">Affiliate URL</div>
                      <Input
                        value={prod.affiliateUrl ?? ""}
                        disabled={isSaving}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            products: p.products.map((x) =>
                              x.id === prod.id ? { ...x, affiliateUrl: e.target.value } : x
                            ),
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              {draft.products.length === 0 ? (
                <div className="rounded-[1.25rem] bg-surface-container-low px-4 py-3 text-sm text-secondary">
                  No products yet.
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-semibold tracking-wide text-secondary">Expected outcome</div>
            <Textarea
              value={draft.expectedOutcome.join("\n")}
              disabled={isSaving}
              placeholder={"e.g.\nKulit terasa lebih lembap\nMinyak lebih terkontrol"}
              onChange={(e) =>
                setDraft((p) => ({
                  ...p,
                  expectedOutcome: e.target.value.split("\n").map((v) => v.trim()).filter(Boolean).slice(0, 12),
                }))
              }
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="outline" asChild>
              <Link href="/creator/routines">Back</Link>
            </Button>
            <Button disabled={!canSubmit || isSaving} onClick={save}>
              {isSaving ? "Saving…" : routineId ? "Save changes" : "Create routine"}
            </Button>
          </div>

          {error ? (
            <div className="rounded-[1.25rem] bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Failed to save ({error}).
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reference</CardTitle>
          <CardDescription>Existing titles (dup check) + quick preview.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Titles {existingTitles.length}</Badge>
            <Badge variant="secondary">Hints {categoryHints.length}</Badge>
          </div>

          <div className="rounded-[1.25rem] bg-surface-container-low p-4">
            <div className="text-xs font-semibold tracking-wide text-secondary">Preview</div>
            <pre className="mt-2 overflow-x-auto text-xs text-on-surface">
              {JSON.stringify(
                {
                  title: draft.title,
                  category: draft.category,
                  difficulty: draft.difficulty,
                  durationDays: draft.durationDays,
                  steps: draft.steps.filter((s) => s.title.trim()).length,
                  products: draft.products.filter((p) => p.name.trim()).length,
                },
                null,
                2,
              )}
            </pre>
          </div>

          <div className="rounded-[1.25rem] bg-surface-container-low p-4">
            <div className="text-xs font-semibold tracking-wide text-secondary">Existing titles</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-on-surface">
              {existingTitles.slice(0, 12).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
