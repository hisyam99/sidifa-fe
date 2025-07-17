import { component$, Slot } from "@builder.io/qwik";
import { NavigationGuest } from "~/components/layout";

export default component$(() => {
  return (
    <>
      <NavigationGuest />
      <Slot />
    </>
  );
});
