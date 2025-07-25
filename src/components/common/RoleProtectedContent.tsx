import { component$, Slot, useTask$, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
import { GenericLoadingSpinner } from "./GenericLoadingSpinner";

interface RoleProtectedContentProps {
  allowedRoles: string[];
}

export const RoleProtectedContent = component$(
  (props: RoleProtectedContentProps) => {
    const { allowedRoles } = props;
    const { user, isLoggedIn, loading } = useAuth();
    const nav = useNavigate();
    const isClient = useSignal(false);
    const hasAccess = useSignal(false);

    useTask$(({ track }) => {
      track(isLoggedIn); // Re-run when isLoggedIn changes
      track(() => user.value?.role); // Re-run when user role changes
      track(loading); // Re-run when authentication loading state changes

      isClient.value = true; // Mark as client-side after initial hydration

      if (loading.value) {
        hasAccess.value = false; // Still loading, no access determined yet
        return;
      }

      if (!isLoggedIn.value) {
        // Redirect if not logged in after loading is complete
        nav("/auth/login");
        hasAccess.value = false;
        return;
      }

      if (user.value?.role && allowedRoles.includes(user.value.role)) {
        hasAccess.value = true;
      } else {
        // Redirect if role is not allowed after loading is complete
        nav("/dashboard"); // Redirect to a generic dashboard or unauthorized page
        hasAccess.value = false;
      }
    });

    if (!isClient.value || loading.value) {
      return <GenericLoadingSpinner />;
    }

    if (!hasAccess.value) {
      return null; // Redirection handled by useTask$, or will show "Akses Ditolak" by specific component
    }

    return <Slot />;
  },
);
