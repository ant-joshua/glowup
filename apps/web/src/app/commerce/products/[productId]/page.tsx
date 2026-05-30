import { PageShell } from "../../../_components/PageShell";
import { SectionCrumb } from "../../../_components/SectionCrumb";

export default function CommerceProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  return (
    <PageShell
      title="Commerce · Product Detail"
      description="Shell halaman untuk detail produk (akan dihubungkan ke mock API pada task berikutnya)."
    >
      <SectionCrumb href="/commerce" label="← Kembali ke PRD-003 Commerce" />
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Product ID:{" "}
        <span className="font-mono text-zinc-950 dark:text-zinc-50">
          {params.productId}
        </span>
      </div>
    </PageShell>
  );
}
