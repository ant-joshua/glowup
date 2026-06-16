import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type AnalysisSummaryResponse = {
  ok: boolean;
  analysis: {
    id: string;
    userId: string;
    createdAt: string;
    confidencePct: number;
    faceShape: string;
    skin: { type: string; concerns: string[] };
    hair: { density: string; concerns: string[] };
    style: { vibe: string; notes: string[] };
    scores: Record<string, number>;
    highlights: string[];
  };
};

export const dynamic = "force-dynamic";

export default async function CoreAnalysisPage() {
  const [data, history] = await Promise.all([
    fetchMockJson<AnalysisSummaryResponse>("/api/core/analysis-summary"),
    fetchMockJson<{ ok: boolean; items: AnalysisSummaryResponse["analysis"][] }>("/api/core/analysis/history"),
  ]);

  const scoreEntries = Object.entries(data.analysis.scores).filter(([key]) => key !== "overall");

  return (
    <PageShell
      title="Core · AI Analysis"
      description="Ringkasan analisis + histori (persisted di mock store)."
    >
      <SectionCrumb href="/core" label="← Kembali ke PRD-001 Core" />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Confidence {data.analysis.confidencePct}%</Badge>
          <Badge variant="secondary">
            Generated {new Date(data.analysis.createdAt).toLocaleString("id-ID")}
          </Badge>
        </div>
        <Button asChild>
          <Link href="/start-analysis">Run new analysis</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overall</CardTitle>
            <CardDescription>Skor agregat + insight utama.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-sm font-medium text-secondary">Skor Overall</div>
              <div className="text-3xl font-semibold tabular-nums text-on-surface">
                {data.analysis.scores.overall}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-[1.25rem] bg-surface-container-low p-4">
                <div className="text-xs text-secondary">Face shape</div>
                <div className="mt-1 font-medium text-on-surface">{data.analysis.faceShape}</div>
              </div>
              <div className="rounded-[1.25rem] bg-surface-container-low p-4">
                <div className="text-xs text-secondary">Style vibe</div>
                <div className="mt-1 font-medium text-on-surface">{data.analysis.style.vibe}</div>
              </div>
              <div className="rounded-[1.25rem] bg-surface-container-low p-4">
                <div className="text-xs text-secondary">Skin</div>
                <div className="mt-1 font-medium text-on-surface">{data.analysis.skin.type}</div>
                <div className="mt-1 text-xs text-secondary">{data.analysis.skin.concerns.join(", ")}</div>
              </div>
              <div className="rounded-[1.25rem] bg-surface-container-low p-4">
                <div className="text-xs text-secondary">Hair</div>
                <div className="mt-1 font-medium text-on-surface">{data.analysis.hair.density}</div>
                <div className="mt-1 text-xs text-secondary">{data.analysis.hair.concerns.join(", ")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
            <CardDescription>Actionable insights ringkas.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-on-surface">
              {data.analysis.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score breakdown</CardTitle>
          <CardDescription>Detail skor + notes style.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {scoreEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-[1.25rem] bg-surface-container-low px-4 py-3 text-sm"
              >
                <div className="text-secondary">{key}</div>
                <div className="font-medium tabular-nums text-on-surface">{value}</div>
              </div>
            ))}
          </div>
          <div className="text-sm text-secondary">
            Notes: {data.analysis.style.notes.join(" · ")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Latest first.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {history.items.slice(0, 8).map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-[1.25rem] bg-surface-container-low px-4 py-3 text-sm"
            >
              <div className="font-medium text-on-surface">{item.id}</div>
              <div className="flex flex-wrap items-center gap-2 text-secondary">
                <span>{new Date(item.createdAt).toLocaleString("id-ID")}</span>
                <span>·</span>
                <span>overall {item.scores.overall}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
