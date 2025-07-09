import { component$ } from "@builder.io/qwik";
import { PageContainer } from "~/components/layout";
import { SignupPosyanduForm } from "~/components/auth";

export default component$(() => {
  return (
    <PageContainer centered>
      <SignupPosyanduForm />
    </PageContainer>
  );
});
