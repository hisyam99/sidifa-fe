import { component$, $ } from "@qwik.dev/core";
import { useNavigate, useLocation } from "@qwik.dev/router";
import { useAuth } from "~/hooks";
import {
  LuHome,
  LuFileText,
  LuSettings,
  LuUser,
  LuBarChart,
  LuMenu,
} from "~/components/icons/lucide-optimized";
import { AvatarMenu } from "../ui";

export const NavigationPsikolog = component$(() => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const handleLogout = $(async () => {
    await logout();
    nav("/auth/login");
  });

  const menuItems = [
    { href: "/psikolog/", label: "Dashboard", icon: LuHome },
    {
      href: "/psikolog/laporan-asesmen/",
      label: "Laporan Asesmen",
      icon: LuFileText,
    },
  ];

  return (
    <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200/50 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-4 flex items-center min-w-0">
        {/* Logo dan menu biasa di kiri */}
        <a
          href="/psikolog/"
          class="btn btn-ghost text-xl hover:bg-primary/10 transition-all duration-300 flex-shrink-0"
        >
          <div class="bg-gradient-primary rounded-full w-12 h-12 mr-3 flex items-center justify-center shadow-lg">
            <LuBarChart class="w-6 h-6" />
          </div>
          <div class="flex flex-col items-start">
            <span class="font-bold text-gradient-primary">
              Si-DIFA Psikolog
            </span>
            <span class="text-xs text-base-content/60 font-medium">
              Sistem Informasi Difabel
            </span>
          </div>
        </a>
        {/* Tombol menuItems dan avatar/login di kanan */}
        <div class="ml-auto flex items-center gap-2">
          {/* MenuItems utama desktop */}
          <div class="hidden lg:flex items-center gap-2">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                class={`btn btn-ghost btn-sm gap-2 max-w-xs truncate hover:bg-primary/10 transition-all duration-300${
                  location.url.pathname === item.href
                    ? " font-bold text-primary"
                    : ""
                }`}
              >
                <item.icon class="w-4 h-4 text-primary" />
                <span class="truncate">{item.label}</span>
              </a>
            ))}
          </div>
          {/* Avatar/login */}
          <AvatarMenu
            email={user.value?.email}
            role="Psikolog"
            menuItems={[
              { href: "/psikolog/profile", label: "Profil", icon: LuUser },
              {
                href: "/psikolog/settings",
                label: "Pengaturan",
                icon: LuSettings,
              },
            ]}
            onLogout={handleLogout}
          />
          {/* Hamburger mobile menu - setelah avatar */}
          <div class="dropdown dropdown-end lg:hidden">
            <button
              class="btn btn-ghost btn-circle"
              tabIndex={0}
              aria-label="Buka menu navigasi"
            >
              <LuMenu class="w-6 h-6 text-base-content" />
            </button>
            <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100/95 backdrop-blur-md rounded-box w-64 border border-base-200/50">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    class={`flex items-center gap-3 hover:bg-primary/10${
                      location.url.pathname === item.href
                        ? " font-bold text-primary"
                        : ""
                    }`}
                  >
                    <item.icon class="w-5 h-5 text-primary" />
                    <span class="font-medium">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
});
