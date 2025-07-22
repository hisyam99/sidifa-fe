import { component$, $ } from "@qwik.dev/core";
import { useNavigate } from "@qwik.dev/router";
import type { DocumentHead } from "@qwik.dev/router";
import {
  upcomingAppointmentsData,
  handledIBKData,
} from "~/data/psikolog-dashboard-data";
import {
  PsikologDashboardHeader,
  UpcomingAppointmentCard,
  HandledIBKTable,
} from "~/components/psikolog";

export default component$(() => {
  const nav = useNavigate();

  const handleCreateReportClick = $(() => {
    nav("/psikolog/laporan-asesmen");
  });

  const handleViewIBKHistory = $((id: string) => {
    console.log(`Navigating to IBK history for ID: ${id}`);
    // Implement actual navigation to IBK history page
    nav(`/psikolog/pasien/${id}`);
  });

  return (
    <div>
      <PsikologDashboardHeader onButtonClick$={handleCreateReportClick} />

      {/* Jadwal Hari Ini */}
      <div class="mb-8 card bg-base-100 shadow-xl p-6">
        <h2 class="text-2xl font-bold mb-4 card-title">Jadwal Hari Ini</h2>
        <div class="space-y-4">
          {upcomingAppointmentsData.length > 0 ? (
            upcomingAppointmentsData.map((apt) => (
              <UpcomingAppointmentCard key={apt.name} appointment={apt} />
            ))
          ) : (
            <p class="text-center text-base-content/70 py-4">
              Tidak ada jadwal janji temu yang akan datang.
            </p>
          )}
        </div>
      </div>

      {/* Daftar Pasien/IBK */}
      <HandledIBKTable
        ibkList={handledIBKData}
        onViewHistory$={handleViewIBKHistory}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dashboard Psikolog - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Halaman dashboard untuk Psikolog Si-DIFA",
    },
  ],
};
