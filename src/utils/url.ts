export const publicUploadsUrl =
  (import.meta as any).env?.PUBLIC_UPLOADS_URL || "__PUBLIC_UPLOADS_URL__";

function isAbsoluteUrl(url: string): boolean {
  return /^(https?:)?\/\//i.test(url) || url.startsWith("data:");
}

export function buildUploadUrl(nameOrPath?: string): string | undefined {
  if (!nameOrPath) return undefined;
  const raw = String(nameOrPath).trim();
  if (isAbsoluteUrl(raw)) return raw;
  // Normalize: remove any leading domain and leading uploads/
  let cleaned = raw.replace(/^https?:\/\/[^/]+/i, "");
  cleaned = cleaned.replace(/^\/?uploads\/?/i, "");
  cleaned = cleaned.replace(/^\//, "");
  return `${publicUploadsUrl}/${cleaned}`;
}
