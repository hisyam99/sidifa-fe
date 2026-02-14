import { component$, isBrowser } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { NavigationGuest } from "./NavigationGuest";
import { NavigationAdmin } from "./NavigationAdmin";
import { NavigationKader } from "./NavigationKader";
import { NavigationPsikolog } from "./NavigationPsikolog";
import { NavigationAuth } from "./NavigationAuth";
import { useAuthFromCookie } from "~/routes/layout";
import { NavigationLoading } from "./NavigationLoading";
import { sessionUtils } from "~/utils/auth";

export const NavigationWrapper = component$(() => {
  const { isLoggedIn, user, loading } = useAuth();
  const ssrAuth = useAuthFromCookie();

  // Determine if client storage suggests authenticated
  const clientThinksAuthenticated = isBrowser
    ? sessionUtils.getAuthStatus() === true
    : false;

  // CRITICAL FIX: When client-side auth has definitively resolved (loading is false)
  // and says the user is NOT logged in, that MUST take priority over the stale SSR
  // snapshot. This handles the optimistic logout case where ssrAuth still holds
  // the previous server-rendered value (routeLoader$ doesn't re-run on soft navigation),
  // but client-side state has already been cleared.
  if (
    isBrowser &&
    !loading.value &&
    !isLoggedIn.value &&
    !clientThinksAuthenticated
  ) {
    return <NavigationGuest />;
  }

  // Guard: if cookies or localStorage indicate authenticated but client is still loading, show loading navbar
  if (
    (ssrAuth.value.isLoggedIn || clientThinksAuthenticated) &&
    loading.value
  ) {
    return <NavigationLoading />;
  }

  // Prefer SSR auth snapshot (no flicker) — only used when client hasn't resolved yet
  // or client confirms the user is still authenticated
  if (ssrAuth.value.isLoggedIn && ssrAuth.value.role) {
    const role = ssrAuth.value.role;
    switch (role) {
      case "admin":
        return <NavigationAdmin />;
      case "kader":
      case "posyandu":
        return <NavigationKader />;
      case "psikolog":
        return <NavigationPsikolog />;
      default:
        return <NavigationAuth />;
    }
  }

  // Guest navigation for non-logged in users (no loading guard)
  if (!isLoggedIn.value) {
    return <NavigationGuest />;
  }

  // Role-specific navigation for authenticated users
  const userRole = user.value?.role;

  switch (userRole) {
    case "admin":
      return <NavigationAdmin />;
    case "kader":
    case "posyandu":
      return <NavigationKader />;
    case "psikolog":
      return <NavigationPsikolog />;
    default:
      // Default authenticated navigation for general users
      return <NavigationAuth />;
  }
});
