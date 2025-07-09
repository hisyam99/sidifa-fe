import { useVisibleTask$, isServer } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { cookieUtils } from "~/utils/auth";

export const useAuthRedirect = () => {
  const nav = useNavigate();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // Server guard - tidak jalankan di server
    if (isServer) {
      return;
    }

    const userSession = cookieUtils.getUserSession();
    if (userSession) {
      nav("/dashboard");
    }
  });
};
