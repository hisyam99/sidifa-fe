import { component$, Slot } from "@qwik.dev/core";
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
