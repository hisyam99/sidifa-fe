import { component$, Slot } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { useCheckRole } from "~/hooks/useCheckRole";
import { LuLoader2 } from "@qwikest/icons/lucide";

export default component$(() => {
  const { isLoggedIn, loading } = useAuth();

  useCheckRole(["psikolog"]);

  if (loading.value) {
    return (
      <div class="flex justify-center items-center min-h-screen">
        <LuLoader2
          class="animate-spin text-primary"
          style={{ width: "50px", height: "50px" }}
        />
      </div>
    );
  }

  // Let the auth hook handle redirects
  if (!isLoggedIn.value) {
    return null; // The auth hook will redirect
  }

  return <Slot />;
});
