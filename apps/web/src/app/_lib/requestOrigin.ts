import { headers } from "next/headers";

export async function getRequestOrigin() {
  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}
