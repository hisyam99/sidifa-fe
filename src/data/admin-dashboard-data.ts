import { Component, SVGProps } from "@builder.io/qwik";
import {
  LuUsers,
  LuUserCheck,
  LuBuilding,
  LuActivity,
  LuClipboardList,
  LuCalendar,
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
  // total posyandu
  {
    title: "Total Posyandu",
    value: "78",
    icon: LuBuilding,
    description: "+2 baru bulan ini",
  },
  // total kader
  {
    title: "Total Kader",
    value: "1,024",
    icon: LuClipboardList,
    description: "+35 aktif minggu ini",
  },
  // total ibk dari keseluruhan posyandu
  {
    title: "Total IBK (All)",
    value: "3,560",
    icon: LuActivity,
    description: "92% sudah terverifikasi",
  },
  // total akun yang memerlukan verifikasi
  {
    title: "Perlu Verifikasi",
    value: "14",
    icon: LuUserCheck,
    description: "Menunggu review admin",
  },
  // total jadwal hari ini
  {
    title: "Jadwal Hari Ini",
    value: "26",
    icon: LuCalendar,
    description: "Termasuk kunjungan & konsultasi",
  },
  // total pengguna keseluruhan
  {
    title: "Total Pengguna",
    value: "2,410",
    icon: LuUsers,
    description: "+12% dari bulan lalu",
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
