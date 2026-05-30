import Link from "next/link";
import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";

export default function CommerceCatalogPage() {
  return (
    <PageShell
      title="Commerce · Catalog"
      description="Shell halaman untuk katalog produk (akan dihubungkan ke mock API pada task berikutnya)."
    >
      <SectionCrumb href="/commerce" label="← Kembali ke PRD-003 Commerce" />
      <div className="flex flex-wrap gap-2">
        <Link
          href="/commerce/products/sku-001"
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          Buka contoh product detail
        </Link>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Data katalog akan ditambahkan setelah mock API PRD-003 tersedia.
      </div>
    </PageShell>
  );
}
