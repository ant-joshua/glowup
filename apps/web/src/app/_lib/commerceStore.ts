import path from "node:path";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { withStoreLock } from "./storeLock";

export type CommerceShoppingListItem = {
  id: string;
  productId: string;
  productSnapshot?: {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    currency: string;
    imageUrl: string;
    affiliateUrl: string;
    marketplace: string;
    availability: string;
  } | null;
  quantity: number;
  addedAt: string;
};

export type CommerceShoppingList = {
  id: string;
  title: string;
  status: "draft" | "active" | "purchased";
  currency: "IDR";
  items: CommerceShoppingListItem[];
};

export type CommerceEventSource =
  | "catalog"
  | "product"
  | "shopping_list"
  | "analytics"
  | "checkout"
  | "orders"
  | "unknown";

export type CommerceEventKind =
  | "click"
  | "add_to_list"
  | "checkout_started"
  | "purchase"
  | "conversion";

export type CommerceEvent = {
  id: string;
  productId: string;
  kind: CommerceEventKind;
  source: CommerceEventSource;
  campaign: string | null;
  orderId: string | null;
  createdAt: string;
};

export type CommerceOrderItem = {
  id: string;
  productId: string;
  productSnapshot: NonNullable<CommerceShoppingListItem["productSnapshot"]> | null;
  quantity: number;
  unitPrice: number;
  currency: string;
  lineTotal: number;
};

export type CommerceOrder = {
  id: string;
  userId: string;
  listId: string;
  status: "placed" | "paid" | "refunded";
  currency: string;
  items: CommerceOrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  createdAt: string;
  paidAt: string | null;
};

export type CommerceStore = {
  updatedAt: string;
  userId: string;
  creatorId: string;
  shoppingList: CommerceShoppingList;
  affiliateEvents: CommerceEvent[];
  orders: CommerceOrder[];
};

const defaultStore: CommerceStore = {
  updatedAt: "2026-05-12T00:00:00.000Z",
  userId: "usr_0001",
  creatorId: "cr_0001",
  shoppingList: {
    id: "list-001",
    title: "Office Refresh",
    status: "draft",
    currency: "IDR",
    items: [
      { id: "item-001", productId: "sku-001", quantity: 1, addedAt: "2026-05-10T00:00:00.000Z" },
      { id: "item-002", productId: "sku-003", quantity: 2, addedAt: "2026-05-11T00:00:00.000Z" },
      { id: "item-003", productId: "sku-004", quantity: 1, addedAt: "2026-05-12T00:00:00.000Z" },
    ],
  },
  affiliateEvents: [],
  orders: [],
};

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

export function getCommerceStorePath() {
  const raw = process.env.COMMERCE_STORE_PATH?.trim();
  const fileName = raw ? path.basename(raw) : "commerce-store.json";
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

export async function readCommerceStore(): Promise<CommerceStore> {
  const filePath = getCommerceStorePath();
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<CommerceStore>;
    if (!parsed || typeof parsed !== "object") return { ...defaultStore };

    const shoppingList = parsed.shoppingList && typeof parsed.shoppingList === "object" ? parsed.shoppingList : defaultStore.shoppingList;
    const affiliateEvents = Array.isArray(parsed.affiliateEvents) ? parsed.affiliateEvents : defaultStore.affiliateEvents;
    const orders = Array.isArray(parsed.orders) ? parsed.orders : defaultStore.orders;

    return {
      ...defaultStore,
      ...parsed,
      shoppingList: { ...defaultStore.shoppingList, ...shoppingList },
      affiliateEvents,
      orders,
    };
  } catch {
    await writeJsonAtomic(filePath, defaultStore);
    return { ...defaultStore };
  }
}

export async function writeCommerceStore(next: CommerceStore) {
  const saved: CommerceStore = { ...next, updatedAt: nowIso() };
  await writeJsonAtomic(getCommerceStorePath(), saved);
  return saved;
}

export function normalizeId(input: unknown) {
  const v = typeof input === "string" ? input.trim() : "";
  if (!v) return null;
  if (v.length > 80) return null;
  return v;
}

export function normalizeQuantity(input: unknown) {
  const raw = typeof input === "number" ? input : typeof input === "string" ? Number(input) : NaN;
  if (!Number.isFinite(raw)) return null;
  const v = Math.round(raw);
  if (v < 1) return 1;
  if (v > 99) return 99;
  return v;
}

export function createShoppingListItem(input: { productId: string; quantity: number }): CommerceShoppingListItem {
  return { id: newId("item"), productId: input.productId, quantity: input.quantity, addedAt: nowIso() };
}

export function createAffiliateEvent(input: {
  productId: string;
  kind: CommerceEventKind;
  source?: CommerceEventSource;
  campaign?: string | null;
  orderId?: string | null;
}): CommerceEvent {
  return {
    id: newId("evt"),
    productId: input.productId,
    kind: input.kind,
    source: input.source ?? "unknown",
    campaign: input.campaign ?? null,
    orderId: input.orderId ?? null,
    createdAt: nowIso(),
  };
}

export function createOrderFromShoppingList(input: {
  userId: string;
  listId: string;
  currency: string;
  items: CommerceShoppingListItem[];
}) {
  const orderItems: CommerceOrderItem[] = input.items.map((item) => {
    const snap = item.productSnapshot ?? null;
    const unitPrice = snap?.price ?? 0;
    const currency = snap?.currency ?? input.currency;
    const quantity = Math.max(1, Math.min(99, Math.round(item.quantity)));
    return {
      id: newId("ord_item"),
      productId: item.productId,
      productSnapshot: snap,
      quantity,
      unitPrice,
      currency,
      lineTotal: unitPrice * quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, it) => sum + it.lineTotal, 0);
  const discount = 0;
  const shipping = subtotal > 0 ? 25000 : 0;
  const total = Math.max(0, subtotal - discount + shipping);
  const createdAt = nowIso();

  const order: CommerceOrder = {
    id: newId("ord"),
    userId: input.userId,
    listId: input.listId,
    status: "paid",
    currency: input.currency,
    items: orderItems,
    subtotal,
    discount,
    shipping,
    total,
    createdAt,
    paidAt: createdAt,
  };

  return order;
}
