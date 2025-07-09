import { component$, Slot } from "@builder.io/qwik";
import { Navigation, SidifaFooter } from "~/components/layout";

export default component$(() => {
  return (
    <>
      <Navigation />
      <Slot />
      <SidifaFooter />
    </>
  );
});
