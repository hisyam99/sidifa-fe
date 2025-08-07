import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { presensiIBKService } from "~/services/presensi-ibk.service";
import type { PresensiIBKItem } from "~/types";
import {
  LuAlertCircle,
  LuCalendar,
  LuClock,
  LuMapPin,
  LuUser,
} from "~/components/icons/lucide-optimized";

export default component$(() => {
  const loc = useLocation();
  const presensiId = loc.params.presensiId as string;
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const item = useSignal<PresensiIBKItem | null>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await presensiIBKService.detail(presensiId);
      item.value = res.data || (res as any);
    } catch (err: any) {
      error.value = err?.message || "Gagal memuat detail presensi.";
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="mx-auto w-full">
      <div class="mb-6 flex items-center gap-2">
        <h1 class="text-3xl font-bold">Detail Presensi IBK</h1>
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
                <span class="ml-2">{item.value.ibk?.nama || "-"}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-semibold">NIK:</span>
                <span class="ml-2">{item.value.ibk?.nik || "-"}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-semibold">Status:</span>
                <span class="ml-2">
                  {item.value.status_presensi || "BELUM_HADIR"}
                </span>
              </div>
            </div>
            <div class="p-6 flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <LuCalendar class="w-6 h-6 text-primary" />
                <span class="font-semibold">Tanggal:</span>
                <span class="ml-2">
                  {item.value.jadwal_posyandu?.tanggal?.substring(0, 10)}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <LuClock class="w-6 h-6 text-primary" />
                <span class="font-semibold">Waktu:</span>
                <span class="ml-2">
                  {item.value.jadwal_posyandu?.waktu_mulai} -{" "}
                  {item.value.jadwal_posyandu?.waktu_selesai}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <LuMapPin class="w-6 h-6 text-primary" />
                <span class="font-semibold">Lokasi:</span>
                <span class="ml-2">{item.value.jadwal_posyandu?.lokasi}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
