import { component$, Slot } from "@qwik.dev/core";
import { NavigationWrapper } from "~/components/layout";

export default component$(() => {
  return (
    <>
      <NavigationWrapper />
      <div class="min-h-screen">
        <Slot />
      </div>
    </>
  );
});
