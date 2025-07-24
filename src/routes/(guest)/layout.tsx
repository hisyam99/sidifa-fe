import { component$, Slot } from "@qwik.dev/core";
import { NavigationGuest } from "~/components/layout";

export default component$(() => {
  return (
    <>
      <NavigationGuest />
      <div class="min-h-screen">
        <Slot />
      </div>
    </>
  );
});
