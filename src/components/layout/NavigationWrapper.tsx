import { component$ } from "@qwik.dev/core";
import { useAuth } from "~/hooks";
import { NavigationGuest } from "./NavigationGuest";
import { NavigationAdmin } from "./NavigationAdmin";
import { NavigationKader } from "./NavigationKader";
import { NavigationPsikolog } from "./NavigationPsikolog";
import { NavigationAuth } from "./NavigationAuth";
import { LuMenu } from "~/components/icons/lucide-optimized";
import { BrandLogo } from "~/components/common";

export const NavigationWrapper = component$(() => {
  const { isLoggedIn, user, loading } = useAuth();

  // Show skeleton while loading auth state
  if (loading.value) {
    return (
      <nav class="navbar bg-base-100/80 border-b border-base-200/50 sticky top-0 z-50 shadow-sm">
        <div class="container mx-auto px-4 flex items-center justify-between">
          <div class="navbar-start">
            <button
              class="btn btn-ghost btn-circle lg:hidden focus-ring"
              aria-label="Buka menu navigasi"
            >
              <LuMenu class="w-6 h-6 text-base-content" />
            </button>
            <BrandLogo />
          </div>
        </div>
      </nav>
    );
  }

  // Guest navigation for non-logged in users
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
