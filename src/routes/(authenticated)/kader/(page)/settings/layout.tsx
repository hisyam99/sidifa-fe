import { component$, Slot } from "@qwik.dev/core";
import { AnimatedPageContainer } from "~/components/layout/AnimatedPageContainer";

export default component$(() => {
  return (
    <AnimatedPageContainer>
      <Slot />
    </AnimatedPageContainer>
  );
});
