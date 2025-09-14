import { component$, QRL } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import { Avatar } from "./Avatar";

interface MenuItem {
  href: string;
  label: string;
  icon: any;
}

interface AvatarMenuProps {
  email?: string;
  role?: string;
  menuItems: MenuItem[];
  onLogout: QRL<() => void>;
  children?: any;
}

export const AvatarMenu = component$<AvatarMenuProps>(
  ({ email, role, menuItems, onLogout, children }) => {
    return (
      <div class="dropdown dropdown-end">
        <button
          tabIndex={0}
          class="btn btn-ghost btn-circle avatar focus-ring"
          aria-label="Menu profil pengguna"
        >
          <Avatar email={email} />
        </button>
        <ul
          tabIndex={0}
          class="menu menu-sm dropdown-content mt-3 p-2 shadow-xl bg-base-100/95 backdrop-blur-md rounded-box border border-base-200/50 w-max min-w-56 max-w-[95vw] overflow-x-auto right-0 z-[1000]"
        >
          <li class="menu-title">
            <div class="flex items-center gap-3 p-2 max-w-full">
              <Avatar email={email} size="w-8 h-8" />
              <div class="flex flex-col min-w-0 max-w-full">
                <span class="font-medium text-sm whitespace-nowrap leading-snug">
                  {email || "User"}
                </span>
                <span class="text-xs text-base-content/60 capitalize">
                  {role || "Role"}
                </span>
              </div>
            </div>
          </li>
          <div class="divider my-0"></div>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                class="flex items-center gap-3 hover:bg-primary/10"
              >
                {item.icon && <item.icon class="w-4 h-4 text-primary" />}
                <span class="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
          {children}
          <div class="divider my-1"></div>
          <li>
            <button
              onClick$={onLogout}
              class="flex items-center gap-3 hover:bg-error/10 text-error"
            >
              {/* You can pass a logout icon as prop if needed */}
              <span class="font-medium">Keluar</span>
            </button>
          </li>
        </ul>
      </div>
    );
  },
);
