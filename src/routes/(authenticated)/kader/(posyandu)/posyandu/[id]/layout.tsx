import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { useCheckRole } from "~/hooks/useCheckRole";
import {
  LuBarChart,
  LuArrowLeft,
  LuClipboardList,
  LuCalendarClock,
  LuLineChart,
} from "~/components/icons/lucide-optimized";
import { Sidebar } from "~/components/common/Sidebar";

export default component$(() => {
  const location = useLocation();

  useCheckRole(["kader"]);

  // Extract posyanduId from the URL
  const pathParts = location.url.pathname.split("/");
  const posyanduId = pathParts[pathParts.indexOf("posyandu") + 1];
  const base = `/kader/posyandu/${posyanduId}`;

  const menuItems = [
    { href: base, label: "Dashboard", icon: LuBarChart, exact: true },
    {
      href: `${base}/ibk`,
      label: "Pendataan IBK",
      icon: LuClipboardList,
    },
    {
      href: `${base}/jadwal`,
      label: "Jadwal Posyandu",
      icon: LuCalendarClock,
    },
    {
      href: `${base}/laporan-statistik`,
      label: "Laporan Statistik",
      icon: LuLineChart,
    },
  ];

  return (
    <div class="min-h-screen">
      <div class="drawer lg:drawer-open">
        <input
          id="drawer-posyandu-detail"
          type="checkbox"
          class="drawer-toggle"
        />
        <div class="drawer-content flex flex-col p-2 md:p-4">
          <label
            for="drawer-posyandu-detail"
            class="btn btn-primary drawer-button lg:hidden mb-4 self-start"
          >
            <LuBarChart />
            Buka Menu
          </label>
          <main class="card bg-base-100 p-6 shadow-lg">
            <Slot />
          </main>
        </div>
        <Sidebar menuItems={menuItems} drawerId="drawer-posyandu-detail">
          <li class="mt-8">
            <Link
              href={`/kader/posyandu/${posyanduId}/ibk/create`}
              class="btn btn-primary w-full flex items-center gap-2"
            >
              Tambah IBK
            </Link>
          </li>
          <li class="mt-4">
            <Link
              href="/kader/posyandu"
              class="btn btn-outline btn-primary w-full flex items-center gap-2"
            >
              <LuArrowLeft />
              Kembali ke List Posyandu
            </Link>
          </li>
        </Sidebar>
      </div>
    </div>
  );
});
