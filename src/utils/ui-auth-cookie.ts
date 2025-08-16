// Helper function to encode role to obfuscated value
function encodeRole(role: string): string {
  switch (role) {
    case "admin":
      return "0";
    case "kader":
    case "posyandu":
      return "1";
    case "psikolog":
      return "2";
    default:
      return "0"; // fallback to admin
  }
}

export function setUiAuthCookies(params: {
  role: string;
  maxAgeSeconds?: number; // default 7 days
}): void {
  if (typeof document === "undefined") return;
  const { role, maxAgeSeconds = 7 * 24 * 60 * 60 } = params;
  const common = `; path=/; max-age=${maxAgeSeconds}; samesite=Lax`;
  document.cookie = `auth_status=true${common}`;
  document.cookie = `r=${encodeRole(role)}${common}`;
}

export function clearUiAuthCookies(): void {
  if (typeof document === "undefined") return;
  const past = "; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `auth_status=false${past}`;
  document.cookie = `r=${past}`;
}
