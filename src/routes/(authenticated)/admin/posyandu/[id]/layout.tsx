import { component$, Slot, useTask$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
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
  LuMenu,
} from "~/components/icons/lucide-optimized";
import { useLocation } from "@builder.io/qwik-city";
import { Sidebar } from "~/components/common/Sidebar";

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
      href: `${base}/ibk`,
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
    <div class="min-h-screen bg-base-200/50">
      <div class="drawer lg:drawer-open">
        <input
          id="drawer-posyandu-detail"
          type="checkbox"
          class="drawer-toggle"
        />

        {/* Main content area — full width, no container constraint */}
        <div class="drawer-content flex flex-col min-h-[calc(100vh-4rem)]">
          <div class="flex-1 p-4 md:p-6 lg:p-8">
            {/* Mobile sidebar toggle */}
            <label
              for="drawer-posyandu-detail"
              class="btn btn-ghost btn-sm gap-2 drawer-button lg:hidden mb-4 -ml-1"
            >
              <LuMenu class="w-5 h-5" />
              <span class="text-sm font-medium">Menu</span>
            </label>

            <main class="transition-all duration-200">
              <Slot />
            </main>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar
          title="Detail Posyandu"
          menuItems={menuItems}
          drawerId="drawer-posyandu-detail"
          ptClass="pt-16"
        >
          <li class="mt-6 px-1">
            <Link
              href="/admin/posyandu"
              class="btn btn-outline btn-primary btn-sm w-full flex items-center gap-2"
            >
              <LuArrowLeft class="w-4 h-4" />
              Kembali ke List Posyandu
            </Link>
          </li>
        </Sidebar>
      </div>
    </div>
  );
});
