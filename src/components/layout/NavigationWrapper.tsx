import { component$, isBrowser } from "@qwik.dev/core";
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

  // Guard: if cookies or localStorage indicate authenticated but client is still loading, show loading navbar
  if (
    (ssrAuth.value.isLoggedIn || clientThinksAuthenticated) &&
    loading.value
  ) {
    return <NavigationLoading />;
  }

  // Prefer SSR auth snapshot (no flicker)
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
