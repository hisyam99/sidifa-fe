import { component$, Slot } from "@qwik.dev/core";
import { useCheckRole } from "~/hooks/useCheckRole";
import {
  LuBarChart,
  LuClipboardList,
  LuLineChart,
  LuArrowLeft,
} from "@qwikest/icons/lucide";
import { useLocation } from "@qwik.dev/router";

export default component$(() => {
  const location = useLocation();

  useCheckRole(["kader"]);

  // Extract posyanduId from the URL
  const pathParts = location.url.pathname.split("/");
  const posyanduId = pathParts[pathParts.indexOf("posyandu") + 1];
  const base = `/kader/posyandu/${posyanduId}`;

  const menuItems = [
    { href: base, label: "Dashboard", icon: "LuBarChart" },
    {
      href: `${base}/laporan-statistik`,
      label: "Laporan Statistik",
      icon: "LuLineChart",
    },
    {
      href: `${base}/pendataan-ibk`,
      label: "Pendataan IBK",
      icon: "LuClipboardList",
    },
  ];

  const iconMap = {
    LuBarChart,
    LuLineChart,
    LuClipboardList,
  };

  return (
    <div class="min-h-screen bg-base-200/60">
      <div class="drawer lg:drawer-open">
        <input
          id="drawer-posyandu-detail"
          type="checkbox"
          class="drawer-toggle"
        />
        <div class="drawer-content flex flex-col p-4 md:p-8">
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
        <aside class="drawer-side">
          <label
            for="drawer-posyandu-detail"
            aria-label="close sidebar"
            class="drawer-overlay"
          ></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-100 lg:bg-transparent text-base-content">
            <li class="text-xl font-bold p-4 hidden lg:block">
              Detail Posyandu
            </li>
            {menuItems.map((item) => (
              <li
                key={item.href}
                class={location.url.pathname === item.href ? "bordered" : ""}
              >
                <a href={item.href}>
                  {iconMap[item.icon as keyof typeof iconMap] &&
                    iconMap[item.icon as keyof typeof iconMap]({})}
                  {item.label}
                </a>
              </li>
            ))}
            <li class="mt-8">
              <a
                href={`/kader/posyandu/${posyanduId}/ibk/create`}
                class="btn btn-primary w-full flex items-center gap-2"
              >
                Tambah IBK
              </a>
            </li>
            <li class="mt-4">
              <a
                href="/kader/posyandu"
                class="btn btn-outline btn-primary w-full flex items-center gap-2"
              >
                <LuArrowLeft />
                Kembali ke List Posyandu
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
});
