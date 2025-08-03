import { Component, SVGProps } from "@builder.io/qwik";
import {
  LuHome,
  LuFileText,
  LuCalendar,
  LuUsers,
  LuClipboardList,
  LuSettings,
} from "~/components/icons/lucide-optimized"; // Changed import source

interface PsikologMenuItem {
  href: string;
  label: string;
  icon: Component<SVGProps<SVGSVGElement>>; // Corrected type for the icon component
}

export const getPsikologMenuItems = (): PsikologMenuItem[] => [
  {
    href: "/psikolog/",
    label: "Dashboard",
    icon: LuHome,
  },
  {
    href: "/psikolog/jadwal-sesi",
    label: "Jadwal Sesi",
    icon: LuCalendar,
  },
  {
    href: "/psikolog/pasien",
    label: "Manajemen Pasien",
    icon: LuUsers,
  },
  {
    href: "/psikolog/laporan-asesmen",
    label: "Laporan Asesmen",
    icon: LuFileText,
  },
  {
    href: "/psikolog/tes-psikologi",
    label: "Tes Psikologi",
    icon: LuClipboardList,
  },
  {
    href: "/dashboard/settings", // Reusing general settings page
    label: "Pengaturan",
    icon: LuSettings,
  },
];
