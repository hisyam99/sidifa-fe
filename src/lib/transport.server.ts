import type { RequestEvent } from "@builder.io/qwik-city";

export async function serverFetch<T>(
  ev: RequestEvent,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const apiBase = (ev.env.get?.("API_URL"))

  if (!apiBase) {
    throw new Error(
      "API_URL is not configured on the server (transport.server).",
    );
  }

  const cookie = ev.request.headers.get("cookie") ?? "";
  const headers = new Headers(init.headers);
  if (cookie && !headers.has("cookie")) headers.set("cookie", cookie);

  const res = await fetch(`${apiBase}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${text || res.statusText}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  const buf = await res.arrayBuffer();
  return (buf as unknown) as T;
} 