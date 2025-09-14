import { component$, Slot } from "@qwik.dev/core";
import { RoleProtectedContent } from "~/components/common";

export default component$(() => {
  return (
    <RoleProtectedContent allowedRoles={["psikolog", "admin"]}>
      <Slot />
    </RoleProtectedContent>
  );
});
