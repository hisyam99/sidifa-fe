import type { RequestHandler } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = async (ev) => {
  const apiBase = ev.env.get?.("API_URL");

  if (!apiBase) {
    throw ev.json(500, {
      message: "API_URL is not configured for /api proxy.",
    });
  }

  const upstreamUrl = `${apiBase}/${ev.params.path}${ev.url.search}`;

  // Build headers: forward cookies and content headers, avoid host/encoding
  const incoming = ev.request.headers;
  const headers = new Headers();
  const forwardHeaderKeys = [
    "cookie",
    "content-type",
    "authorization",
    "x-csrf-token",
    "accept",
  ];
  for (const key of forwardHeaderKeys) {
    const val = incoming.get(key);
    if (val) headers.set(key, val);
  }
  // Force identity encoding upstream to avoid double-decode issues
  headers.set("accept-encoding", "identity");

  const method = ev.request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await ev.request.arrayBuffer() : undefined;

  const res = await fetch(upstreamUrl, {
    method,
    headers,
    body,
    credentials: "include",
  });

  // Prepare sanitized headers for downstream
  const outHeaders = new Headers();
  // Preserve multi Set-Cookie if available (undici)
  const anyHeaders = res.headers as unknown as {
    getSetCookie?: () => string[];
  };
  if (typeof anyHeaders.getSetCookie === "function") {
    for (const sc of anyHeaders.getSetCookie()) {
      outHeaders.append("set-cookie", sc);
    }
  }
  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      if (!anyHeaders.getSetCookie) outHeaders.append("set-cookie", value);
      return;
    }
    if (key.toLowerCase() === "content-encoding") return;
    if (key.toLowerCase() === "content-length") return;
    outHeaders.set(key, value);
  });

  const buf = await res.arrayBuffer();
  const relay = new Response(buf, { status: res.status, headers: outHeaders });
  throw ev.send(relay);
};
