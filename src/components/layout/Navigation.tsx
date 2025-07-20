import { component$, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
import { LuMenu, LuLogOut, LuUser, LuSettings } from "~/components/icons/lucide-optimized"; // Updated import path
import { BrandLogo, NavLink } from "~/components/common";
import { generateNavigationLinks } from "~/utils/navigation-data";

export const Navigation = component$(() => {
  const { isLoggedIn, user, loading, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = $(async () => {
    await logout();
    nav("/auth/login");
  });

  const navigationLinks = generateNavigationLinks(
    isLoggedIn.value,
    user.value?.role,
  );

  // Show skeleton while loading auth state
  if (loading.value) {
    return (
      <nav class="navbar bg-base-100/80 border-b border-base-200/50 sticky top-0 z-50 shadow-sm">
        <div class="container mx-auto px-4 flex items-center justify-between">
          <div class="navbar-start">
            {/* Mobile menu button skeleton */}
            <button
              class="btn btn-ghost btn-circle lg:hidden focus-ring"
              aria-label="Buka menu navigasi"
            >
              <LuMenu class="w-6 h-6 text-base-content" />
            </button>
            {/* Logo is static, no need for skeleton */}
            <BrandLogo />
          </div>
        </div>
      </nav>
    );
  }

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
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  onClick$={link.onClick$}
                />
              ))}
              {isLoggedIn.value && (
                <li>
                  <button
                    onClick$={handleLogout}
                    class="flex items-center gap-3 hover:bg-primary/10"
                  >
                    <LuLogOut class="w-5 h-5 text-primary" />
                    <span class="font-medium">Keluar</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          <BrandLogo />
        </div>

        {/* Desktop Navigation */}
        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal px-1">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                onClick$={link.onClick$}
              />
            ))}
          </ul>
        </div>

        <div class="navbar-end">
          {isLoggedIn.value ? (
            <div class="dropdown dropdown-end">
              <label tabIndex={0} class="btn btn-ghost btn-circle avatar">
                <div class="w-10 rounded-full">
                  <img
                    src={"https://api.dicebear.com/7.x/micah/svg?seed=sidifa"}
                    alt="Profil Pengguna"
                    width="40" // Added width attribute
                    height="40" // Added height attribute
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100/95 backdrop-blur-md rounded-box w-52 border border-base-200/50"
              >
                <NavLink
                  href="/dashboard/profile"
                  label="Profil"
                  icon={LuUser}
                />
                <NavLink
                  href="/dashboard/settings"
                  label="Pengaturan"
                  icon={LuSettings}
                />
                <li>
                  <button
                    onClick$={handleLogout}
                    class="flex items-center gap-3 hover:bg-primary/10"
                  >
                    <LuLogOut class="w-5 h-5 text-primary" />
                    <span class="font-medium">Keluar</span>
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <a
              href="/auth/login"
              class="btn btn-primary btn-sm px-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Masuk
            </a>
          )}
        </div>
      </div>
    </nav>
  );
});
