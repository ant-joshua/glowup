import Link from "next/link";
import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";

export default function ClinicSearchPage() {
  return (
    <PageShell
      title="Clinic · Search"
      description="Shell halaman untuk pencarian expert/clinic (akan dihubungkan ke mock API pada task berikutnya)."
    >
      <SectionCrumb href="/clinic" label="← Kembali ke PRD-006 Clinic" />
      <div className="flex flex-wrap gap-2">
        <Link
          href="/clinic/experts/dr-001"
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          Buka contoh profile expert
        </Link>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Hasil pencarian akan ditambahkan setelah mock API PRD-006 tersedia.
      </div>
    </PageShell>
  );
}
