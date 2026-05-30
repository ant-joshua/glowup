import Link from "next/link";
import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";

type CreatorRoutinesResponse = {
  ok: boolean;
  routines: Array<{
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
    createdAt: string;
    updatedAt: string;
  }>;
};

function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export const dynamic = "force-dynamic";

export default async function CreatorRoutinesPage() {
  const data = await fetchMockJson<CreatorRoutinesResponse>("/api/creator/routines");

  return (
    <PageShell
      title="Creator · Routines"
      description="Daftar routines dari mock API."
    >
      <SectionCrumb href="/creator" label="← Kembali ke PRD-002 Creator" />
      <div className="flex flex-wrap gap-2">
        <Link
          href="/creator/routines/new"
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          Buat routine baru
        </Link>
      </div>

      <div className="grid gap-3">
        {data.routines.map((routine) => (
          <div
            key={routine.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="text-sm font-medium">{routine.title}</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                {routine.category} · {routine.difficulty} · {routine.durationDays} hari
              </div>
            </div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {routine.description}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                Budget {formatIdr(routine.budgetRangeIdr.min)}–{formatIdr(routine.budgetRangeIdr.max)}
              </span>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                Steps {routine.steps.length}
              </span>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                Produk {routine.products.length}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Steps (preview)</div>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                  {routine.steps.slice(0, 3).map((step) => (
                    <li key={step.id} className="text-zinc-700 dark:text-zinc-200">
                      <span className="font-medium">{step.title}</span>{" "}
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        ({step.timeOfDay})
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Expected outcome</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
                  {routine.expectedOutcome.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              Updated: {new Date(routine.updatedAt).toLocaleString("id-ID")}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
