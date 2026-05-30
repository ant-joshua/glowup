import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";

export default function CommerceShoppingListPage() {
  return (
    <PageShell
      title="Commerce · Shopping List"
      description="Shell halaman untuk shopping list (akan dihubungkan ke mock API pada task berikutnya)."
    >
      <SectionCrumb href="/commerce" label="← Kembali ke PRD-003 Commerce" />
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Data shopping list akan ditambahkan setelah mock API PRD-003 tersedia.
      </div>
    </PageShell>
  );
}
