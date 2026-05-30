import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";

export default function AiStudioStoryboardPage() {
  return (
    <PageShell
      title="AI Studio · Storyboard"
      description="Shell halaman untuk storyboard generator (akan dihubungkan ke mock API pada task berikutnya)."
    >
      <SectionCrumb href="/ai-studio" label="← Kembali ke PRD-004 AI Studio" />
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Input/Output generator storyboard akan ditambahkan setelah mock API PRD-004 tersedia.
      </div>
    </PageShell>
  );
}
