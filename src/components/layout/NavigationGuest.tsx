import { component$, useTask$, useSignal } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { sessionUtils } from "~/utils/auth";
import {
  LuMenu,
  LuHome,
  LuLogIn,
  LuStethoscope,
  LuBrain,
  LuHelpCircle,
  LuBarChart,
  LuHeart,
} from "~/components/icons/lucide-optimized";
import { useLocation } from "@builder.io/qwik-city";

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
    const storedAuth = sessionUtils.getAuthStatus();
    const hasUserProfile = !!sessionUtils.getUserProfile();
    isAuthenticated.value = storedAuth === true && hasUserProfile;

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
          {
            href: "/auth/signup/psikolog",
            label: "Daftar Psikolog",
            icon: LuBrain,
          },
        ]
      : []),
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
        {/* MenuItems dan tombol login/dashboard di kanan */}
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
          {/* Tombol login/dashboard */}
          {!isAuthenticated.value ? (
            <a
              href="/auth/login"
              class="btn btn-primary btn-sm gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 auth-dependent"
            >
              <LuLogIn class="w-4 h-4" />
              Masuk
            </a>
          ) : (
            <a
              href={dashboardPath.value}
              class="btn btn-primary btn-sm gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 auth-dependent"
            >
              <LuBarChart class="w-4 h-4" />
              Dashboard
            </a>
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
              {!isAuthenticated.value ? (
                <li>
                  <a
                    href="/auth/login"
                    class="flex items-center gap-3 hover:bg-primary/10 transition-all duration-200 auth-dependent"
                  >
                    <LuLogIn class="w-5 h-5 text-primary" />
                    <span class="font-medium">Masuk</span>
                  </a>
                </li>
              ) : (
                <li>
                  <a
                    href={dashboardPath.value}
                    class="flex items-center gap-3 hover:bg-primary/10 transition-all duration-200 auth-dependent"
                  >
                    <LuBarChart class="w-5 h-5 text-primary" />
                    <span class="font-medium">Dashboard</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
});
