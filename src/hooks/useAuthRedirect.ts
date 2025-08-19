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

    const userSession = sessionUtils.getUserProfile();
    if (userSession) {
      // Redirect berdasarkan role user
      switch (userSession.role) {
        case "admin":
          nav("/admin", { replaceState: true });
          break;
        case "kader":
          nav("/kader", { replaceState: true });
          break;
        case "psikolog":
          nav("/psikolog", { replaceState: true });
          break;
        case "posyandu":
          nav("/posyandu", { replaceState: true });
          break;
        default:
          // Fallback ke dashboard jika role tidak dikenali
          nav("/", { replaceState: true });
          break;
      }
    }
  });
};
