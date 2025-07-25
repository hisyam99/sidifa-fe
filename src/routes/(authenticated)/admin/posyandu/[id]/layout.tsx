import { component$, Slot, useTask$, useSignal } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { useCheckRole } from "~/hooks/useCheckRole";
import { sessionUtils } from "~/utils/auth";
import {
  LuBarChart,
  LuClipboardList,
  LuLineChart,
  LuArrowLeft,
  LuUsers,
  LuSettings,
} from "~/components/icons/lucide-optimized"; // Changed import source
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const { isLoggedIn } = useAuth();
  const isClient = useSignal(false);
  const isAuthenticated = useSignal(false);
  const location = useLocation();

  useCheckRole(["admin"]);

  // Client-side hydration dan update auth state
  useTask$(({ track }) => {
    track(isLoggedIn); // Re-run when isLoggedIn changes

    isClient.value = true;
    const storedAuth = sessionUtils.getAuthStatus();
    const hasUserProfile = !!sessionUtils.getUserProfile();
    isAuthenticated.value = storedAuth === true && hasUserProfile;
  });

  // Show skeleton loading hanya saat SSR atau initial load
  if (!isClient.value) {
    return (
      <div class="flex justify-center items-center min-h-screen">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Let the auth hook handle redirects setelah client hydration
  if (!isAuthenticated.value) {
    return null; // The auth hook will redirect
  }

  // Extract posyanduId from the URL
  const pathParts = location.url.pathname.split("/");
  const posyanduId = pathParts[pathParts.indexOf("posyandu") + 1];
  const base = `/admin/posyandu/${posyanduId}`;

  const menuItems = [
    { href: base, label: "Dashboard", icon: LuBarChart },
    {
      href: `${base}/laporan-statistik`,
      label: "Laporan Statistik",
      icon: LuLineChart,
    },
    {
      href: `${base}/pendataan-ibk`,
      label: "Pendataan IBK",
      icon: LuClipboardList,
    },
    {
      href: `${base}/manajemen-kader`,
      label: "Manajemen Kader",
      icon: LuUsers,
    },
    {
      href: `${base}/pengaturan`,
      label: "Pengaturan",
      icon: LuSettings,
    },
  ];

  return (
    <div class="min-h-screen bg-base-200/60">
      <div class="drawer lg:drawer-open">
        <input
          id="drawer-posyandu-detail"
          type="checkbox"
          class="drawer-toggle"
        />
        <div class="drawer-content flex flex-col p-4 md:p-8">
          <label
            for="drawer-posyandu-detail"
            class="btn btn-primary drawer-button lg:hidden mb-4 self-start"
          >
            <LuBarChart />
            Buka Menu
          </label>
          <main class="bg-base-100 p-6 rounded-2xl shadow-lg">
            <Slot />
          </main>
        </div>
        <aside class="drawer-side">
          <label
            for="drawer-posyandu-detail"
            aria-label="close sidebar"
            class="drawer-overlay"
          ></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-100 lg:bg-transparent text-base-content">
            <li class="text-xl font-bold p-4 hidden lg:block">
              Detail Posyandu (Admin)
            </li>
            {menuItems.map((item) => (
              <li
                key={item.href}
                class={location.url.pathname === item.href ? "bordered" : ""}
              >
                <a href={item.href}>
                  <item.icon />
                  {item.label}
                </a>
              </li>
            ))}
            <li class="mt-8">
              <a
                href="/admin/manajemen-posyandu"
                class="btn btn-outline btn-primary w-full flex items-center gap-2"
              >
                <LuArrowLeft />
                Kembali ke List Posyandu
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
});
