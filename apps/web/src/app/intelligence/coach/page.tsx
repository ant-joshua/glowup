import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";

export default function IntelligenceCoachPage() {
  return (
    <PageShell
      title="Intelligence · Coach"
      description="Shell halaman untuk AI coach (akan dihubungkan ke mock API pada task berikutnya)."
    >
      <SectionCrumb
        href="/intelligence"
        label="← Kembali ke PRD-005 Intelligence"
      />
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        UI coach akan ditambahkan setelah mock API PRD-005 tersedia.
      </div>
    </PageShell>
  );
}
