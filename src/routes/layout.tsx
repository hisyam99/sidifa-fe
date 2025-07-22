import { component$, Slot } from "@qwik.dev/core";
import { SidifaFooter } from "~/components/layout";

export default component$(() => {
  return (
    <>
      <Slot />
      <SidifaFooter />
    </>
  );
});
