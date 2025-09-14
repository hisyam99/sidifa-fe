// File: /src/utils/ui-auth-cookie.ts
import type { Cookie } from "@qwik.dev/router";

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

// Helper function to decode obfuscated value back to role
function decodeRole(encoded: string): string | null {
  switch (encoded) {
    case "0":
      return "admin";
    case "1":
      return "kader"; // Note: could be posyandu too, need additional context
    case "2":
      return "psikolog";
    default:
      return null;
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

// New function to read auth cookies on server-side
export function getUiAuthFromCookie(cookie: Cookie): {
  isAuthenticated: boolean;
  role: string | null;
} {
  const authStatus = cookie.get("auth_status")?.value;
  const encodedRole = cookie.get("r")?.value;

  const isAuthenticated = authStatus === "true";
  const role = encodedRole ? decodeRole(encodedRole) : null;

  // For kader/posyandu disambiguation, you might need to check sessionUtils
  // or make an additional API call, but for redirect purposes,
  // we can redirect to a common dashboard or check user profile

  return {
    isAuthenticated,
    role,
  };
}

// Client-side function to read auth cookies
export function getUiAuthFromDocument(): {
  isAuthenticated: boolean;
  role: string | null;
} {
  if (typeof document === "undefined") {
    return { isAuthenticated: false, role: null };
  }

  const cookies = document.cookie.split("; ");
  const authStatusCookie = cookies.find((c) => c.startsWith("auth_status="));
  const roleCookie = cookies.find((c) => c.startsWith("r="));

  const authStatus = authStatusCookie?.split("=")[1];
  const encodedRole = roleCookie?.split("=")[1];

  const isAuthenticated = authStatus === "true";
  const role = encodedRole ? decodeRole(encodedRole) : null;

  return {
    isAuthenticated,
    role,
  };
}
