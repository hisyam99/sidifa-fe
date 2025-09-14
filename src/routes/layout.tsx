import { component$, Slot } from "@qwik.dev/core";
import { routeLoader$ } from "@qwik.dev/router";
import type { RequestHandler } from "@qwik.dev/router";
import { SidifaFooter } from "~/components/layout";
import { RoutingIndicator } from "~/components/layout/RoutingIndicator";

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
  const isLoggedIn = cookie.get("auth_status")?.value === "true";
  const roleCode = cookie.get("r")?.value || null;

  // Decode obfuscated role: r=0 (admin), r=1 (kader), r=2 (psikolog)
  const getRoleFromCode = (code: string | null) => {
    if (!code) return null;
    switch (code) {
      case "0":
        return "admin";
      case "1":
        return "kader";
      case "2":
        return "psikolog";
      default:
        return null;
    }
  };

  const role = getRoleFromCode(roleCode);

  return {
    isLoggedIn: Boolean(isLoggedIn && role),
    role: role,
    path: pathname,
  };
});

export default component$(() => {
  return (
    <>
      <RoutingIndicator style="bars" size="sm" color="primary" />
      <Slot />
      <SidifaFooter />
    </>
  );
});
