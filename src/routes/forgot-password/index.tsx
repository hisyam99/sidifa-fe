import { component$ } from "@builder.io/qwik";
import { PageContainer } from "~/components/layout";
import { ForgotPasswordForm } from "~/components/auth";

export default component$(() => {
  return (
    <PageContainer>
      <ForgotPasswordForm />
    </PageContainer>
  );
});
