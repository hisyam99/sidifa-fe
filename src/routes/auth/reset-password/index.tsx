import { component$ } from "@builder.io/qwik";
import { PageContainer } from "~/components/layout";
import { ResetPasswordForm } from "~/components/auth";

export default component$(() => {
  return (
    <PageContainer centered>
      <ResetPasswordForm />
    </PageContainer>
  );
});
