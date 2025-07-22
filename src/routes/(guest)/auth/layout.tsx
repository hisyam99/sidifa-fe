import { component$, Slot } from "@qwik.dev/core";
import type { RequestHandler } from "@qwik.dev/router";
import { AnimatedBackground } from "~/components/common";

// Middleware: Redirect to dashboard if already logged in (user_session cookie check)
export const onRequest: RequestHandler = async ({ redirect, cookie }) => {
  const userSessionCookie = cookie.get("user_session");
  if (userSessionCookie?.value) {
    try {
      const userSession = JSON.parse(
        decodeURIComponent(userSessionCookie.value),
      );
      if (userSession?.id && userSession?.role) {
        throw redirect(302, "/dashboard");
      }
    } catch {
      // If JSON parse fails, treat as not logged in
    }
  }
};

export default component$(() => {
  return (
    <main class="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Main Content */}
      <div class="relative z-10 min-h-[calc(100vh-120px)]">
        <Slot />
      </div>
    </main>
  );
});
