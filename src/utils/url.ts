export const publicUploadsUrl =
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: Record<string, string | undefined> }).env
      ?.PUBLIC_UPLOADS_URL) ||
  "__PUBLIC_UPLOADS_URL__";

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

// Tambahan helper khusus subfolder
function buildTypedUploadUrl(
  nameOrPath: string | undefined,
  subfolder: string,
): string | undefined {
  if (!nameOrPath) return undefined;
  const raw = String(nameOrPath).trim();
  if (isAbsoluteUrl(raw)) return raw;
  let cleaned = raw.replace(/^https?:\/\/[^/]+/i, "");
  cleaned = cleaned.replace(/^\/?uploads\/?/i, "");
  cleaned = cleaned.replace(/^\//, "");
  if (cleaned.toLowerCase().startsWith(`${subfolder.toLowerCase()}/`)) {
    return `${publicUploadsUrl}/${cleaned}`;
  }
  return `${publicUploadsUrl}/${subfolder}/${cleaned}`;
}

export function buildJadwalPosyanduUrl(
  nameOrPath?: string,
): string | undefined {
  return buildTypedUploadUrl(nameOrPath, "jadwal-posyandu");
}

export function buildLowonganUploadUrl(
  nameOrPath?: string,
): string | undefined {
  return buildTypedUploadUrl(nameOrPath, "lowongan");
}

export function buildInformasiEdukasiUrl(
  nameOrPath?: string,
): string | undefined {
  return buildTypedUploadUrl(nameOrPath, "informasi-edukasi");
}
