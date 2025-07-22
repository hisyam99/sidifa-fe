import { useNavigate } from "@builder.io/qwik-city";
import { useAuth } from "./useAuth";
import { type UserRole } from "~/utils/auth";

/**
 * Hook kustom untuk memeriksa peran pengguna dan melakukan pengalihan jika tidak diizinkan.
 *
 * @param allowedRoles - Array peran yang diizinkan untuk mengakses halaman.
 * @param redirectPath - Path untuk mengalihkan pengguna jika peran tidak diizinkan. Default ke '/'.
 */
export const useCheckRole = (allowedRoles: UserRole[], redirectPath = "/") => {
  const { user, isLoggedIn, loading } = useAuth();
  const nav = useNavigate();

  // Jika masih loading atau belum login, jangan lakukan apa-apa.
  // Layout utama akan menangani pengalihan ke halaman login.
  if (loading.value || !isLoggedIn.value) {
    return;
  }

  // Periksa peran setelah data pengguna tersedia
  if (user.value) {
    const currentUserRole = user.value.role;
    let isAllowed = allowedRoles.includes(currentUserRole);

    // Aturan khusus: Admin bisa mengakses semua halaman
    if (currentUserRole === "admin") {
      isAllowed = true;
    }

    if (!isAllowed) {
      nav(redirectPath);
    }
  }
};

/**
 * Hook kustom versi lain yang spesifik untuk digunakan dalam RequestHandler (server-side).
 * Ini diperlukan karena `useNavigate` tidak tersedia di sisi server.
 *
 * @param event - Objek RequestEvent dari Qwik City.
 * @param allowedRoles - Array peran yang diizinkan.
 * @returns - Mengembalikan peran pengguna jika valid, atau null jika tidak.
 */
// Implemented later if needed for server-side route protection.
