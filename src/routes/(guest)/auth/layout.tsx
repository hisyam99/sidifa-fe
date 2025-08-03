import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { AnimatedBackground } from "~/components/common";
import { AnimatedPageContainer } from "~/components/layout/AnimatedPageContainer";

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
    <AnimatedPageContainer>
      <main class="relative">
        <AnimatedBackground />
        <Slot />
      </main>
    </AnimatedPageContainer>
  );
});
