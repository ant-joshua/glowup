import Link from "next/link";

import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getBaseUrl } from "../../_lib/getBaseUrl";
import { BookingsClient } from "./BookingsClient";

export const dynamic = "force-dynamic";

type Booking = {
  id: string;
  expertId: string;
  serviceId: string;
  mode: "online" | "in_person";
  slotId: string;
  startAt: string;
  endAt: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
  cancelReason?: string | null;
  reminders?: Array<{ id: string; kind: string; scheduledAt: string; status: string; sentAt: string | null }>;
  contactName: string | null;
  contactPhone: string | null;
  notes: string | null;
  expert: { id: string; name: string; category: string; location: string } | null;
  service: { id: string; name: string; durationMinutes: number; priceIdr: number } | null;
};

type BookingsResponse = {
  ok: boolean;
  scope: "upcoming" | "history" | "all";
  userId: string;
  bookings: Booking[];
  updatedAt: string;
};

async function getBookings() {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/clinic/bookings?scope=upcoming`, { cache: "no-store" });
  return (await res.json()) as BookingsResponse;
}

export default async function ClinicBookingsPage() {
  const data = await getBookings();

  return (
    <PageShell title="Clinic · My Bookings" description="Daftar booking yang akan datang (mock).">
      <SectionCrumb href="/clinic" label="← Kembali ke PRD-006 Clinic" />
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-secondary">
        <div>
          Scope <span className="font-mono text-on-surface">{data.scope}</span> ·{" "}
          <span className="font-mono text-on-surface">{data.userId}</span>
        </div>
        <div>
          Updated <span className="font-mono text-on-surface">{data.updatedAt}</span>
        </div>
      </div>

      <BookingsClient bookings={data.bookings} allowCancel />

      <div className="text-sm text-secondary">
        <Link href="/clinic/booking" className="hover:underline">
          Book a new slot
        </Link>{" "}
        ·{" "}
        <Link href="/clinic/bookings/history" className="hover:underline">
          View history
        </Link>
      </div>
    </PageShell>
  );
}
