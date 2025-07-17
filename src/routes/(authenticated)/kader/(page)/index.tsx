import { component$ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import {
  LuClipboardList,
  LuBriefcase,
  LuBookOpen,
  LuUser,
} from "@qwikest/icons/lucide";

export default component$(() => {
  const { user } = useAuth();

  const quickLinks = [
    {
      href: "/kader/posyandu",
      label: "List Posyandu",
      icon: <LuClipboardList class="w-6 h-6 text-primary" />,
      desc: "Lihat dan kelola seluruh posyandu yang Anda akses.",
    },
    {
      href: "/kader/lowongan",
      label: "Lowongan",
      icon: <LuBriefcase class="w-6 h-6 text-primary" />,
      desc: "Temukan informasi lowongan terbaru untuk kader.",
    },
    {
      href: "/kader/informasi",
      label: "Informasi",
      icon: <LuBookOpen class="w-6 h-6 text-primary" />,
      desc: "Akses materi edukasi dan informasi penting.",
    },
    {
      href: "/dashboard/profile",
      label: "Profil Saya",
      icon: <LuUser class="w-6 h-6 text-primary" />,
      desc: "Lihat dan edit profil Anda.",
    },
  ];

  return (
    <div class="container mx-auto py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gradient-primary mb-2">
          Dashboard Kader
        </h1>
        <p class="text-base-content/70">
          Selamat datang, <span class="font-semibold">{user.value?.email}</span>
          !<br />
          Anda login sebagai <span class="capitalize">kader</span>.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 border border-base-200 hover:border-primary group"
          >
            <div class="card-body flex flex-col items-center text-center">
              <div class="mb-4">{link.icon}</div>
              <h2 class="card-title text-lg font-semibold group-hover:text-primary">
                {link.label}
              </h2>
              <p class="text-base-content/70 text-sm">{link.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
});
