import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";

export default function CreatorProfilePage() {
  return (
    <PageShell
      title="Creator · Profile"
      description="Shell halaman untuk profil creator (akan dihubungkan ke mock API pada task berikutnya)."
    >
      <SectionCrumb href="/creator" label="← Kembali ke PRD-002 Creator" />
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Konten creator profile akan ditambahkan setelah mock API PRD-002 tersedia.
      </div>
    </PageShell>
  );
}

