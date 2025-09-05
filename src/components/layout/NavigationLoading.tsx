import { component$, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { Link, useLocation } from "@builder.io/qwik-city";
import { BrandLogo } from "~/components/common";
import { AvatarMenu } from "../ui";
import { isActivePath } from "~/utils/path";
import {
  LuMenu,
  LuHome,
  LuHelpCircle,
  LuBarChart,
  LuUser,
  LuSettings,
  LuChevronDown,
} from "~/components/icons/lucide-optimized";
import { useAuthFromCookie } from "~/routes/layout";

export const NavigationLoading = component$(() => {
  const { logout } = useAuth();
  const location = useLocation();
  const ssrAuth = useAuthFromCookie();

  const handleLogout = $(async () => {
    await logout();
  });

  // Compute role-specific dashboard item from SSR cookie role
  const role = ssrAuth.value.role;
  const dashboardItem = (() => {
    switch (role) {
      case "admin":
        return {
          href: "/admin",
          label: "Dashboard Admin",
          icon: LuBarChart,
          hasDropdown: true,
        };
      case "kader":
      case "posyandu":
        return {
          href: "/kader",
          label: "Dashboard Kader",
          icon: LuBarChart,
          hasDropdown: true,
        };
      case "psikolog":
        return {
          href: "/psikolog",
          label: "Dashboard Psikolog",
          icon: LuBarChart,
          hasDropdown: true,
        };
      default:
        return {
          href: "/dashboard",
          label: "Dashboard",
          icon: LuBarChart,
          hasDropdown: true,
        };
    }
  })();

  const menuItems = [
    { href: "/", label: "Beranda", icon: LuHome },
    { href: "/faq", label: "FAQ", icon: LuHelpCircle },
    dashboardItem,
  ];

  const currentPath = location.url.pathname;

  return (
    <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200/50 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto flex items-center min-w-0">
        <BrandLogo variant="nav" size="sm" href="/" />
        <div class="ml-auto flex items-center gap-2">
          {/* Desktop menu same layout */}
          <div class="hidden lg:flex items-center gap-2">
            {menuItems.map((item) => {
              if ((item as any).hasDropdown) {
                return (
                  <div
                    key={item.href}
                    class={`btn btn-ghost btn-sm gap-2 max-w-xs truncate hover:bg-primary/10 transition-all duration-300 mega-menu-trigger${
                      isActivePath(currentPath, item.href, item.href === "/")
                        ? " font-bold text-primary"
                        : ""
                    }`}
                  >
                    <item.icon class="w-4 h-4 text-primary" />
                    <span class="truncate">{item.label}</span>
                    <LuChevronDown class="w-3 h-3 text-base-content/60 ml-1 chevron-rotate" />
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  class={`btn btn-ghost btn-sm gap-2 max-w-xs truncate hover:bg-primary/10 transition-all duration-300${
                    isActivePath(currentPath, item.href, item.href === "/")
                      ? " font-bold text-primary"
                      : ""
                  }`}
                >
                  <item.icon class="w-4 h-4 text-primary" />
                  <span class="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
          {/* Avatar with built-in loading skeleton */}
          <AvatarMenu
            email={undefined}
            role={undefined}
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
          {/* Mobile hamburger menu */}
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
                      isActivePath(currentPath, item.href, item.href === "/")
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
