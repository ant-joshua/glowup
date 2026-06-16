import { normalizeId, readClinicStore, writeClinicStore } from "../../../../../_lib/clinicStore";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ holdId: string }> },
) {
  const { holdId } = await params;
  const id = normalizeId(holdId);
  if (!id) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readClinicStore();
  const now = Date.now();
  const holds = store.holds.filter((h) => Date.parse(h.expiresAt) > now);
  const existing = holds.find((h) => h.id === id) ?? null;
  if (!existing) {
    return Response.json({ ok: true, released: false, updatedAt: store.updatedAt });
  }
  if (existing.userId !== "usr_0001") {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const saved = await writeClinicStore({ ...store, holds: holds.filter((h) => h.id !== id) });
  return Response.json({ ok: true, released: true, updatedAt: saved.updatedAt });
}

