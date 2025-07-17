import { component$, $ } from "@builder.io/qwik";
import { useNavigate, useLocation } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
import {
  LuMenu,
  LuHome,
  LuClipboardList,
  LuBookOpen,
  LuBriefcase,
  LuSettings,
  LuLogOut,
  LuUser,
  LuBarChart,
} from "@qwikest/icons/lucide";

export const NavigationKader = component$(() => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const handleLogout = $(async () => {
    await logout();
    nav("/auth/login");
  });

  const menuItems = [
    { href: "/kader", label: "Dashboard", icon: LuHome },
    { href: "/kader/posyandu", label: "List Posyandu", icon: LuClipboardList },
    { href: "/kader/lowongan", label: "Lowongan", icon: LuBriefcase },
    { href: "/kader/informasi", label: "Informasi", icon: LuBookOpen },
  ];

  return (
    <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200/50 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <div class="navbar-start">
          <div class="dropdown">
            <button class="btn btn-ghost btn-circle lg:hidden focus-ring">
              <LuMenu class="w-6 h-6 text-base-content" />
            </button>
            <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100/95 backdrop-blur-md rounded-box w-64 border border-base-200/50">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    class="flex items-center gap-3 hover:bg-primary/10"
                  >
                    <item.icon class="w-5 h-5 text-primary" />
                    <span class="font-medium">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <a
            href="/kader"
            class="btn btn-ghost text-xl hover:bg-primary/10 transition-all duration-300"
          >
            <div class="bg-gradient-primary rounded-full w-12 h-12 mr-3 flex items-center justify-center shadow-lg">
              <LuBarChart class="w-6 h-6" />
            </div>
            <div class="flex flex-col items-start">
              <span class="font-bold text-gradient-primary">Si-DIFA Kader</span>
              <span class="text-xs text-base-content/60 font-medium">
                Sistem Informasi Difabel
              </span>
            </div>
          </a>
        </div>
        <div class="navbar-end">
          <div class="hidden lg:flex items-center gap-2 mr-4">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                class={`btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300${location.url.pathname === item.href ? " font-bold text-primary" : ""}`}
              >
                <item.icon class="w-4 h-4 text-primary" />
                {item.label}
              </a>
            ))}
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
                      Kader
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
