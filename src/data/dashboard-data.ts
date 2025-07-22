import { Component, SVGProps } from "@qwik.dev/core";
import {
  LuUsers,
  LuCalendar,
  LuFileText,
  LuTrendingUp,
  LuStar,
  LuBarChart,
} from "~/components/icons/lucide-optimized"; // Changed import source

export interface DashboardStatItem {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: Component<SVGProps<SVGSVGElement>>; // Corrected type for the icon component
  color: string;
}

export interface RecentActivityItem {
  title: string;
  description: string;
  time: string;
  type: "success" | "warning" | "info" | "danger";
}

export const getDashboardStats = (role?: string): DashboardStatItem[] => {
  if (role === "kader") {
    return [
      {
        title: "Total Penyandang Disabilitas",
        value: "156",
        change: "+12%",
        changeType: "positive",
        icon: LuUsers,
        color: "bg-primary/10 text-primary",
      },
      {
        title: "Kunjungan Bulan Ini",
        value: "89",
        change: "+8%",
        changeType: "positive",
        icon: LuCalendar,
        color: "bg-secondary/10 text-secondary",
      },
      {
        title: "Laporan Terselesaikan",
        value: "23",
        change: "+15%",
        changeType: "positive",
        icon: LuFileText,
        color: "bg-accent/10 text-accent",
      },
      {
        title: "Efisiensi Layanan",
        value: "94%",
        change: "+5%",
        changeType: "positive",
        icon: LuTrendingUp,
        color: "bg-success/10 text-success",
      },
    ];
  } else if (role === "psikolog") {
    return [
      {
        title: "Pasien Aktif",
        value: "28",
        change: "+3",
        changeType: "positive",
        icon: LuUsers,
        color: "bg-primary/10 text-primary",
      },
      {
        title: "Sesi Konseling",
        value: "45",
        change: "+12%",
        changeType: "positive",
        icon: LuCalendar,
        color: "bg-secondary/10 text-secondary",
      },
      {
        title: "Rekam Medis",
        value: "156",
        change: "+8",
        changeType: "positive",
        icon: LuFileText,
        color: "bg-accent/10 text-accent",
      },
      {
        title: "Rating Kepuasan",
        value: "4.8",
        change: "+0.2",
        changeType: "positive",
        icon: LuStar,
        color: "bg-warning/10 text-warning",
      },
    ];
  } else {
    return [
      {
        title: "Total Data",
        value: "0",
        change: "0%",
        changeType: "neutral",
        icon: LuBarChart,
        color: "bg-base-300/10 text-base-content",
      },
    ];
  }
};

export const getRecentActivities = (role?: string): RecentActivityItem[] => {
  if (role === "kader") {
    return [
      {
        title: "Pendaftaran Baru",
        description: "Ahmad Fauzi mendaftar sebagai penyandang disabilitas",
        time: "2 jam yang lalu",
        type: "success",
      },
      {
        title: "Kunjungan Posyandu",
        description: "Kunjungan rutin untuk Siti Aminah",
        time: "4 jam yang lalu",
        type: "info",
      },
      {
        title: "Laporan Baru",
        description: "Laporan perkembangan Budi Santoso",
        time: "1 hari yang lalu",
        type: "warning",
      },
    ];
  } else if (role === "psikolog") {
    return [
      {
        title: "Sesi Baru",
        description: "Jadwal sesi konseling dengan Ibu Ani",
        time: "1 jam yang lalu",
        type: "info",
      },
      {
        title: "Catatan Rekam Medis",
        description: "Menambahkan catatan untuk Pasien Budi",
        time: "3 jam yang lalu",
        type: "success",
      },
      {
        title: "Pembatalan Sesi",
        description: "Sesi dengan Bapak Joko dibatalkan",
        time: "1 hari yang lalu",
        type: "warning",
      },
    ];
  } else if (role === "admin") {
    return [
      {
        title: "Pengguna Baru",
        description: "Admin baru mendaftar: Dewi Puspitasari",
        time: "1 jam yang lalu",
        type: "success",
      },
      {
        title: "Pemutakhiran Data",
        description: "Data posyandu 'Sejahtera' diperbarui",
        time: "5 jam yang lalu",
        type: "info",
      },
      {
        title: "Notifikasi Sistem",
        description: "Peringatan: Ruang penyimpanan hampir penuh",
        time: "1 hari yang lalu",
        type: "warning",
      },
    ];
  }
  return [];
};
