import { PageShell } from "../../../_components/PageShell";
import { SectionCrumb } from "../../../_components/SectionCrumb";
import { fetchMockJson } from "../../../_lib/mockApi";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { RoutineDetailClient } from "./RoutineDetailClient";

type RoutineResponse = {
  ok: boolean;
  routine: {
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
};

function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export const dynamic = "force-dynamic";

export default async function RoutineDetailPage({
  params,
}: {
  params: Promise<{ routineId: string }>;
}) {
  const { routineId } = await params;
  const data = await fetchMockJson<RoutineResponse>(`/api/creator/routines/${routineId}`);
  const r = data.routine;

  return (
    <PageShell title="Creator · Routine" description="Routine detail + steps + products.">
      <SectionCrumb href="/creator/routines" label="← Back to routines" />

      <Card>
        <CardHeader>
          <CardTitle>{r.title}</CardTitle>
          <CardDescription>
            {r.category} · {r.difficulty} · {r.durationDays} days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-on-surface">{r.description}</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              Budget {formatIdr(r.budgetRangeIdr.min)}–{formatIdr(r.budgetRangeIdr.max)}
            </Badge>
            <Badge variant="secondary">Target: {r.targetAudience.join(", ") || "—"}</Badge>
            <Badge variant="secondary">Updated {new Date(r.updatedAt).toLocaleString("id-ID")}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Steps</CardTitle>
            <CardDescription>What to do, when, and why.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {r.steps.map((s, idx) => (
              <div key={s.id} className="rounded-[1.25rem] bg-surface-container-low p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-on-surface">
                    {idx + 1}. {s.title}
                  </div>
                  <Badge variant="outline">{s.timeOfDay}</Badge>
                </div>
                {s.notes ? <div className="mt-2 text-sm text-secondary">{s.notes}</div> : null}
              </div>
            ))}
            {r.steps.length === 0 ? (
              <div className="rounded-[1.25rem] bg-surface-container-low px-4 py-3 text-sm text-secondary">
                No steps yet.
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Suggested items (optional affiliate links).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {r.products.map((p) => (
              <div key={p.id} className="rounded-[1.25rem] bg-surface-container-low p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium text-on-surface">{p.name}</div>
                  <Badge variant="outline">{p.type}</Badge>
                </div>
                {p.affiliateUrl ? (
                  <a
                    href={p.affiliateUrl}
                    className="mt-2 block truncate text-sm font-medium text-primary hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {p.affiliateUrl}
                  </a>
                ) : (
                  <div className="mt-2 text-sm text-secondary">No affiliate link.</div>
                )}
              </div>
            ))}
            {r.products.length === 0 ? (
              <div className="rounded-[1.25rem] bg-surface-container-low px-4 py-3 text-sm text-secondary">
                No products yet.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expected outcome</CardTitle>
          <CardDescription>What the follower should feel/see.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {r.expectedOutcome.length ? (
            <ul className="list-disc space-y-2 pl-5 text-sm text-on-surface">
              {r.expectedOutcome.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          ) : (
            <div className="rounded-[1.25rem] bg-surface-container-low px-4 py-3 text-sm text-secondary">
              No outcomes yet.
            </div>
          )}
        </CardContent>
      </Card>

      <RoutineDetailClient routineId={r.id} status={r.status} />
    </PageShell>
  );
}
