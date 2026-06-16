import path from "node:path";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { withStoreLock } from "./storeLock";

export type ClinicBooking = {
  id: string;
  userId: string;
  expertId: string;
  serviceId: string;
  mode: "online" | "in_person";
  slotId: string;
  startAt: string;
  endAt: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
  cancelReason: string | null;
  reminders: ClinicReminder[];
  contactName: string | null;
  contactPhone: string | null;
  notes: string | null;
};

export type ClinicReminder = {
  id: string;
  bookingId: string;
  kind: "24h" | "2h";
  scheduledAt: string;
  status: "scheduled" | "sent";
  sentAt: string | null;
};

export type ClinicSlotHold = {
  id: string;
  userId: string;
  expertId: string;
  serviceId: string;
  mode: "online" | "in_person";
  slotId: string;
  createdAt: string;
  expiresAt: string;
};

export type ClinicStore = {
  updatedAt: string;
  bookings: ClinicBooking[];
  holds: ClinicSlotHold[];
};

const defaultStore: ClinicStore = {
  updatedAt: "2026-05-30T00:00:00.000Z",
  bookings: [],
  holds: [],
};

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

export function getClinicStorePath() {
  const raw = process.env.CLINIC_STORE_PATH?.trim();
  const fileName = raw ? path.basename(raw) : "clinic-store.json";
  return path.join(process.cwd(), "data", fileName);
}

async function writeJsonAtomic(filePath: string, value: unknown) {
  await withStoreLock(filePath, async () => {
    const dir = path.dirname(filePath);
    await mkdir(dir, { recursive: true });
    const tmp = `${filePath}.${randomBytes(8).toString("hex")}.tmp`;
    await writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
    await rename(tmp, filePath);
  });
}

export async function readClinicStore(): Promise<ClinicStore> {
  const filePath = getClinicStorePath();
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<ClinicStore>;
    if (!parsed || typeof parsed !== "object") return { ...defaultStore };
    const bookings = Array.isArray(parsed.bookings) ? parsed.bookings : defaultStore.bookings;
    const holds = Array.isArray(parsed.holds) ? parsed.holds : defaultStore.holds;
    return { ...defaultStore, ...parsed, bookings, holds };
  } catch {
    await writeJsonAtomic(filePath, defaultStore);
    return { ...defaultStore };
  }
}

export async function writeClinicStore(next: ClinicStore) {
  const saved: ClinicStore = { ...next, updatedAt: nowIso() };
  await writeJsonAtomic(getClinicStorePath(), saved);
  return saved;
}

export function normalizeId(input: unknown) {
  const v = typeof input === "string" ? input.trim() : "";
  if (!v) return null;
  if (v.length > 80) return null;
  return v;
}

export function normalizeMode(input: unknown): "online" | "in_person" | null {
  const v = typeof input === "string" ? input.trim() : "";
  if (v === "online" || v === "in_person") return v;
  return null;
}

export function normalizeText(input: unknown, maxLen: number) {
  const v = typeof input === "string" ? input.trim() : "";
  if (!v) return null;
  return v.slice(0, maxLen);
}

function newReminderId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

export function createRemindersForBooking(input: { bookingId: string; startAt: string }) {
  const startTs = Date.parse(input.startAt);
  if (!Number.isFinite(startTs)) return [];
  const reminders: ClinicReminder[] = [];
  const rules: Array<{ kind: ClinicReminder["kind"]; deltaMs: number }> = [
    { kind: "24h", deltaMs: 24 * 60 * 60 * 1000 },
    { kind: "2h", deltaMs: 2 * 60 * 60 * 1000 },
  ];
  const now = Date.now();

  for (const rule of rules) {
    const scheduledTs = startTs - rule.deltaMs;
    if (scheduledTs <= 0) continue;
    const scheduledAt = new Date(scheduledTs).toISOString();
    const sent = scheduledTs <= now;
    reminders.push({
      id: newReminderId("rm"),
      bookingId: input.bookingId,
      kind: rule.kind,
      scheduledAt,
      status: sent ? "sent" : "scheduled",
      sentAt: sent ? scheduledAt : null,
    });
  }

  return reminders;
}

export function createBooking(input: Omit<ClinicBooking, "id" | "createdAt" | "status" | "cancelReason" | "reminders">) {
  const bookingId = newId("bk");
  return {
    ...input,
    id: bookingId,
    status: "confirmed" as const,
    createdAt: nowIso(),
    cancelReason: null,
    reminders: createRemindersForBooking({ bookingId, startAt: input.startAt }),
  };
}
