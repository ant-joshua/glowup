import { headers } from "next/headers";

export async function getRequestOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (!host) return "http://localhost:3000";

  return `${proto}://${host}`;
}

export async function fetchMockJson<T>(path: string, init?: RequestInit) {
  const origin = await getRequestOrigin();
  const url = new URL(path, origin);
  const res = await fetch(url, { cache: "no-store", ...init });

  if (!res.ok) {
    throw new Error(`Mock API error ${res.status} for ${path}`);
  }

  return (await res.json()) as T;
}
