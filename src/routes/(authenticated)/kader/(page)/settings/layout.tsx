import { component$, Slot } from "@builder.io/qwik";
import { AnimatedPageContainer } from "~/components/layout/AnimatedPageContainer";

export default component$(() => {
  return (
    <AnimatedPageContainer>
      <Slot />
    </AnimatedPageContainer>
  );
});
