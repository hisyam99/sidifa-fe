import { component$, Slot } from "@builder.io/qwik";
import { RoleProtectedContent } from "~/components/common";
import { AnimatedPageContainer } from "~/components/layout/AnimatedPageContainer";

export default component$(() => {
  return (
    <RoleProtectedContent allowedRoles={["admin"]}>
      <AnimatedPageContainer>
        <Slot />
      </AnimatedPageContainer>
    </RoleProtectedContent>
  );
});
