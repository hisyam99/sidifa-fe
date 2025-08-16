import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import { SidifaFooter } from "~/components/layout";

export const onGet: RequestHandler = async ({ cacheControl, url }) => {
  // Default SWR caching site-wide
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });

  // Homepage: public + shared-cache + duplicate CDN header
  if (url.pathname === "/") {
    cacheControl({
      public: true,
      maxAge: 5,
      sMaxAge: 10,
      staleWhileRevalidate: 60 * 60 * 24 * 365,
    });
    cacheControl(
      {
        maxAge: 5,
        staleWhileRevalidate: 60 * 60 * 24 * 365,
      },
      "CDN-Cache-Control",
    );
  }
};

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
      <Slot />
      <SidifaFooter />
    </>
  );
});
