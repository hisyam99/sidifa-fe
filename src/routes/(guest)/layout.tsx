import { component$, Slot } from "@builder.io/qwik";
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
