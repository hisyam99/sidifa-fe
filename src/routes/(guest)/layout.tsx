import { component$, Slot } from "@builder.io/qwik";
import { Navigation } from "~/components/layout";

export default component$(() => {
  return (
    <>
      <Navigation />
      <Slot />
    </>
  );
});
