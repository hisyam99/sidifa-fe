import { component$, Slot } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { useCheckRole } from "~/hooks/useCheckRole";
import { ProfileOverviewCard, SidebarStatCard } from "~/components/dashboard";

export default component$(() => {
  useCheckRole(["kader"]);
  const { user } = useAuth();

  // Placeholder stats
  const stats = [
    { label: "Posyandu", value: 3 },
    { label: "Lowongan", value: 2 },
  ];

  return (
    <div class="min-h-screen bg-base-200/60">
      <main>
        <div class="flex flex-col lg:flex-row gap-8">
          {/* Sidebar kiri */}
          <aside class="w-full lg:w-1/4 flex flex-col gap-4">
            <ProfileOverviewCard
              userName={user.value?.email || "Kader"}
              userRole={user.value?.role}
              userEmail={user.value?.email || ""}
            />
            <div class="card bg-base-100 shadow p-4">
              <div class="font-semibold mb-2">Statistik</div>
              <div class="flex flex-col gap-2">
                {stats.map((s) => (
                  <SidebarStatCard
                    key={s.label}
                    label={s.label}
                    value={s.value}
                  />
                ))}
              </div>
            </div>
            <a
              href="/dashboard/profile"
              class="btn btn-outline btn-primary btn-sm mt-4 w-full"
            >
              Edit Profil
            </a>
          </aside>
          {/* Konten utama */}
          <div class="flex-1">
            <Slot />
          </div>
        </div>
      </main>
    </div>
  );
});
