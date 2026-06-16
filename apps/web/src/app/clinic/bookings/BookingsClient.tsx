"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
  reminders?: Array<{
    id: string;
    kind: string;
    scheduledAt: string;
    status: string;
    sentAt: string | null;
  }>;
  contactName: string | null;
  contactPhone: string | null;
  notes: string | null;
  expert: { id: string; name: string; category: string; location: string } | null;
  service: { id: string; name: string; durationMinutes: number; priceIdr: number } | null;
};

type Slot = {
  id: string;
  startAt: string;
  endAt: string;
  available: boolean;
};

type SlotsResponse = {
  ok?: boolean;
  slots?: Slot[];
};

type HoldResponse = {
  ok?: boolean;
  hold?: { id?: string };
};

export function BookingsClient({ bookings, allowCancel }: { bookings: Booking[]; allowCancel: boolean }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlotId, setRescheduleSlotId] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState<Slot[]>([]);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  async function cancel(bookingId: string, reason: string) {
    setBusyId(bookingId);
    try {
      const res = await fetch(`/api/clinic/bookings/${encodeURIComponent(bookingId)}/cancel`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && json.ok === true) {
        toast.success("Booking cancelled.");
        router.refresh();
      } else {
        toast.error(json.error === "reason_required" ? "Cancel reason required for late cancel." : "Failed to cancel booking.");
      }
    } finally {
      setBusyId(null);
    }
  }

  async function loadSlots(target: Booking, date: string) {
    setRescheduleLoading(true);
    try {
      const qs = new URLSearchParams({
        expertId: target.expertId,
        serviceId: target.serviceId,
        mode: target.mode,
        date,
      });
      const res = await fetch(`/api/clinic/booking/slots?${qs.toString()}`, { cache: "no-store" });
      const json = (await res.json()) as SlotsResponse;
      if (res.ok && json.ok === true && Array.isArray(json.slots)) {
        const next = json.slots;
        setRescheduleSlots(next);
        const firstAvailable = next.find((s) => s.available)?.id ?? "";
        setRescheduleSlotId((prev) => (prev ? prev : firstAvailable));
      } else {
        setRescheduleSlots([]);
        toast.error("Failed to load slots.");
      }
    } catch {
      setRescheduleSlots([]);
      toast.error("Failed to load slots.");
    } finally {
      setRescheduleLoading(false);
    }
  }

  async function reschedule(bookingId: string, slotId: string, holdId: string) {
    setBusyId(bookingId);
    try {
      const res = await fetch(`/api/clinic/bookings/${encodeURIComponent(bookingId)}/reschedule`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slotId, holdId }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && json.ok === true) {
        toast.success("Booking rescheduled.");
        router.refresh();
        return true;
      }
      toast.error(json.error === "reschedule_locked" ? "Too late to reschedule this booking." : "Failed to reschedule booking.");
      return false;
    } catch {
      toast.error("Failed to reschedule booking.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function submitReschedule() {
    if (!rescheduleTarget || !rescheduleSlotId) return;
    setBusyId(rescheduleTarget.id);
    try {
      const holdRes = await fetch("/api/clinic/booking/holds", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          expertId: rescheduleTarget.expertId,
          serviceId: rescheduleTarget.serviceId,
          mode: rescheduleTarget.mode,
          slotId: rescheduleSlotId,
        }),
      });
      const holdJson = (await holdRes.json()) as HoldResponse;
      const holdId = holdRes.ok && holdJson.ok === true ? (holdJson.hold?.id ?? "") : "";
      if (!holdId) {
        toast.error("Failed to hold slot.");
        return;
      }

      const ok = await reschedule(rescheduleTarget.id, rescheduleSlotId, holdId);
      if (!ok) return;
    } finally {
      setBusyId(null);
    }
    setRescheduleOpen(false);
    setRescheduleTarget(null);
    setRescheduleSlots([]);
    setRescheduleSlotId("");
    setRescheduleDate("");
  }

  async function submitCancel() {
    if (!cancelTargetId) return;
    await cancel(cancelTargetId, cancelReason.trim());
    setCancelOpen(false);
    setCancelTargetId(null);
    setCancelReason("");
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-secondary">
          No bookings.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm text-secondary">Reason (optional)</div>
            <Textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={cancelTargetId != null && busyId === cancelTargetId}>
                Close
              </Button>
            </DialogClose>
            <Button type="button" onClick={submitCancel} disabled={!cancelTargetId || busyId != null}>
              {busyId === cancelTargetId ? "Cancelling…" : "Confirm cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={rescheduleOpen}
        onOpenChange={(open) => {
          setRescheduleOpen(open);
          if (!open) {
            setRescheduleTarget(null);
            setRescheduleSlots([]);
            setRescheduleSlotId("");
            setRescheduleDate("");
            setRescheduleLoading(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule booking</DialogTitle>
          </DialogHeader>
          {rescheduleTarget ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-secondary">Booking</div>
                <div className="text-sm">
                  <span className="font-medium">
                    {rescheduleTarget.expert?.name ?? rescheduleTarget.expertId}
                  </span>{" "}
                  · {rescheduleTarget.service?.name ?? rescheduleTarget.serviceId} ·{" "}
                  <span className="font-mono">{rescheduleTarget.mode}</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2">
                  <div className="text-sm text-secondary">Date</div>
                  <Input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => {
                      setRescheduleDate(e.target.value);
                      setRescheduleSlotId("");
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => loadSlots(rescheduleTarget, rescheduleDate)}
                  disabled={!rescheduleDate || rescheduleLoading || busyId != null}
                >
                  {rescheduleLoading ? "Loading…" : "Refresh slots"}
                </Button>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-secondary">New slot</div>
                <Select value={rescheduleSlotId} onValueChange={setRescheduleSlotId} disabled={rescheduleLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={rescheduleLoading ? "Loading…" : "Pick a slot"} />
                  </SelectTrigger>
                  <SelectContent>
                    {rescheduleSlots
                      .filter((s) => s.available)
                      .map((slot) => (
                        <SelectItem key={slot.id} value={slot.id}>
                          {slot.id} · {slot.startAt.slice(11, 16)}–{slot.endAt.slice(11, 16)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {rescheduleSlots.length > 0 && rescheduleSlots.every((s) => !s.available) ? (
                  <div className="text-xs text-secondary">No available slots for the selected date.</div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link
                    href={`/clinic/booking?expertId=${encodeURIComponent(rescheduleTarget.expertId)}&serviceId=${encodeURIComponent(rescheduleTarget.serviceId)}&mode=${encodeURIComponent(rescheduleTarget.mode)}&date=${encodeURIComponent(rescheduleDate || rescheduleTarget.startAt.slice(0, 10))}`}
                  >
                    Open booking page
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-secondary">No booking selected.</div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={busyId != null && busyId === rescheduleTarget?.id}>
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={submitReschedule}
              disabled={!rescheduleTarget || !rescheduleSlotId || busyId != null || rescheduleLoading}
            >
              {busyId != null && busyId === rescheduleTarget?.id ? "Rescheduling…" : "Confirm reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {bookings.map((booking) => {
          const expertLabel = booking.expert ? booking.expert.name : booking.expertId;
          const serviceLabel = booking.service ? booking.service.name : booking.serviceId;
          const canCancel = allowCancel && booking.status === "confirmed";
          const date = booking.startAt.slice(0, 10);
          const reminders = Array.isArray(booking.reminders) ? booking.reminders : [];
          const nextReminder = reminders
            .filter((r) => r.status === "scheduled")
            .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0] ?? null;

          return (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{expertLabel}</CardTitle>
                    <CardDescription>
                      {serviceLabel} · <span className="font-mono">{booking.mode}</span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                      {booking.status}
                    </Badge>
                    <Badge variant="outline">{booking.slotId}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-secondary">
                  <span className="font-mono text-on-surface">{booking.startAt}</span> →{" "}
                  <span className="font-mono text-on-surface">{booking.endAt}</span>
                </div>
                {nextReminder ? (
                  <div className="text-sm text-secondary">
                    Next reminder: <span className="font-mono text-on-surface">{nextReminder.kind}</span> @{" "}
                    <span className="font-mono text-on-surface">{nextReminder.scheduledAt}</span>
                  </div>
                ) : null}
                {booking.status === "cancelled" && booking.cancelReason ? (
                  <div className="text-sm text-secondary">
                    Cancel reason: <span className="text-on-surface">{booking.cancelReason}</span>
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-secondary">
                    Created {new Date(booking.createdAt).toLocaleString("id-ID")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setRescheduleTarget(booking);
                        setRescheduleDate(date);
                        setRescheduleSlotId("");
                        setRescheduleSlots([]);
                        setRescheduleOpen(true);
                        void loadSlots(booking, date);
                      }}
                      disabled={busyId != null}
                    >
                      Reschedule
                    </Button>
                    {canCancel ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCancelTargetId(booking.id);
                          setCancelReason("");
                          setCancelOpen(true);
                        }}
                        disabled={busyId != null}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
