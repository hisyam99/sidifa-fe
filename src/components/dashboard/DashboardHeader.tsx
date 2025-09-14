import { component$, QRL } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import {
  LuBell,
  LuSettings,
  LuUser,
  LuLogOut,
} from "~/components/icons/lucide-optimized"; // Updated import path
import { getRoleDisplayName, getRoleIcon } from "~/utils/dashboard-utils";
import { useNavigate } from "@qwik.dev/router";

interface DashboardHeaderProps {
  userName: string;
  userRole?: string;
  onLogout$: QRL<() => void>;
}

export const DashboardHeader = component$((props: DashboardHeaderProps) => {
  const { userName, userRole, onLogout$ } = props;
  const nav = useNavigate();
  const RoleIcon = getRoleIcon(userRole);

  return (
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-base-content mb-2">
          Halo, {userName}!
        </h1>
        <p class="text-base-content/70 text-lg flex items-center gap-2">
          {RoleIcon && <RoleIcon class="w-5 h-5 text-primary" />}
          Selamat datang di Dasbor {getRoleDisplayName(userRole)}
        </p>
      </div>
      <div class="flex items-center gap-4">
        <button class="btn btn-ghost btn-circle">
          <LuBell class="w-6 h-6" />
        </button>
        <div class="dropdown dropdown-end">
          <label class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              {/* Placeholder for user avatar, replace with actual user.value?.avatar */}
              <img
                src="https://api.dicebear.com/7.x/micah/svg?seed=user-avatar"
                alt="User Avatar"
                width="40"
                height="40"
              />
            </div>
          </label>
          <ul class="menu menu-sm dropdown-content mt-3 p-2 shadow-xl bg-base-100/95 backdrop-blur-md rounded-box w-52 border border-base-200/50">
            <li>
              <Link
                href="/dashboard/profile"
                onClick$={() => nav("/dashboard/profile")}
                class="flex items-center gap-3 hover:bg-primary/10"
              >
                <LuUser class="w-5 h-5 text-primary" />
                Profil
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                onClick$={() => nav("/dashboard/settings")}
                class="flex items-center gap-3 hover:bg-primary/10"
              >
                <LuSettings class="w-5 h-5 text-primary" />
                Pengaturan
              </Link>
            </li>
            <li>
              <button
                onClick$={onLogout$}
                class="flex items-center gap-3 hover:bg-error/10 text-error"
              >
                <LuLogOut class="w-5 h-5" />
                Keluar
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
});
