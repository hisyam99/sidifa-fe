import { component$, Slot } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
import { useCheckRole } from "~/hooks/useCheckRole";
import {
  LuBarChart,
  LuHome,
  LuClipboardList,
  LuBookOpen,
  LuBriefcase,
  LuLineChart,
  LuLoader2,
} from "@qwikest/icons/lucide";

export default component$(() => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  useCheckRole(["posyandu"]);

  if (loading.value) {
    return (
      <div class="flex justify-center items-center min-h-screen">
        <LuLoader2
          class="animate-spin text-primary"
          style={{ width: "50px", height: "50px" }}
        />
      </div>
    );
  }

  if (!isLoggedIn.value) {
    return null;
  }

  const menuItems = [
    { href: "/posyandu/", label: "Dashboard", icon: LuHome },
    {
      href: "/posyandu/pendataan-ibk/",
      label: "Pendataan IBK",
      icon: LuClipboardList,
    },
    {
      href: "/posyandu/informasi-edukasi/",
      label: "Informasi & Edukasi",
      icon: LuBookOpen,
    },
    {
      href: "/posyandu/lowongan-pekerjaan/",
      label: "Lowongan Pekerjaan",
      icon: LuBriefcase,
    },
    {
      href: "/posyandu/laporan-statistik/",
      label: "Laporan & Statistik",
      icon: LuLineChart,
    },
  ];

  return (
    <div class="min-h-screen bg-base-200/60">
      <div class="drawer lg:drawer-open">
        <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col p-4 md:p-8">
          <label
            for="my-drawer-3"
            class="btn btn-primary drawer-button lg:hidden mb-4 self-start"
          >
            <LuBarChart />
            Buka Menu
          </label>
          <main class="bg-base-100 p-6 rounded-2xl shadow-lg">
            <Slot />
          </main>
        </div>
        <aside class="drawer-side">
          <label
            for="my-drawer-3"
            aria-label="close sidebar"
            class="drawer-overlay"
          ></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-100 lg:bg-transparent text-base-content">
            <li class="text-xl font-bold p-4 hidden lg:block">
              Si-DIFA Posyandu
            </li>
            {menuItems.map((item) => (
              <li
                key={item.href}
                class={location.url.pathname === item.href ? "bordered" : ""}
              >
                <a href={item.href}>
                  <item.icon />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
});
