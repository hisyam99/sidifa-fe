import { component$, Slot } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useCheckRole } from "~/hooks/useCheckRole";
import { NavigationAdmin } from "~/components/layout";
import { Breadcrumbs } from "~/components/layout/Breadcrumbs";
import {
  LuBarChart,
  LuHome,
  LuUser,
  LuUsers,
  LuBuilding,
  LuKey,
} from "@qwikest/icons/lucide";

export default component$(() => {
  const location = useLocation();

  useCheckRole(["admin"]);

  const menuItems = [
    { href: "/admin/", label: "Dashboard", icon: LuHome },
    { href: "/admin/verifikasi-akun/", label: "Verifikasi Akun", icon: LuKey },
    {
      href: "/admin/manajemen-posyandu/",
      label: "Manajemen Posyandu",
      icon: LuBuilding,
    },
    {
      href: "/admin/manajemen-psikolog/",
      label: "Manajemen Psikolog",
      icon: LuUser,
    },
    {
      href: "/admin/manajemen-pengguna/",
      label: "Manajemen Pengguna",
      icon: LuUsers,
    },
  ];

  return (
    <div>
      <NavigationAdmin />
      <div class="min-h-screen bg-base-200/60">
        <div class="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
          <div class="drawer-content flex flex-col p-4 md:p-8">
            <label
              for="my-drawer-2"
              class="btn btn-primary drawer-button lg:hidden mb-4 self-start"
            >
              <LuBarChart />
              Buka Menu
            </label>
            <Breadcrumbs />
            <main class="bg-base-100 p-6 rounded-2xl shadow-lg">
              <Slot />
            </main>
          </div>
          <aside class="drawer-side">
            <label
              for="my-drawer-2"
              aria-label="close sidebar"
              class="drawer-overlay"
            ></label>
            <ul class="menu p-4 w-80 min-h-full bg-base-100 lg:bg-transparent text-base-content">
              <li class="text-xl font-bold p-4 hidden lg:block">
                Si-DIFA Admin
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
    </div>
  );
});
