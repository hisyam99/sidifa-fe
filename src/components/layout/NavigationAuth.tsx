import { component$, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import {
  LuMenu,
  LuHome,
  LuUser,
  LuSettings,
  LuHelpCircle,
  LuBarChart,
  LuHeart,
  LuBrain,
} from "~/components/icons/lucide-optimized";
import { useNavigate, useLocation } from "@builder.io/qwik-city";
import { AvatarMenu } from "../ui";

export const NavigationAuth = component$(() => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const handleLogout = $(async () => {
    await logout();
    nav("/auth/login");
  });

  // Build menuItems for desktop and mobile
  const menuItems = [
    { href: "/", label: "Beranda", icon: LuHome },
    { href: "/faq", label: "FAQ", icon: LuHelpCircle },
    { href: "/dashboard", label: "Dashboard", icon: LuBarChart },
    { href: "/dashboard/profile", label: "Profil", icon: LuUser },
    ...(user.value?.role === "admin"
      ? [{ href: "/admin", label: "Dashboard Admin", icon: LuBarChart }]
      : []),
    ...(user.value?.role === "kader"
      ? [{ href: "/kader", label: "Dashboard Kader", icon: LuHeart }]
      : []),
    ...(user.value?.role === "psikolog"
      ? [{ href: "/psikolog", label: "Dashboard Psikolog", icon: LuBrain }]
      : []),
    { href: "/dashboard/settings", label: "Pengaturan", icon: LuSettings },
  ];

  return (
    <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200/50 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-4 flex items-center min-w-0">
        {/* Logo di kiri */}
        <a
          href="/"
          class="btn btn-ghost text-xl hover:bg-primary/10 transition-all duration-300 flex-shrink-0"
        >
          <div class="bg-gradient-primary rounded-full w-12 h-12 mr-3 flex items-center justify-center shadow-lg">
            <LuHeart class="w-6 h-6" />
          </div>
          <div class="flex flex-col items-start">
            <span class="font-bold text-gradient-primary">SIDIFA</span>
            <span class="text-xs text-base-content/60 font-medium">
              Sistem Informasi Difabel
            </span>
          </div>
        </a>
        {/* Kanan: menuItems desktop, avatar, hamburger mobile */}
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
            role={user.value?.role}
            menuItems={[
              { href: "/dashboard/profile", label: "Profil", icon: LuUser },
              {
                href: "/dashboard/settings",
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
