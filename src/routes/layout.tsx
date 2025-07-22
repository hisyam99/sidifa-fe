import { component$, Slot } from "@builder.io/qwik";
import { SidifaFooter } from "~/components/layout";

export default component$(() => {
  return (
    <>
      <Slot />
      <SidifaFooter />
    </>
  );
});
