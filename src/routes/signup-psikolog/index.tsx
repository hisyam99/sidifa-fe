import { component$ } from "@builder.io/qwik";
import { PageContainer } from "~/components/layout";
import { SignupPsikologForm } from "~/components/auth";

export default component$(() => {
  return (
    <PageContainer>
      <SignupPsikologForm />
    </PageContainer>
  );
});
