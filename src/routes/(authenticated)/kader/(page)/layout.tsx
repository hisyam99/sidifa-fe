import { component$, Slot } from "@builder.io/qwik";
import { useAuth } from "~/hooks";

export default component$(() => {
  const { user } = useAuth();
  // Placeholder stats
  const stats = [
    { label: "Posyandu", value: 3 },
    { label: "Lowongan", value: 2 },
  ];

  return (
    <div class="container mx-auto py-8 flex flex-col lg:flex-row gap-8">
      {/* Sidebar kiri */}
      <aside class="w-full lg:w-1/4 flex flex-col gap-4">
        <div class="card bg-base-100 shadow-lg p-4 items-center">
          <div class="avatar mb-2">
            <div class="w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
              {user.value?.email?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <div class="text-center">
            <div class="font-bold">{user.value?.email}</div>
            <div class="badge badge-primary mt-1">Kader</div>
          </div>
          <a
            href="/dashboard/profile"
            class="btn btn-outline btn-primary btn-sm mt-4 w-full"
          >
            Edit Profil
          </a>
        </div>
        <div class="card bg-base-100 shadow p-4">
          <div class="font-semibold mb-2">Statistik</div>
          <div class="flex flex-col gap-2">
            {stats.map((s) => (
              <div class="flex justify-between" key={s.label}>
                <span>{s.label}</span>
                <span class="font-bold text-primary">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
      {/* Konten utama */}
      <main class="flex-1">
        <Slot />
      </main>
    </div>
  );
});
