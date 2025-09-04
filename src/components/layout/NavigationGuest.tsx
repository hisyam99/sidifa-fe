import { component$, useTask$, useSignal } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import {
  LuMenu,
  LuHome,
  LuLogIn,
  LuStethoscope,
  // LuBrain,
  LuHelpCircle,
  LuBarChart,
} from "~/components/icons/lucide-optimized";
import { Link, useLocation } from "@builder.io/qwik-city";
import { BrandLogo } from "~/components/common";
import { isActivePath } from "~/utils/path";

export const NavigationGuest = component$(() => {
  const { isLoggedIn, user } = useAuth();
  const isClient = useSignal(false);
  const isAuthenticated = useSignal(false);
  const dashboardPath = useSignal("/dashboard");
  const location = useLocation();

  // Client-side hydration dan update auth state
  useTask$(({ track }) => {
    track(isLoggedIn);
    track(() => user.value?.role);

    isClient.value = true;
    // Ambil status auth langsung dari hasil fetch /auth/me melalui useAuth
    isAuthenticated.value = Boolean(isLoggedIn.value && user.value?.role);

    // Set dashboard path based on user role
    const role = user.value?.role;
    if (isAuthenticated.value && role) {
      if (role === "kader" || role === "posyandu") {
        dashboardPath.value = "/kader";
      } else if (role === "psikolog") {
        dashboardPath.value = "/psikolog";
      } else if (role === "admin") {
        dashboardPath.value = "/admin";
      } else {
        dashboardPath.value = "/dashboard";
      }
    } else {
      dashboardPath.value = "/dashboard";
    }
  });

  // Build menuItems for desktop and mobile
  const menuItems = [
    { href: "/", label: "Beranda", icon: LuHome },
    { href: "/faq", label: "FAQ", icon: LuHelpCircle },
    ...(!isAuthenticated.value
      ? [
          {
            href: "/auth/signup/kader",
            label: "Daftar Kader",
            icon: LuStethoscope,
          },
          /* {
            href: "/auth/signup/psikolog",
            label: "Daftar Psikolog",
            icon: LuBrain,
          }, */
        ]
      : []),
  ];

  const currentPath = location.url.pathname;

  return (
    <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200/50 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto flex items-center min-w-0">
        {/* Logo kiri dengan teks kecil di mobile */}
        <BrandLogo variant="nav" size="sm" />

        {/* MenuItems dan tombol login/dashboard di kanan */}
        <div class="ml-auto flex items-center gap-1 sm:gap-2 shrink-0">
          {/* MenuItems utama desktop */}
          <div class="hidden lg:flex items-center gap-2">
            {menuItems.map((item) => (
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
            ))}
          </div>
          {/* Tombol login/dashboard */}
          {!isAuthenticated.value ? (
            <Link
              href="/auth/login"
              class="btn btn-primary btn-sm gap-2 whitespace-nowrap shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 auth-dependent"
            >
              <LuLogIn class="w-4 h-4" />
              <span class="max-[360px]:hidden">Masuk</span>
            </Link>
          ) : (
            <Link
              href={dashboardPath.value}
              class="btn btn-primary btn-sm gap-2 whitespace-nowrap shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 auth-dependent"
            >
              <LuBarChart class="w-4 h-4" />
              <span class="max-[360px]:hidden">Dashboard</span>
            </Link>
          )}
          {/* Hamburger mobile menu */}
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
              {!isAuthenticated.value ? (
                <li>
                  <Link
                    href="/auth/login"
                    class="flex items-center gap-3 hover:bg-primary/10 transition-all duration-200 auth-dependent"
                  >
                    <LuLogIn class="w-5 h-5 text-primary" />
                    <span class="font-medium">Masuk</span>
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    href={dashboardPath.value}
                    class="flex items-center gap-3 hover:bg-primary/10 transition-all duration-200 auth-dependent"
                  >
                    <LuBarChart class="w-5 h-5 text-primary" />
                    <span class="font-medium">Dashboard</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
});
