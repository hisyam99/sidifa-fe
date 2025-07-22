import { useVisibleTask$, isServer } from "@qwik.dev/core";
import { useNavigate } from "@qwik.dev/router";
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
      nav("/dashboard");
    }
  });
};
