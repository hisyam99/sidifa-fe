import { Component, SVGProps } from "@builder.io/qwik";
import {
  LuHome,
  LuUser,
  LuUsers,
  LuBuilding,
  LuKey,
  LuSettings,
  LuClipboardList,
  LuBookOpen,
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
    href: "/admin/manajemen-psikolog",
    label: "Manajemen Psikolog",
    icon: LuUser,
  },
  {
    href: "/admin/manajemen-pengguna",
    label: "Manajemen Pengguna",
    icon: LuUsers,
  },
  {
    href: "/admin/laporan-sistem",
    label: "Laporan Sistem",
    icon: LuClipboardList,
  },
  {
    href: "/admin/materi-edukasi",
    label: "Materi Edukasi",
    icon: LuBookOpen,
  },
  {
    href: "/dashboard/settings", // Reusing general settings page
    label: "Pengaturan",
    icon: LuSettings,
  },
];
