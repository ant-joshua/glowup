import Link from "next/link";
import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";

export default function CreatorRoutinesPage() {
  return (
    <PageShell
      title="Creator · Routines"
      description="Shell halaman untuk daftar routine (akan dihubungkan ke mock API pada task berikutnya)."
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
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Daftar routines akan ditambahkan setelah mock API PRD-002 tersedia.
      </div>
    </PageShell>
  );
}
