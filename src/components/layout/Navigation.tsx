import { component$, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { useAuthLoader } from "~/routes/layout";
import {
  LuMenu,
  LuHome,
  LuUser,
  LuLogIn,
  LuStethoscope,
  LuBrain,
  LuSettings,
  LuLogOut,
  LuHeart,
} from "@qwikest/icons/lucide";

export default component$(() => {
  const auth = useAuthLoader();
  const nav = useNavigate();

  const handleLogout = $(
    () => {
      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      nav("/auth/login");
    }
  );

  return (
    <nav class="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200/50 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <div class="navbar-start">
          <div class="dropdown">
            <button class="btn btn-ghost btn-circle lg:hidden focus-ring">
              <LuMenu class="w-6 h-6 text-base-content" />
            </button>
            <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100/95 backdrop-blur-md rounded-box w-64 border border-base-200/50">
              <li>
                <a
                  href="/"
                  class="flex items-center gap-3 hover:bg-primary/10 rounded-lg"
                >
                  <LuHome class="w-5 h-5 text-primary" />
                  <span class="font-medium">Beranda</span>
                </a>
              </li>
              {!auth.value.isLoggedIn ? (
                <>
                  <li>
                    <a
                      href="/auth/login"
                      class="flex items-center gap-3 hover:bg-primary/10 rounded-lg"
                    >
                      <LuLogIn class="w-5 h-5 text-primary" />
                      <span class="font-medium">Masuk</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/auth/signup/posyandu"
                      class="flex items-center gap-3 hover:bg-primary/10 rounded-lg"
                    >
                      <LuStethoscope class="w-5 h-5 text-primary" />
                      <span class="font-medium">Daftar Posyandu</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/auth/signup/psikolog"
                      class="flex items-center gap-3 hover:bg-primary/10 rounded-lg"
                    >
                      <LuBrain class="w-5 h-5 text-primary" />
                      <span class="font-medium">Daftar Psikolog</span>
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a
                      href="/dashboard/profile"
                      class="flex items-center gap-3 hover:bg-primary/10 rounded-lg"
                    >
                      <LuUser class="w-5 h-5 text-primary" />
                      <span class="font-medium">Profil</span>
                    </a>
                  </li>
                  {/* Role-based menu, user info dari loader jika sudah di-decode */}
                  {/* ... */}
                  <li>
                    <a
                      href="/dashboard/settings"
                      class="flex items-center gap-3 hover:bg-primary/10 rounded-lg"
                    >
                      <LuSettings class="w-5 h-5 text-primary" />
                      <span class="font-medium">Pengaturan</span>
                    </a>
                  </li>
                  <li>
                    <button
                      onClick$={handleLogout}
                      class="flex items-center gap-3 hover:bg-primary/10 rounded-lg"
                    >
                      <LuLogOut class="w-5 h-5 text-primary" />
                      <span class="font-medium">Keluar</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          <a
            href="/"
            class="btn btn-ghost text-xl hover:bg-primary/10 transition-all duration-300"
          >
            <div class="avatar placeholder mr-3">
              <div class="bg-gradient-primary  rounded-full w-12 h-12 shadow-lg">
                <LuHeart class="w-6 h-6" />
              </div>
            </div>
            <span class="font-bold text-gradient-primary">SIDIFA</span>
            <span class="text-xs text-base-content/60 font-medium">
              Sistem Informasi Difabel
            </span>
          </a>
        </div>

        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal px-1 gap-2">
            <li>
              <a
                href="/"
                class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
              >
                <LuHome class="w-4 h-4 text-primary" />
                Beranda
              </a>
            </li>
            {!auth.value.isLoggedIn ? (
              <>
                <li>
                  <a
                    href="/auth/login"
                    class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
                  >
                    <LuLogIn class="w-4 h-4 text-primary" />
                    Masuk
                  </a>
                </li>
                <li>
                  <a
                    href="/auth/signup/posyandu"
                    class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
                  >
                    <LuStethoscope class="w-4 h-4 text-primary" />
                    Daftar Posyandu
                  </a>
                </li>
                <li>
                  <a
                    href="/auth/signup/psikolog"
                    class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
                  >
                    <LuBrain class="w-4 h-4 text-primary" />
                    Daftar Psikolog
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a
                    href="/dashboard/profile"
                    class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
                  >
                    <LuUser class="w-4 h-4 text-primary" />
                    Profil
                  </a>
                </li>
                {/* Role-based menu, user info dari loader jika sudah di-decode */}
                {/* ... */}
                <li>
                  <a
                    href="/dashboard/settings"
                    class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
                  >
                    <LuSettings class="w-4 h-4 text-primary" />
                    Pengaturan
                  </a>
                </li>
                <li>
                  <button
                    onClick$={handleLogout}
                    class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
                  >
                    <LuLogOut class="w-4 h-4 text-primary" />
                    Keluar
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
});
