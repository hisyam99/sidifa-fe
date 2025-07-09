import { component$ } from "@builder.io/qwik";
import { PageContainer } from "~/components/layout";
import { LoginForm } from "~/components/auth";

export default component$(() => {
  return (
    <PageContainer centered>
      <LoginForm />
    </PageContainer>
  );
});
