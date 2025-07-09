import { component$, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";

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
    <nav class="navbar bg-base-100 shadow-lg border-b border-base-300">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabIndex={0} role="button" class="btn btn-ghost lg:hidden">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              ></path>
            </svg>
          </div>
          <ul
            tabIndex={0}
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a href="/">Beranda</a>
            </li>
            {!isLoggedIn.value ? (
              <>
                <li>
                  <a href="/auth/login">Login</a>
                </li>
                <li>
                  <a href="/auth/signup/posyandu">Daftar Posyandu</a>
                </li>
                <li>
                  <a href="/auth/signup/psikolog">Daftar Psikolog</a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="/dashboard/profile">Profile</a>
                </li>
                {user.value?.role === "posyandu" && (
                  <li>
                    <a href="/dashboard/posyandu">Data Posyandu</a>
                  </li>
                )}
                {user.value?.role === "psikolog" && (
                  <li>
                    <a href="/dashboard/psikolog">Data Psikolog</a>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
        <a href="/" class="btn btn-ghost text-xl">
          <div class="avatar placeholder">
            <div class="bg-primary text-primary-content rounded-full w-10">
              <span class="text-lg font-bold">S</span>
            </div>
          </div>
          <span class="ml-2 font-bold">SIDIFA</span>
        </a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li>
            <a href="/" class="link link-hover">
              Beranda
            </a>
          </li>
          {!isLoggedIn.value ? (
            <>
              <li>
                <a href="/auth/login" class="link link-hover">
                  Login
                </a>
              </li>
              <li>
                <a href="/auth/signup/posyandu" class="link link-hover">
                  Daftar Posyandu
                </a>
              </li>
              <li>
                <a href="/auth/signup/psikolog" class="link link-hover">
                  Daftar Psikolog
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/dashboard/profile" class="link link-hover">
                  Profile
                </a>
              </li>
              {user.value?.role === "posyandu" && (
                <li>
                  <a href="/dashboard/posyandu" class="link link-hover">
                    Data Posyandu
                  </a>
                </li>
              )}
              {user.value?.role === "psikolog" && (
                <li>
                  <a href="/dashboard/psikolog" class="link link-hover">
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
          <a href="/auth/login" class="btn btn-primary">
            Masuk
          </a>
        ) : (
          <div class="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              class="btn btn-ghost btn-circle avatar"
            >
              <div class="w-10 rounded-full">
                <div class="avatar placeholder">
                  <div class="bg-primary text-primary-content rounded-full w-10">
                    <span class="text-sm font-bold">
                      {user.value?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="/dashboard/profile" class="justify-between">
                  Profile
                  <span class="badge badge-primary badge-sm">
                    {user.value?.role}
                  </span>
                </a>
              </li>
              <li>
                <a href="/dashboard/settings">Settings</a>
              </li>
              <li>
                <a href="#" onClick$={handleLogout}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
});
