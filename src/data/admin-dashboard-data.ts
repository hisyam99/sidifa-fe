import { Component, SVGProps } from "@builder.io/qwik";
import {
  LuUsers,
  LuUserCheck,
  LuBuilding,
  LuActivity,
} from "~/components/icons/lucide-optimized"; // Changed import source

export interface AdminStatItem {
  title: string;
  value: string;
  icon: Component<SVGProps<SVGSVGElement>>; // Corrected type for the icon component
  description: string;
}

export interface AdminRecentActivityItem {
  id: number;
  activity: string;
  user: string;
  time: string;
}

export const adminStatsData: AdminStatItem[] = [
  {
    title: "Total Pengguna",
    value: "1,200",
    icon: LuUsers,
    description: "Naik 21% dari bulan lalu",
  },
  {
    title: "Total IBK",
    value: "350",
    icon: LuUserCheck,
    description: "Naik 15% dari bulan lalu",
  },
  {
    title: "Posyandu Aktif",
    value: "45",
    icon: LuBuilding,
    description: "2 Posyandu baru bergabung",
  },
  {
    title: "Aktivitas Hari Ini",
    value: "12",
    icon: LuActivity,
    description: "Laporan & Pendaftaran baru",
  },
];

export const adminRecentActivitiesData: AdminRecentActivityItem[] = [
  {
    id: 1,
    activity: "Pendaftaran Kader Baru",
    user: "kader.baru@example.com",
    time: "10 menit yang lalu",
  },
  {
    id: 2,
    activity: "Menambahkan data IBK",
    user: "posyandu.melati@example.com",
    time: "1 jam yang lalu",
  },
  {
    id: 3,
    activity: "Verifikasi akun Psikolog",
    user: "admin@sidifa.com",
    time: "2 jam yang lalu",
  },
];
