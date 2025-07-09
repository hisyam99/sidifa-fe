import { component$ } from "@builder.io/qwik";
import { PageContainer } from "~/components/layout";
import { ProfileCard } from "~/components/profile";
import { useAuth } from "~/hooks";

export default component$(() => {
  const { user } = useAuth();

  if (!user.value) {
    return null;
  }

  return (
    <PageContainer centered>
      <ProfileCard user={user.value} />
    </PageContainer>
  );
});
