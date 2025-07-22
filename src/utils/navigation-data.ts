import { Component, SVGProps } from "@qwik.dev/core";
import {
  LuHome,
  LuUser,
  LuLogIn,
  LuStethoscope,
  LuBrain,
  LuSettings,
  LuBarChart,
  LuHelpCircle,
  LuClipboardList,
  LuCalendarCheck,
  LuFileText,
  LuBookOpen,
  LuUsers,
} from "~/components/icons/lucide-optimized"; // Changed import source

interface NavItem {
  label: string;
  href: string;
  icon: Component<SVGProps<SVGSVGElement>>; // Corrected type for the icon component
  roles?: ("guest" | "user" | "admin" | "kader" | "psikolog")[];
  onClick$?: () => void;
}

export const guestNavigation: NavItem[] = [
  {
    label: "Beranda",
    href: "/",
    icon: LuHome,
  },
  {
    label: "FAQ",
    href: "/faq",
    icon: LuHelpCircle,
  },
  {
    label: "Masuk",
    href: "/auth/login",
    icon: LuLogIn,
  },
  {
    label: "Daftar Posyandu",
    href: "/auth/signup/kader",
    icon: LuStethoscope,
  },
  {
    label: "Daftar Psikolog",
    href: "/auth/signup/psikolog",
    icon: LuBrain,
  },
];

export const authenticatedNavigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LuBarChart,
    roles: ["user", "admin", "kader", "psikolog"],
  },
  {
    label: "Profil",
    href: "/dashboard/profile",
    icon: LuUser,
    roles: ["user", "admin", "kader", "psikolog"],
  },
  {
    label: "Pengaturan",
    href: "/dashboard/settings",
    icon: LuSettings,
    roles: ["user", "admin", "kader", "psikolog"],
  },
  // Admin specific links
  {
    label: "Manajemen Pengguna",
    href: "/admin/users",
    icon: LuUsers,
    roles: ["admin"],
  },
  {
    label: "Manajemen Konten",
    href: "/admin/content",
    icon: LuFileText,
    roles: ["admin"],
  },
  // Kader specific links
  {
    label: "Data Posyandu",
    href: "/kader/data-posyandu",
    icon: LuClipboardList,
    roles: ["kader"],
  },
  {
    label: "Jadwal Kegiatan",
    href: "/kader/jadwal",
    icon: LuCalendarCheck,
    roles: ["kader"],
  },
  // Psikolog specific links
  {
    label: "Daftar Klien",
    href: "/psikolog/klien",
    icon: LuUsers,
    roles: ["psikolog"],
  },
  {
    label: "Sesi Konseling",
    href: "/psikolog/sesi",
    icon: LuBookOpen,
    roles: ["psikolog"],
  },
];

export const generateNavigationLinks = (
  isLoggedIn: boolean,
  userRole?: string | null,
) => {
  const links: NavItem[] = [];

  // Add guest links if not logged in
  if (!isLoggedIn) {
    links.push(...guestNavigation);
  } else {
    // Add authenticated links based on role
    authenticatedNavigation.forEach((item) => {
      if (!item.roles) {
        links.push(item);
      } else if (
        userRole &&
        item.roles.includes(
          userRole as "guest" | "user" | "admin" | "kader" | "psikolog",
        )
      ) {
        // Explicitly cast to valid role type
        links.push(item);
      }
    });
  }
  return links;
};
