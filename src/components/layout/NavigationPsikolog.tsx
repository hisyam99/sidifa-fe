import { component$, $ } from "@builder.io/qwik";
import { useLocation, Link } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
import {
  LuHome,
  LuFileText,
  LuSettings,
  LuUser,
  LuMenu,
} from "~/components/icons/lucide-optimized";
import { AvatarMenu } from "../ui";
import { BrandLogo } from "~/components/common";
import { isActivePath } from "~/utils/path";

export const NavigationPsikolog = component$(() => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const handleLogout = $(async () => {
    logout();
    // No need to await or manually navigate since logout() handles redirect internally
  });

  const menuItems = [
    { href: "/psikolog/", label: "Dashboard", icon: LuHome },
    {
      href: "/psikolog/laporan-asesmen/",
      label: "Laporan Asesmen",
      icon: LuFileText,
    },
  ];

  const currentPath = location.url.pathname;

  return (
    <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200/50 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto flex items-center min-w-0">
        <BrandLogo variant="nav" size="sm" href="/" />
        <div class="ml-auto flex items-center gap-2">
          <div class="hidden lg:flex items-center gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                class={`btn btn-ghost btn-sm gap-2 max-w-xs truncate hover:bg-primary/10 transition-all duration-300${
                  isActivePath(currentPath, item.href)
                    ? " font-bold text-primary"
                    : ""
                }`}
              >
                <item.icon class="w-4 h-4 text-primary" />
                <span class="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
          <AvatarMenu
            email={user.value?.email}
            role={user.value?.role}
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
                  <Link
                    href={item.href}
                    class={`flex items-center gap-3 hover:bg-primary/10${
                      isActivePath(currentPath, item.href)
                        ? " font-bold text-primary"
                        : ""
                    }`}
                  >
                    <item.icon class="w-5 h-5 text-primary" />
                    <span class="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
});
