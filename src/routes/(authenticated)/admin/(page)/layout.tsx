import { component$, Slot } from "@builder.io/qwik";
import { RoleProtectedContent } from "~/components/common";

export default component$(() => {
  return (
    <RoleProtectedContent allowedRoles={["admin"]}>
      <Slot />
    </RoleProtectedContent>
  );
});
