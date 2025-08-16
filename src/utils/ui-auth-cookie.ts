export function setUiAuthCookies(params: {
  userId: string;
  email?: string | null;
  role: string;
  maxAgeSeconds?: number; // default 7 days
}): void {
  if (typeof document === "undefined") return;
  const { userId, email, role, maxAgeSeconds = 7 * 24 * 60 * 60 } = params;
  const common = `; path=/; max-age=${maxAgeSeconds}; samesite=Lax`;
  document.cookie = `is_logged_in=true${common}`;
  document.cookie = `user_role=${encodeURIComponent(role)}${common}`;
  document.cookie = `user_id=${encodeURIComponent(userId)}${common}`;
  if (email) {
    document.cookie = `user_email=${encodeURIComponent(email)}${common}`;
  }
}

export function clearUiAuthCookies(): void {
  if (typeof document === "undefined") return;
  const past = "; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `is_logged_in=false${past}`;
  document.cookie = `user_role=${past}`;
  document.cookie = `user_id=${past}`;
  document.cookie = `user_email=${past}`;
}
