import { component$ } from "@qwik.dev/core";
import { useAuth } from "~/hooks";
import { $ } from "@qwik.dev/core";
import {
  LuClipboardList,
  LuBriefcase,
  LuBookOpen,
  LuUser,
} from "@qwikest/icons/lucide";
import {
  RoleDashboardHeader,
  DashboardQuickLinkCard,
} from "~/components/dashboard";

export default component$(() => {
  const { user } = useAuth();

  const quickLinks = [
    {
      href: "/kader/posyandu",
      label: "List Posyandu",
      icon: $(LuClipboardList),
      desc: "Lihat dan kelola seluruh posyandu yang Anda akses.",
    },
    {
      href: "/kader/lowongan",
      label: "Lowongan",
      icon: $(LuBriefcase),
      desc: "Temukan informasi lowongan terbaru untuk kader.",
    },
    {
      href: "/kader/informasi",
      label: "Informasi",
      icon: $(LuBookOpen),
      desc: "Akses materi edukasi dan informasi penting.",
    },
    {
      href: "/dashboard/profile",
      label: "Profil Saya",
      icon: $(LuUser),
      desc: "Lihat dan edit profil Anda.",
    },
  ];

  return (
    <div class="container mx-auto py-8">
      <RoleDashboardHeader
        title="Dashboard Kader"
        welcomeMessage="Selamat datang,"
        userName={user.value?.email || "Kader"}
        userRole="kader"
      />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((link) => (
          <DashboardQuickLinkCard
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            description={link.desc}
          />
        ))}
      </div>
    </div>
  );
});
