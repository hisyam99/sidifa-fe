import { component$ } from "@builder.io/qwik";
import { getRoleDisplayName } from "~/utils/dashboard-utils";

interface ProfileOverviewCardProps {
  userName: string;
  userRole?: string;
  userEmail: string;
}

export const ProfileOverviewCard = component$(
  (props: ProfileOverviewCardProps) => {
    const { userName, userRole, userEmail } = props;
    const roleColorClass = getRoleDisplayName(userRole);

    return (
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body p-6 text-center">
          <div class={`avatar placeholder mx-auto mb-4`}>
            <div
              class={`w-24 rounded-full ${roleColorClass} text-primary-content`}
            >
              <span class="text-3xl font-bold">
                {userName?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <h2 class="text-xl font-bold text-base-content mb-1">
            {
              userName || "Pengguna"
              /* Replace with actual user.value?.name once available */
            }
          </h2>
          <p class="text-sm text-base-content/60 mb-2">{userEmail}</p>
          <div class="badge badge-primary badge-lg capitalize">
            {getRoleDisplayName(userRole)}
          </div>
        </div>
      </div>
    );
  },
);
