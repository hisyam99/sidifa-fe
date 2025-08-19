import { component$, $ } from "@builder.io/qwik";
import { useLocation, Link } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
import {
  LuHome,
  LuHelpCircle,
  LuBarChart,
  LuSettings,
  LuUser,
  LuMenu,
  LuClipboardList,
  LuBriefcase,
  LuBookOpen,
  LuChevronDown,
} from "~/components/icons/lucide-optimized";
import { AvatarMenu, MegaMenu } from "../ui";
import { BrandLogo } from "~/components/common";
import { isActivePath } from "~/utils/path";

export const NavigationKader = component$(() => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = $(async () => {
    await logout();
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  });

  const menuItems = [
    { href: "/", label: "Beranda", icon: LuHome },
    { href: "/faq", label: "FAQ", icon: LuHelpCircle },
    {
      href: "/kader",
      label: "Dashboard Kader",
      icon: LuBarChart,
      hasDropdown: true,
    },
  ];

  // Kader dashboard submenu items
  const kaderSubmenuItems = [
    { href: "/kader", label: "Dashboard Kader", icon: LuBarChart },
    { href: "/kader/posyandu", label: "List Posyandu", icon: LuClipboardList },
    { href: "/kader/lowongan", label: "Lowongan", icon: LuBriefcase },
    { href: "/kader/informasi", label: "Informasi", icon: LuBookOpen },
    { href: "/kader/profile", label: "Profil Saya", icon: LuUser },
  ];

  const currentPath = location.url.pathname;

  return (
    <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200/50 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto flex items-center min-w-0">
        <BrandLogo variant="nav" size="sm" href="/" />
        <div class="ml-auto flex items-center gap-2">
          <div class="hidden lg:flex items-center gap-2">
            {menuItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <MegaMenu
                    key={item.href}
                    delayMs={300}
                    class="dropdown-start"
                  >
                    <div
                      q:slot="trigger"
                      tabIndex={0}
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
                    <div
                      q:slot="content"
                      class="bg-base-100/90 backdrop-blur-lg border border-base-200/60 rounded-xl shadow-2xl p-1 w-[480px]"
                    >
                      <div class="p-4">
                        <div class="mb-3">
                          <h3 class="font-semibold text-base text-primary flex items-center gap-2">
                            <LuBarChart class="w-4 h-4" />
                            Menu Kader
                          </h3>
                          <p class="text-xs text-base-content/60 mt-1">
                            Kelola tugas dan aktivitas kader posyandu
                          </p>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                          {kaderSubmenuItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              class={`flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 group${
                                isActivePath(
                                  currentPath,
                                  subItem.href,
                                  subItem.href === "/kader",
                                )
                                  ? " bg-primary/15 text-primary border border-primary/20"
                                  : " text-base-content/80 hover:text-primary"
                              }`}
                            >
                              <div class="flex-shrink-0 mt-0.5">
                                <subItem.icon class="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                              </div>
                              <div class="flex-1 min-w-0">
                                <div class="font-medium text-sm group-hover:text-primary transition-colors truncate">
                                  {subItem.label}
                                </div>
                                <div class="text-xs text-base-content/60 mt-0.5 leading-relaxed">
                                  {subItem.href === "/kader" &&
                                    "Lihat ringkasan kegiatan"}
                                  {subItem.href === "/kader/posyandu" &&
                                    "Daftar posyandu terdaftar"}
                                  {subItem.href === "/kader/lowongan" &&
                                    "Cari peluang kerja"}
                                  {subItem.href === "/kader/informasi" &&
                                    "Baca artikel edukasi"}
                                  {subItem.href === "/kader/profile" &&
                                    "Kelola profil pribadi"}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </MegaMenu>
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
          <AvatarMenu
            email={user.value?.email}
            role={user.value?.role}
            menuItems={[
              { href: "/kader/profile", label: "Profil", icon: LuUser },
              {
                href: "/kader/settings",
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
              {/* Kader submenu in mobile */}
              <li class="menu-title">
                <span class="text-primary font-semibold">Menu Kader</span>
              </li>
              {kaderSubmenuItems.map((subItem) => (
                <li key={subItem.href}>
                  <Link
                    href={subItem.href}
                    class={`flex items-center gap-3 hover:bg-primary/10 pl-6${
                      isActivePath(
                        currentPath,
                        subItem.href,
                        subItem.href === "/kader",
                      )
                        ? " font-bold text-primary"
                        : ""
                    }`}
                  >
                    <subItem.icon class="w-4 h-4 text-primary" />
                    <span class="font-medium">{subItem.label}</span>
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
