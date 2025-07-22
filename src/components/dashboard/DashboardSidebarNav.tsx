import { component$, QRL } from "@qwik.dev/core";
import { NavLink } from "~/components/common";
import { generateNavigationLinks } from "~/utils/navigation-data";
import { LuLogOut } from "~/components/icons/lucide-optimized"; // Updated import path

interface DashboardSidebarNavProps {
  isLoggedIn: boolean;
  userRole?: string | null;
  onLogout$: QRL<() => void>;
}

export const DashboardSidebarNav = component$(
  (props: DashboardSidebarNavProps) => {
    const { isLoggedIn, userRole, onLogout$ } = props;
    const navLinks = generateNavigationLinks(isLoggedIn, userRole).filter(
      (link) =>
        link.href.startsWith("/dashboard") ||
        link.href.startsWith(`/${userRole}`),
    ); // Filter for dashboard relevant links

    return (
      <div class="card bg-base-100 shadow-lg hidden lg:block">
        <div class="card-body p-6">
          <h3 class="text-lg font-bold mb-4">Navigasi Cepat</h3>
          <ul class="menu space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                onClick$={link.onClick$}
              />
            ))}
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
    );
  },
);
