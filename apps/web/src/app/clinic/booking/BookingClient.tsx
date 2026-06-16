"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Slot = {
  id: string;
  expertId: string;
  serviceId: string;
  mode: "online" | "in_person";
  startAt: string;
  endAt: string;
  available: boolean;
};

type BookingCreateResponse =
  | { ok: true; booking: { id: string } }
  | { ok: false; error: string; message?: string };

type HoldResponse =
  | { ok: true; hold: { id: string } }
  | { ok: false; error: string; message?: string };

export function BookingClient({
  expertId,
  serviceId,
  mode,
  slots,
  serviceName,
  durationMinutes,
  priceIdr,
}: {
  expertId: string;
  serviceId: string;
  mode: "online" | "in_person";
  slots: Slot[];
  serviceName: string | null;
  durationMinutes: number | null;
  priceIdr: number | null;
}) {
  const router = useRouter();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId) ?? null,
    [slots, selectedSlotId],
  );

  async function confirm() {
    if (!selectedSlotId) {
      setError("Pilih slot terlebih dulu.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const holdRes = await fetch("/api/clinic/booking/holds", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ expertId, serviceId, mode, slotId: selectedSlotId }),
      });
      const holdData = (await holdRes.json()) as HoldResponse;
      if (!holdRes.ok || holdData.ok !== true || !("hold" in holdData) || !holdData.hold?.id) {
        toast.error("Failed to hold slot.");
        setError("Gagal menahan slot. Coba refresh slots.");
        return;
      }

      const res = await fetch("/api/clinic/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          expertId,
          serviceId,
          mode,
          slotId: selectedSlotId,
          holdId: holdData.hold.id,
          contactName,
          contactPhone,
          notes,
        }),
      });
      const data = (await res.json()) as BookingCreateResponse;
      if (!res.ok || data.ok !== true) {
        setError("message" in data && data.message ? data.message : "Gagal membuat booking.");
        return;
      }
      toast.success("Booking created.");
      router.push("/clinic/bookings");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pilih slot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => {
            const selected = slot.id === selectedSlotId;
            return (
              <button
                key={slot.id}
                type="button"
                disabled={!slot.available || busy}
                onClick={() => setSelectedSlotId(slot.id)}
                className={[
                  "rounded-[1.25rem] border px-4 py-3 text-left text-sm transition-colors",
                  slot.available
                    ? "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                    : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400",
                  selected ? "ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-950" : "",
                ].join(" ")}
              >
                <div className="font-mono text-xs">{slot.id}</div>
                <div className="mt-2 font-mono">
                  {slot.startAt} → {slot.endAt}
                </div>
                <div className="mt-1 text-xs text-secondary">
                  {slot.available ? (selected ? "Selected" : "Available") : "Unavailable"}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Konfirmasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-secondary">
            Expert <span className="font-mono text-on-surface">{expertId}</span> · Service{" "}
            <span className="font-mono text-on-surface">{serviceId}</span>{" "}
            {serviceName ? (
              <>
                · <span className="text-on-surface">{serviceName}</span>
              </>
            ) : null}{" "}
            · Mode{" "}
            <span className="font-mono text-on-surface">{mode}</span>
          </div>
          {durationMinutes != null || priceIdr != null ? (
            <div className="text-sm text-secondary">
              {durationMinutes != null ? (
                <>
                  Duration <span className="font-mono text-on-surface">{durationMinutes}m</span>
                </>
              ) : null}
              {durationMinutes != null && priceIdr != null ? " · " : null}
              {priceIdr != null ? (
                <>
                  Price <span className="font-mono text-on-surface">IDR {priceIdr.toLocaleString("id-ID")}</span>
                </>
              ) : null}
            </div>
          ) : null}
          <div className="text-sm text-secondary">
            Slot:{" "}
            <span className="font-mono text-on-surface">
              {selectedSlot ? selectedSlot.startAt : "—"}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <div className="text-xs font-semibold tracking-wide text-secondary">Nama</div>
              <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold tracking-wide text-secondary">Phone</div>
              <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold tracking-wide text-secondary">Notes</div>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {error ? <div className="text-sm text-destructive">{error}</div> : <div />}
            <Button type="button" onClick={confirm} disabled={busy || !selectedSlotId}>
              {busy ? "Booking…" : "Confirm booking"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
