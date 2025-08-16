import { Component, SVGProps } from "@builder.io/qwik";
import {
  LuHome,
  // LuUsers,
  LuBuilding,
  LuKey,
  LuBookOpen,
  LuBriefcase,
  LuUser,
} from "~/components/icons/lucide-optimized";

interface AdminMenuItem {
  href: string;
  label: string;
  icon: Component<SVGProps<SVGSVGElement>>; // Corrected type for the icon component
}

export const getAdminMenuItems = (): AdminMenuItem[] => [
  {
    href: "/admin/",
    label: "Dashboard",
    icon: LuHome,
  },
  {
    href: "/admin/verifikasi-akun",
    label: "Verifikasi Akun",
    icon: LuKey,
  },
  {
    href: "/admin/posyandu",
    label: "Manajemen Posyandu",
    icon: LuBuilding,
  },
  /*   {
    href: "/admin/manajemen-kader",
    label: "Manajemen Kader",
    icon: LuUsers,
  }, */
  {
    href: "/admin/informasi",
    label: "Informasi dan Edukasi",
    icon: LuBookOpen,
  },
  {
    href: "/admin/lowongan",
    label: "Lowongan",
    icon: LuBriefcase,
  },
  {
    href: "/admin/profile",
    label: "Profil Admin",
    icon: LuUser,
  },
];
