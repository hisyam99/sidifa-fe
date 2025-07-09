import { component$, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
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
  const { isLoggedIn, user } = useAuth();
  const nav = useNavigate();

  const handleLogout = $(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      nav("/auth/login");
    }
  });

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
              {!isLoggedIn.value ? (
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
                  {user.value?.role === "posyandu" && (
                    <li>
                      <a
                        href="/dashboard/posyandu"
                        class="flex items-center gap-3 hover:bg-primary/10 rounded-lg"
                      >
                        <LuHeart class="w-5 h-5 text-primary" />
                        <span class="font-medium">Data Posyandu</span>
                      </a>
                    </li>
                  )}
                  {user.value?.role === "psikolog" && (
                    <li>
                      <a
                        href="/dashboard/psikolog"
                        class="flex items-center gap-3 hover:bg-primary/10 rounded-lg"
                      >
                        <LuBrain class="w-5 h-5 text-primary" />
                        <span class="font-medium">Data Psikolog</span>
                      </a>
                    </li>
                  )}
                  <li>
                    <a
                      href="/dashboard/posyandu"
                      class="flex items-center gap-3 hover:bg-primary/10 rounded-lg"
                    >
                      <LuHeart class="w-5 h-5 text-primary" />
                      <span class="font-medium">Data Posyandu</span>
                    </a>
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
            <div class="flex flex-col items-start">
              <span class="font-bold text-gradient-primary">SIDIFA</span>
              <span class="text-xs text-base-content/60 font-medium">
                Sistem Informasi Difabel
              </span>
            </div>
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
            {!isLoggedIn.value ? (
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
                {user.value?.role === "posyandu" && (
                  <li>
                    <a
                      href="/dashboard/posyandu"
                      class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
                    >
                      <LuHeart class="w-4 h-4 text-primary" />
                      Data Posyandu
                    </a>
                  </li>
                )}
                {user.value?.role === "psikolog" && (
                  <li>
                    <a
                      href="/dashboard/psikolog"
                      class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300"
                    >
                      <LuBrain class="w-4 h-4 text-primary" />
                      Data Psikolog
                    </a>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>

        <div class="navbar-end">
          {!isLoggedIn.value ? (
            <a
              href="/auth/login"
              class="btn btn-primary btn-sm gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <LuLogIn class="w-4 h-4" />
              Masuk
            </a>
          ) : (
            <div class="dropdown dropdown-end">
              <button class="btn btn-ghost btn-circle avatar focus-ring">
                <div class="w-10 h-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                  <div class="avatar placeholder">
                    <div class="bg-gradient-primary  rounded-full w-10 h-10">
                      <span class="text-sm font-bold">
                        {user.value?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
              <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100/95 backdrop-blur-md rounded-box w-56 border border-base-200/50">
                <li class="menu-title">
                  <div class="flex items-center gap-3 p-2">
                    <div class="avatar placeholder">
                      <div class="bg-gradient-primary  rounded-full w-8 h-8">
                        <span class="text-xs font-bold">
                          {user.value?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    </div>
                    <div class="flex flex-col">
                      <span class="font-medium text-sm">
                        {user.value?.name || "User"}
                      </span>
                      <span class="text-xs text-base-content/60 capitalize">
                        {user.value?.role || "user"}
                      </span>
                    </div>
                  </div>
                </li>
                <div class="divider my-1"></div>
                <li>
                  <a
                    href="/dashboard/profile"
                    class="flex items-center gap-3 hover:bg-primary/10 rounded-lg"
                  >
                    <LuUser class="w-4 h-4 text-primary" />
                    <span class="font-medium">Profil</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/settings"
                    class="flex items-center gap-3 hover:bg-primary/10 rounded-lg"
                  >
                    <LuSettings class="w-4 h-4 text-primary" />
                    <span class="font-medium">Pengaturan</span>
                  </a>
                </li>
                <div class="divider my-1"></div>
                <li>
                  <button
                    onClick$={handleLogout}
                    class="flex items-center gap-3 hover:bg-error/10 rounded-lg text-error"
                  >
                    <LuLogOut class="w-4 h-4" />
                    <span class="font-medium">Keluar</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});
