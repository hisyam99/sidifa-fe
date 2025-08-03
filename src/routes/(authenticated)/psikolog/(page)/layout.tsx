import { component$, Slot } from "@builder.io/qwik";
import { RoleProtectedContent } from "~/components/common";

export default component$(() => {
  return (
    <RoleProtectedContent allowedRoles={["psikolog", "admin"]}>
      <Slot />
    </RoleProtectedContent>
  );
});
