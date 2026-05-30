import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";

export default function ClinicBookingPage() {
  return (
    <PageShell
      title="Clinic · Booking"
      description="Shell halaman untuk booking flow (akan dihubungkan ke mock API pada task berikutnya)."
    >
      <SectionCrumb href="/clinic" label="← Kembali ke PRD-006 Clinic" />
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Flow booking (slots, konfirmasi, ringkasan) akan ditambahkan setelah mock
        API PRD-006 tersedia.
      </div>
    </PageShell>
  );
}
