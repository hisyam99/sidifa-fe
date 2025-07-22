import { component$ } from "@qwik.dev/core";

interface RoleDashboardHeaderProps {
  title: string;
  welcomeMessage: string;
  userName: string;
  userRole: string;
}

export const RoleDashboardHeader = component$(
  (props: RoleDashboardHeaderProps) => {
    const { title, welcomeMessage, userName, userRole } = props;
    return (
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gradient-primary mb-2">{title}</h1>
        <p class="text-base-content/70">
          {welcomeMessage} <span class="font-semibold">{userName}</span>
          !<br />
          Anda login sebagai <span class="capitalize">{userRole}</span>.
        </p>
      </div>
    );
  },
);
