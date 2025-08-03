import { Component, SVGProps } from "@builder.io/qwik";
import {
  LuHome,
  LuUsers,
  LuBuilding,
  LuKey,
  LuSettings,
  LuClipboardList,
  LuBookOpen,
  LuBrain,
} from "~/components/icons/lucide-optimized"; // Changed import source

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
  {
    href: "/admin/manajemen-kader",
    label: "Manajemen Kader",
    icon: LuUsers,
  },
  {
    href: "/admin/manajemen-psikolog",
    label: "Manajemen Psikolog",
    icon: LuBrain,
  },
  {
    href: "/admin/informasi",
    label: "Informasi dan Edukasi",
    icon: LuBookOpen,
  },
  {
    href: "/admin/laporan-sistem",
    label: "Laporan Sistem",
    icon: LuClipboardList,
  },
  {
    href: "/dashboard/settings",
    label: "Pengaturan",
    icon: LuSettings,
  },
];
