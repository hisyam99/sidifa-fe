import { component$, useTask$, useSignal } from "@qwik.dev/core";
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

export const NavigationGuest = component$(() => {
  const { isLoggedIn, user } = useAuth();
  const isClient = useSignal(false);
  const isAuthenticated = useSignal(false);
  const dashboardPath = useSignal("/dashboard");

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

  return (
    <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200/50 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <div class="navbar-start">
          <div class="dropdown">
            <button
              class="btn btn-ghost btn-circle lg:hidden focus-ring"
              aria-label="Buka menu navigasi"
            >
              <LuMenu class="w-6 h-6 text-base-content" />
            </button>
            <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100/95 backdrop-blur-md rounded-box w-64 border border-base-200/50">
              <li>
                <a href="/" class="flex items-center gap-3 hover:bg-primary/10">
                  <LuHome class="w-5 h-5 text-primary" />
                  <span class="font-medium">Beranda</span>
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  class="flex items-center gap-3 hover:bg-primary/10"
                >
                  <LuHelpCircle class="w-5 h-5 text-primary" />
                  <span class="font-medium">FAQ</span>
                </a>
              </li>
              {!isAuthenticated.value ? (
                <>
                  <li>
                    <a
                      href="/auth/login"
                      class="flex items-center gap-3 hover:bg-primary/10 transition-all duration-200 auth-dependent"
                    >
                      <LuLogIn class="w-5 h-5 text-primary" />
                      <span class="font-medium">Masuk</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/auth/signup/kader"
                      class="flex items-center gap-3 hover:bg-primary/10 transition-all duration-200 auth-dependent"
                    >
                      <LuStethoscope class="w-5 h-5 text-primary" />
                      <span class="font-medium">Daftar Posyandu</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/auth/signup/psikolog"
                      class="flex items-center gap-3 hover:bg-primary/10 transition-all duration-200 auth-dependent"
                    >
                      <LuBrain class="w-5 h-5 text-primary" />
                      <span class="font-medium">Daftar Psikolog</span>
                    </a>
                  </li>
                </>
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
          <a
            href="/"
            class="btn btn-ghost text-xl hover:bg-primary/10 transition-all duration-300"
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
        </div>
        <div class="navbar-end">
          <div class="hidden lg:flex items-center gap-2 mr-4">
            <a
              href="/"
              class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
            >
              <LuHome class="w-4 h-4 text-primary" />
              Beranda
            </a>
            <a
              href="/faq"
              class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
            >
              <LuHelpCircle class="w-4 h-4 text-primary" />
              FAQ
            </a>
            {!isAuthenticated.value ? (
              <>
                <a
                  href="/auth/signup/kader"
                  class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300 auth-dependent"
                >
                  <LuStethoscope class="w-4 h-4 text-primary" />
                  Daftar Posyandu
                </a>
                <a
                  href="/auth/signup/psikolog"
                  class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300 auth-dependent"
                >
                  <LuBrain class="w-4 h-4 text-primary" />
                  Daftar Psikolog
                </a>
              </>
            ) : null}
          </div>
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
        </div>
      </div>
    </nav>
  );
});
