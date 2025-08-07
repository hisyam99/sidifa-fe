import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { monitoringIBKService } from "~/services/monitoring-ibk.service";
import type { MonitoringIBKItem } from "~/types";
import {
  LuAlertCircle,
  LuCalendar,
  LuMapPin,
  LuUser,
} from "~/components/icons/lucide-optimized";

export default component$(() => {
  const loc = useLocation();
  const id = loc.params.monitoringId as string;
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const item = useSignal<MonitoringIBKItem | null>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await monitoringIBKService.detail(id);
      item.value = res.data || (res as any);
    } catch (err: any) {
      error.value = err?.message || "Gagal memuat detail monitoring.";
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="mx-auto w-full">
      <div class="mb-6 flex items-center gap-2">
        <h1 class="text-3xl font-bold">Detail Monitoring IBK</h1>
      </div>

      {loading.value && (
        <div class="flex justify-center items-center h-40">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
      {error.value && (
        <div class="alert alert-error flex items-center gap-2">
          <LuAlertCircle class="w-6 h-6" /> {error.value}
        </div>
      )}

      {item.value && (
        <div class="card bg-base-100 shadow-xl p-0 overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <div class="p-6 flex flex-col gap-3 border-b md:border-b-0 md:border-r border-base-200">
              <div class="flex items-center gap-3">
                <LuUser class="w-6 h-6 text-primary" />
                <span class="font-semibold">Nama:</span>
                <span class="ml-2">
                  {item.value.ibk?.nama || item.value.ibk_id}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-semibold">Kecamatan:</span>
                <span class="ml-2">{item.value.kecamatan}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-semibold">Keluhan:</span>
                <span class="ml-2">{item.value.keluhan}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-semibold">Perilaku Baru:</span>
                <span class="ml-2">{item.value.perilaku_baru}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-semibold">Tindak Lanjut:</span>
                <span class="ml-2">{item.value.tindak_lanjut}</span>
              </div>
            </div>
            <div class="p-6 flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <LuCalendar class="w-6 h-6 text-primary" />
                <span class="font-semibold">Tanggal Kunjungan:</span>
                <span class="ml-2">
                  {item.value.tanggal_kunjungan?.substring(0, 10)}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <LuMapPin class="w-6 h-6 text-primary" />
                <span class="font-semibold">Lokasi:</span>
                <span class="ml-2">
                  {item.value.jadwal_posyandu?.lokasi || "-"}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-semibold">Keterangan:</span>
                <span class="ml-2">{item.value.keterangan || "-"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
