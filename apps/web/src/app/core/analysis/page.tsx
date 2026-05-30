import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";

export default function CoreAnalysisPage() {
  return (
    <PageShell
      title="Core · AI Analysis"
      description="Shell halaman untuk ringkasan analisis (akan dihubungkan ke mock API pada task berikutnya)."
    >
      <SectionCrumb href="/core" label="← Kembali ke PRD-001 Core" />
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Konten analisis akan ditambahkan setelah mock API PRD-001 tersedia.
      </div>
    </PageShell>
  );
}

