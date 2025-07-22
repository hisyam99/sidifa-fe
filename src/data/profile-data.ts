import { Component, SVGProps } from "@builder.io/qwik";
import { LuCheckCircle } from "~/components/icons/lucide-optimized"; // Updated import path

interface ProfileBenefitItem {
  text: string;
  icon: Component<SVGProps<SVGSVGElement>>; // Corrected type for the icon component
}

export const getRoleBenefitsData = (role?: string): ProfileBenefitItem[] => {
  if (role === "kader") {
    return [
      {
        text: "Kelola data kesehatan masyarakat",
        icon: LuCheckCircle,
      },
      {
        text: "Laporan dan statistik real-time",
        icon: LuCheckCircle,
      },
      {
        text: "Akses ke layanan psikologis",
        icon: LuCheckCircle,
      },
    ];
  } else if (role === "psikolog") {
    return [
      {
        text: "Kelola jadwal konseling",
        icon: LuCheckCircle,
      },
      {
        text: "Rekam medis pasien",
        icon: LuCheckCircle,
      },
      {
        text: "Kolaborasi dengan posyandu",
        icon: LuCheckCircle,
      },
    ];
  } else {
    return [
      {
        text: "Akses ke informasi kesehatan",
        icon: LuCheckCircle,
      },
      {
        text: "Layanan konseling",
        icon: LuCheckCircle,
      },
    ];
  }
};
