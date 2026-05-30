import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";

export default function CoreProfilePage() {
  return (
    <PageShell
      title="Core · Profile"
      description="Shell halaman untuk profil user (akan dihubungkan ke mock API pada task berikutnya)."
    >
      <SectionCrumb href="/core" label="← Kembali ke PRD-001 Core" />
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Konten profil akan ditambahkan setelah mock API PRD-001 tersedia.
      </div>
    </PageShell>
  );
}

