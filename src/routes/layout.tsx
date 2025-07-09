import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Navigation, SidifaFooter } from "~/components/layout";

// Simple JWT decode (tanpa verifikasi signature)
function decodeJwt(token: string): any {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Loader SSR untuk autentikasi global
export const useAuthLoader = routeLoader$(({ cookie }) => {
  const token = cookie.get("access_token");
  let user = null;
  if (typeof token === "string" && token) {
    const payload = decodeJwt(token);
    if (payload && payload.name) {
      user = {
        name: payload.name,
        role: payload.role,
        email: payload.email,
        id: payload.id,
        no_telp: payload.no_telp,
        nama_posyandu: payload.nama_posyandu,
        lokasi: payload.lokasi,
        spesialis: payload.spesialis,
      };
    }
  }
  return { isLoggedIn: !!token, user };
});

export default component$(() => {
  // Loader ini akan diakses oleh komponen lain (Navbar, dsb)
  return (
    <>
      <Navigation />
      <Slot />
      <SidifaFooter />
    </>
  );
});
