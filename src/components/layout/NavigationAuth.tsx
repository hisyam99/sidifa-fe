import { component$, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import {
  LuMenu,
  LuHome,
  LuUser,
  LuSettings,
  LuLogOut,
  LuHelpCircle,
  LuBarChart,
  LuHeart,
  LuBrain,
} from "~/components/icons/lucide-optimized";
import { useNavigate } from "@builder.io/qwik-city";

export const NavigationAuth = component$(() => {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = $(async () => {
    await logout();
    nav("/auth/login");
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
              <li>
                <a
                  href="/dashboard"
                  class="flex items-center gap-3 hover:bg-primary/10"
                >
                  <LuBarChart class="w-5 h-5 text-primary" />
                  <span class="font-medium">Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/profile"
                  class="flex items-center gap-3 hover:bg-primary/10"
                >
                  <LuUser class="w-5 h-5 text-primary" />
                  <span class="font-medium">Profil</span>
                </a>
              </li>
              {user.value?.role === "admin" && (
                <li>
                  <a
                    href="/admin"
                    class="flex items-center gap-3 hover:bg-primary/10"
                  >
                    <LuBarChart class="w-5 h-5 text-primary" />
                    <span class="font-medium">Dashboard Admin</span>
                  </a>
                </li>
              )}
              {user.value?.role === "kader" && (
                <li>
                  <a
                    href="/kader"
                    class="flex items-center gap-3 hover:bg-primary/10"
                  >
                    <LuHeart class="w-5 h-5 text-primary" />
                    <span class="font-medium">Dashboard Kader</span>
                  </a>
                </li>
              )}
              {user.value?.role === "psikolog" && (
                <li>
                  <a
                    href="/psikolog"
                    class="flex items-center gap-3 hover:bg-primary/10"
                  >
                    <LuBrain class="w-5 h-5 text-primary" />
                    <span class="font-medium">Dashboard Psikolog</span>
                  </a>
                </li>
              )}
              <li>
                <a
                  href="/dashboard/settings"
                  class="flex items-center gap-3 hover:bg-primary/10"
                >
                  <LuSettings class="w-5 h-5 text-primary" />
                  <span class="font-medium">Pengaturan</span>
                </a>
              </li>
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
            <a
              href="/dashboard"
              class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
            >
              <LuBarChart class="w-4 h-4 text-primary" />
              Dashboard
            </a>
            <a
              href="/dashboard/profile"
              class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
            >
              <LuUser class="w-4 h-4 text-primary" />
              Profil
            </a>
            {user.value?.role === "admin" && (
              <a
                href="/admin"
                class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
              >
                <LuBarChart class="w-4 h-4 text-primary" />
                Dashboard Admin
              </a>
            )}
            {user.value?.role === "kader" && (
              <a
                href="/kader"
                class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
              >
                <LuHeart class="w-4 h-4 text-primary" />
                Dashboard Kader
              </a>
            )}
            {user.value?.role === "psikolog" && (
              <a
                href="/psikolog"
                class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
              >
                <LuBrain class="w-4 h-4 text-primary" />
                Dashboard Psikolog
              </a>
            )}
            <a
              href="/dashboard/settings"
              class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
            >
              <LuSettings class="w-4 h-4 text-primary" />
              Pengaturan
            </a>
          </div>
          <div class="dropdown dropdown-end">
            <button class="btn btn-ghost btn-circle avatar focus-ring">
              <div class="w-10 h-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                <div class="bg-gradient-primary rounded-full w-10 h-10 flex items-center justify-center">
                  <span class="text-sm font-bold">
                    {user.value?.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            </button>
            <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100/95 backdrop-blur-md rounded-box w-56 border border-base-200/50">
              <li class="menu-title">
                <div class="flex items-center gap-3 p-2">
                  <div class="bg-gradient-primary rounded-full w-8 h-8 flex items-center justify-center">
                    <span class="text-xs font-bold">
                      {user.value?.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-medium text-sm">
                      {user.value?.email || "User"}
                    </span>
                    <span class="text-xs text-base-content/60 capitalize">
                      {user.value?.role || "Role"}
                    </span>
                  </div>
                </div>
              </li>
              <div class="divider my-0"></div>
              <li>
                <a
                  href="/dashboard/profile"
                  class="flex items-center gap-3 hover:bg-primary/10"
                >
                  <LuUser class="w-4 h-4 text-primary" />
                  <span class="font-medium">Profil</span>
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/settings"
                  class="flex items-center gap-3 hover:bg-primary/10"
                >
                  <LuSettings class="w-4 h-4 text-primary" />
                  <span class="font-medium">Pengaturan</span>
                </a>
              </li>
              <div class="divider my-1"></div>
              <li>
                <button
                  onClick$={handleLogout}
                  class="flex items-center gap-3 hover:bg-error/10 text-error"
                >
                  <LuLogOut class="w-4 h-4" />
                  <span class="font-medium">Keluar</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
});
