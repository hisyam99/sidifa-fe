import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { NavigationWrapper, SidifaFooter } from "~/components/layout";

// Read UI-only auth cookies to avoid client flicker
export const useAuthFromCookie = routeLoader$(async ({ cookie, pathname }) => {
  const isLoggedIn = cookie.get("is_logged_in")?.value === "true";
  const role = cookie.get("user_role")?.value || null;
  const userId = cookie.get("user_id")?.value || null;
  const email = cookie.get("user_email")?.value || null;
  return {
    isLoggedIn: Boolean(isLoggedIn && userId && role),
    user:
      isLoggedIn && userId && role
        ? { id: userId, email: email || "", role }
        : null,
    path: pathname,
  };
});

export default component$(() => {
  return (
    <>
      <NavigationWrapper />
      <Slot />
      <SidifaFooter />
    </>
  );
});
