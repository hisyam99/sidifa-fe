import { useVisibleTask$, isServer } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { sessionUtils } from "~/utils/auth";

export const useAuthRedirect = () => {
  const nav = useNavigate();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // Server guard - tidak jalankan di server
    if (isServer) {
      return;
    }

    // Prevent multiple executions using window flag
    if (typeof window !== "undefined" && (window as any).authRedirectExecuted) {
      return;
    }
    
    if (typeof window !== "undefined") {
      (window as any).authRedirectExecuted = true;
    }

    const userSession = sessionUtils.getUserProfile();
    if (userSession) {
      nav("/dashboard");
    }
  });
};
