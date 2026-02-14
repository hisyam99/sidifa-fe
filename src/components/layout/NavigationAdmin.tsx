import { component$, $ } from "@builder.io/qwik";
import { useLocation, Link } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
import {
  LuHome,
  LuUser,
  LuSettings,
  LuMenu,
  LuHelpCircle,
  LuBarChart,
  LuKey,
  LuBuilding,
  LuBookOpen,
  LuBriefcase,
  LuChevronDown,
  LuCalendar,
} from "~/components/icons/lucide-optimized";
import { AvatarMenu, MegaMenu } from "../ui";
import { BrandLogo } from "~/components/common";
import { isActivePath } from "~/utils/path";

export const NavigationAdmin = component$(() => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = $(async () => {
    logout();
  });

  const currentPath = location.url.pathname;

  // Detect if we're inside the /admin dashboard area
  const isAdminRoute =
    currentPath.startsWith("/admin") || currentPath.startsWith("/admin/");

  // ─── Menu data ───────────────────────────────────────────────

  // Public / non-admin menu items (shown when NOT on /admin)
  const publicMenuItems = [
    { href: "/", label: "Beranda", icon: LuHome },
    { href: "/faq", label: "FAQ", icon: LuHelpCircle },
    { href: "/jadwal-posyandu", label: "Jadwal Posyandu", icon: LuCalendar },
  ];

  // Admin dashboard submenu items (used in dropdown & mobile)
  const adminSubmenuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LuBarChart,
      description: "Lihat ringkasan dan statistik",
    },
    {
      href: "/admin/verifikasi-akun",
      label: "Verifikasi Akun",
      icon: LuKey,
      description: "Kelola akun pengguna baru",
    },
    {
      href: "/admin/posyandu",
      label: "Manajemen Posyandu",
      icon: LuBuilding,
      description: "Atur data posyandu",
    },
    {
      href: "/admin/informasi",
      label: "Informasi & Edukasi",
      icon: LuBookOpen,
      description: "Kelola konten edukasi",
    },
    {
      href: "/admin/lowongan",
      label: "Lowongan",
      icon: LuBriefcase,
      description: "Atur lowongan kerja",
    },
  ];

  // Quick-access items shown inline in the admin-mode header bar
  const adminQuickLinks = [
    { href: "/", label: "Beranda", icon: LuHome },
    { href: "/faq", label: "FAQ", icon: LuHelpCircle },
    { href: "/jadwal-posyandu", label: "Jadwal Posyandu", icon: LuCalendar },
  ];

  // Avatar menu items
  const avatarMenuItems = [
    { href: "/admin/profile", label: "Profil", icon: LuUser },
    { href: "/admin/settings", label: "Pengaturan", icon: LuSettings },
  ];

  // ─── Admin-mode header (full-width, compact) ─────────────────

  if (isAdminRoute) {
    return (
      <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200/50 sticky top-0 z-50 shadow-sm px-4 md:px-6 lg:px-8">
        <div class="flex items-center w-full gap-2">
          {/* Logo — compact */}
          <BrandLogo variant="nav" size="sm" href="/admin" />

          {/* Separator */}
          <div class="hidden lg:block h-6 w-px bg-base-300/60 mx-1"></div>

          {/* Quick navigation links (public pages) */}
          <div class="hidden lg:flex items-center gap-1">
            {adminQuickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                class={[
                  "btn btn-ghost btn-xs gap-1.5 font-normal text-base-content/60 hover:text-base-content hover:bg-base-200/60 transition-all duration-200",
                  isActivePath(currentPath, item.href, item.href === "/")
                    ? "font-medium text-base-content"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <item.icon class="w-3.5 h-3.5" />
                <span class="text-xs">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Spacer */}
          <div class="flex-1"></div>

          {/* Admin mega-menu dropdown (right-aligned) */}
          <div class="hidden lg:block">
            <MegaMenu delayMs={250} class="dropdown-start">
              <div
                q:slot="trigger"
                class={[
                  "btn btn-ghost btn-sm gap-2 hover:bg-primary/8 transition-all duration-200 mega-menu-trigger",
                  isActivePath(currentPath, "/admin", false)
                    ? "font-semibold text-primary"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <LuBarChart class="w-4 h-4 text-primary" />
                <span class="text-sm">Menu Admin</span>
                <LuChevronDown class="w-3 h-3 text-base-content/50 chevron-rotate" />
              </div>
              <div
                q:slot="content"
                class="bg-base-100 border border-base-200/60 rounded-xl shadow-xl p-1 w-105"
              >
                <div class="p-3">
                  <div class="mb-3">
                    <h3 class="font-semibold text-sm text-primary flex items-center gap-2">
                      <LuBarChart class="w-4 h-4" />
                      Navigasi Admin
                    </h3>
                    <p class="text-xs text-base-content/50 mt-0.5">
                      Akses cepat ke halaman administrasi
                    </p>
                  </div>
                  <div class="grid grid-cols-2 gap-1.5">
                    {adminSubmenuItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        class={[
                          "flex items-start gap-2.5 p-2.5 rounded-lg transition-all duration-150 group",
                          isActivePath(
                            currentPath,
                            subItem.href,
                            subItem.href === "/admin",
                          )
                            ? "bg-primary/10 text-primary ring-1 ring-primary/15"
                            : "text-base-content/70 hover:bg-base-200/60 hover:text-base-content",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <div class="shrink-0 mt-0.5">
                          <subItem.icon class="w-4 h-4 text-primary/80 group-hover:scale-110 transition-transform" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="font-medium text-sm leading-snug truncate">
                            {subItem.label}
                          </div>
                          <div class="text-[11px] text-base-content/45 mt-0.5 leading-relaxed">
                            {subItem.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </MegaMenu>
          </div>

          {/* Avatar */}
          <AvatarMenu
            email={user.value?.email}
            role="Admin"
            menuItems={avatarMenuItems}
            onLogout={handleLogout}
          />

          {/* Mobile hamburger */}
          <div class="dropdown dropdown-end lg:hidden">
            <button
              class="btn btn-ghost btn-sm btn-square"
              tabIndex={0}
              aria-label="Buka menu navigasi"
            >
              <LuMenu class="w-5 h-5 text-base-content" />
            </button>
            <ul class="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow-xl bg-base-100 backdrop-blur-md rounded-xl w-64 border border-base-200/50">
              {/* Public links */}
              {adminQuickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    class={[
                      "flex items-center gap-3 hover:bg-primary/8",
                      isActivePath(currentPath, item.href, item.href === "/")
                        ? "font-semibold text-primary"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <item.icon class="w-4 h-4 text-primary" />
                    <span class="text-sm">{item.label}</span>
                  </Link>
                </li>
              ))}
              {/* Divider */}
              <div class="divider my-1 text-[10px] text-base-content/40 uppercase tracking-wider">
                Admin
              </div>
              {/* Admin submenu */}
              {adminSubmenuItems.map((subItem) => (
                <li key={subItem.href}>
                  <Link
                    href={subItem.href}
                    class={[
                      "flex items-center gap-3 hover:bg-primary/8",
                      isActivePath(
                        currentPath,
                        subItem.href,
                        subItem.href === "/admin",
                      )
                        ? "font-semibold text-primary"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <subItem.icon class="w-4 h-4 text-primary" />
                    <span class="text-sm">{subItem.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  // ─── Normal header (container-based, for public pages) ───────

  return (
    <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200/50 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto flex items-center min-w-0">
        <BrandLogo variant="nav" size="sm" href="/" />
        <div class="ml-auto flex items-center gap-2">
          {/* Desktop menu */}
          <div class="hidden lg:flex items-center gap-2">
            {publicMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                class={[
                  "btn btn-ghost btn-sm gap-2 max-w-xs truncate hover:bg-primary/10 transition-all duration-300",
                  isActivePath(currentPath, item.href, item.href === "/")
                    ? "font-bold text-primary"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <item.icon class="w-4 h-4 text-primary" />
                <span class="truncate">{item.label}</span>
              </Link>
            ))}

            {/* Dashboard Admin dropdown */}
            <MegaMenu delayMs={300} class="dropdown-start">
              <div
                q:slot="trigger"
                class={[
                  "btn btn-ghost btn-sm gap-2 max-w-xs truncate hover:bg-primary/10 transition-all duration-300 mega-menu-trigger",
                  isActivePath(currentPath, "/admin", false)
                    ? "font-bold text-primary"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <LuBarChart class="w-4 h-4 text-primary" />
                <span class="truncate">Dashboard Admin</span>
                <LuChevronDown class="w-3 h-3 text-base-content/60 ml-1 chevron-rotate" />
              </div>
              <div
                q:slot="content"
                class="bg-base-100/90 backdrop-blur-lg border border-base-200/60 rounded-xl shadow-2xl p-1 w-120"
              >
                <div class="p-4">
                  <div class="mb-3">
                    <h3 class="font-semibold text-base text-primary flex items-center gap-2">
                      <LuBarChart class="w-4 h-4" />
                      Menu Admin
                    </h3>
                    <p class="text-xs text-base-content/60 mt-1">
                      Kelola sistem dan data administratif
                    </p>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    {adminSubmenuItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        class={[
                          "flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 group",
                          isActivePath(
                            currentPath,
                            subItem.href,
                            subItem.href === "/admin",
                          )
                            ? "bg-primary/15 text-primary border border-primary/20"
                            : "text-base-content/80 hover:text-primary",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <div class="shrink-0 mt-0.5">
                          <subItem.icon class="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="font-medium text-sm group-hover:text-primary transition-colors truncate">
                            {subItem.label}
                          </div>
                          <div class="text-xs text-base-content/60 mt-0.5 leading-relaxed">
                            {subItem.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </MegaMenu>
          </div>

          {/* Avatar */}
          <AvatarMenu
            email={user.value?.email}
            role="Admin"
            menuItems={avatarMenuItems}
            onLogout={handleLogout}
          />

          {/* Mobile hamburger */}
          <div class="dropdown dropdown-end lg:hidden">
            <button
              class="btn btn-ghost btn-circle"
              tabIndex={0}
              aria-label="Buka menu navigasi"
            >
              <LuMenu class="w-6 h-6 text-base-content" />
            </button>
            <ul class="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow-xl bg-base-100/95 backdrop-blur-md rounded-box w-64 border border-base-200/50">
              {publicMenuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    class={[
                      "flex items-center gap-3 hover:bg-primary/10",
                      isActivePath(currentPath, item.href, item.href === "/")
                        ? "font-bold text-primary"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <item.icon class="w-5 h-5 text-primary" />
                    <span class="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
              {/* Admin submenu in mobile */}
              <li class="menu-title">
                <span class="text-primary font-semibold">Menu Admin</span>
              </li>
              {adminSubmenuItems.map((subItem) => (
                <li key={subItem.href}>
                  <Link
                    href={subItem.href}
                    class={[
                      "flex items-center gap-3 hover:bg-primary/10 pl-6",
                      isActivePath(
                        currentPath,
                        subItem.href,
                        subItem.href === "/admin",
                      )
                        ? "font-bold text-primary"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
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
