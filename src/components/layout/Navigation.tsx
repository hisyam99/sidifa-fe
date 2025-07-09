import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export default component$(() => {
  const isLoggedIn = useSignal(false);
  const userRole = useSignal<string | null>(null);

  useVisibleTask$(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          isLoggedIn.value = true;
          userRole.value = user.role;
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  });

  return (
    <nav class="navbar bg-base-100 shadow-lg">
      <div class="navbar-start">
        <a href="/" class="btn btn-ghost text-xl">
          SIDIFA
        </a>
      </div>
      <div class="navbar-center">
        <div class="flex gap-2">
          {!isLoggedIn.value ? (
            <>
              <a class="btn btn-sm btn-outline" href="/login">
                Login
              </a>
              <a class="btn btn-sm btn-outline" href="/signup-posyandu">
                Daftar Posyandu
              </a>
              <a class="btn btn-sm btn-outline" href="/signup-psikolog">
                Daftar Psikolog
              </a>
            </>
          ) : (
            <>
              <a class="btn btn-sm btn-outline" href="/profile">
                Profile
              </a>
              <span class="badge badge-primary">{userRole.value}</span>
            </>
          )}
        </div>
      </div>
      <div class="navbar-end">
        {!isLoggedIn.value && (
          <a class="btn btn-sm btn-ghost" href="/forgot-password">
            Lupa Password?
          </a>
        )}
      </div>
    </nav>
  );
});
