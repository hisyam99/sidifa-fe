import { component$ } from "@builder.io/qwik";
import { PageContainer } from "~/components/layout";
import { ProfileCard } from "~/components/profile";

export default component$(() => {
  return (
    <PageContainer centered>
      <ProfileCard />
    </PageContainer>
  );
});
