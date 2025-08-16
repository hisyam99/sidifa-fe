import { component$, Slot } from "@builder.io/qwik";
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
