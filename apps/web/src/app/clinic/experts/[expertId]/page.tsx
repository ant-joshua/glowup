import { PageShell } from "../../../_components/PageShell";
import { SectionCrumb } from "../../../_components/SectionCrumb";

export default function ClinicExpertProfilePage({
  params,
}: {
  params: { expertId: string };
}) {
  return (
    <PageShell
      title="Clinic · Expert Profile"
      description="Shell halaman untuk detail expert (akan dihubungkan ke mock API pada task berikutnya)."
    >
      <SectionCrumb href="/clinic" label="← Kembali ke PRD-006 Clinic" />
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Expert ID:{" "}
        <span className="font-mono text-zinc-950 dark:text-zinc-50">
          {params.expertId}
        </span>
      </div>
    </PageShell>
  );
}
