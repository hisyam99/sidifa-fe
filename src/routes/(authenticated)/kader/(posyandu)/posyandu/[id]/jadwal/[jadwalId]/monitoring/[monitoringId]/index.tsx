import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { monitoringIBKService } from "~/services/monitoring-ibk.service";
import type { MonitoringIBKItem } from "~/types";
import {
  LuAlertCircle,
  LuCalendar,
  LuMapPin,
  LuClipboardList,
  LuActivity,
  LuTrendingUp,
  LuCheckCircle,
  LuInfo,
} from "~/components/icons/lucide-optimized";
import { ibkService } from "~/services/api";
import { IBKDetailView } from "~/components/ibk/IBKDetailView";

export default component$(() => {
  const loc = useLocation();
  const id = loc.params.monitoringId as string;
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const item = useSignal<MonitoringIBKItem | null>(null);
  const ibkLoading = useSignal(false);
  const ibkDetail = useSignal<any | null>(null);
  const ibkAccordionOpen = useSignal(false);

  // Helper function to get monitoring status config
  const getMonitoringStatusConfig = () => {
    return {
      badge: "badge-info",
      cardBg: "bg-gradient-to-br from-info/5 to-info/10",
      borderColor: "border-info/20",
      icon: LuActivity,
      iconColor: "text-info",
      text: "Monitoring Aktif",
    };
  };

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

  const loadIbkDetail = $(async () => {
    if (ibkLoading.value || ibkDetail.value) return;
    const ibkId = item.value?.ibk_id;
    if (!ibkId) return;
    ibkLoading.value = true;
    try {
      const ibkRes = await ibkService.getIbkDetail(ibkId);
      ibkDetail.value = ibkRes?.data || ibkRes;
    } finally {
      ibkLoading.value = false;
    }
  });

  // If accordion is already open when item arrives, fetch details
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => item.value?.ibk_id);
    track(() => ibkAccordionOpen.value);
    if (ibkAccordionOpen.value && item.value?.ibk_id && !ibkDetail.value) {
      loadIbkDetail();
    }
  });

  return (
    <div class="w-full max-w-5xl">
      {/* Header */}
      <div class="mb-4">
        <div class="mb-3 flex items-center gap-2">
          <h1 class="text-3xl font-bold">Detail Monitoring IBK</h1>
        </div>

        {/* Back button */}
        <div class="flex justify-start">
          <a
            href={`/kader/posyandu/${loc.params.id}/jadwal/${loc.params.jadwalId}/monitoring`}
            class="btn btn-ghost btn-sm gap-2 hover:btn-primary transition-all duration-300"
          >
            ← Kembali ke Monitoring
          </a>
        </div>
      </div>

      {loading.value && (
        <div class="flex justify-center items-center h-40">
          <div class="text-center">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="text-base-content/60 mt-4">Memuat detail monitoring...</p>
          </div>
        </div>
      )}

      {error.value && (
        <div class="alert alert-error shadow-lg">
          <LuAlertCircle class="w-6 h-6" />
          <span class="font-medium">{error.value}</span>
        </div>
      )}

      {item.value && (
        <>
          {/* Enhanced Monitoring Card */}
          <div
            class={`card ${getMonitoringStatusConfig().cardBg} border-2 ${getMonitoringStatusConfig().borderColor} overflow-hidden mb-4`}
          >
            {/* Card Header with Status */}
            <div class="card-body p-0">
              <div class="bg-base-100/50 backdrop-blur-sm p-3 border-b border-base-200">
                <div class="flex flex-col lg:flex-row items-center justify-between gap-2">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-info to-info-content text-info-content flex items-center justify-center">
                      <LuActivity class="w-6 h-6" />
                    </div>
                    <div class="text-center lg:text-left">
                      <h2 class="text-xl font-bold text-base-content">
                        {item.value.ibk?.nama || item.value.ibk_id || "-"}
                      </h2>
                      <p class="text-base-content/60">
                        Kunjungan:{" "}
                        {item.value.tanggal_kunjungan?.substring(0, 10) || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div class="flex items-center gap-2">
                    <LuActivity class="w-5 h-5 text-info" />
                    <div class="badge badge-info font-semibold">
                      Monitoring Aktif
                    </div>
                  </div>
                </div>
              </div>

              {/* Monitoring Information */}
              <div class="p-3">
                <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
                  <LuClipboardList class="w-5 h-5 text-primary" />
                  Informasi Monitoring
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Left Column */}
                  <div class="space-y-3">
                    {/* Keluhan */}
                    <div class="bg-warning/5 border border-warning/20 rounded-lg p-3">
                      <div class="flex items-center gap-2 mb-1">
                        <LuAlertCircle class="w-5 h-5 text-warning" />
                        <h4 class="font-semibold text-warning">Keluhan</h4>
                      </div>
                      <p class="text-sm text-base-content break-words">
                        {item.value.keluhan || "Tidak ada keluhan"}
                      </p>
                    </div>

                    {/* Perilaku Baru */}
                    <div class="bg-success/5 border border-success/20 rounded-lg p-3">
                      <div class="flex items-center gap-2 mb-1">
                        <LuTrendingUp class="w-5 h-5 text-success" />
                        <h4 class="font-semibold text-success">
                          Perilaku Baru
                        </h4>
                      </div>
                      <p class="text-sm text-base-content break-words">
                        {item.value.perilaku_baru ||
                          "Belum ada perubahan perilaku"}
                      </p>
                    </div>

                    {/* Tindak Lanjut */}
                    <div class="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <div class="flex items-center gap-2 mb-1">
                        <LuCheckCircle class="w-5 h-5 text-primary" />
                        <h4 class="font-semibold text-primary">
                          Tindak Lanjut
                        </h4>
                      </div>
                      <p class="text-sm text-base-content break-words">
                        {item.value.tindak_lanjut || "Belum ada tindak lanjut"}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div class="space-y-3">
                    {/* Info Lokasi */}
                    <div class="bg-base-200/50 rounded-lg p-3 flex items-center gap-3">
                      <div class="stat-figure text-accent">
                        <LuMapPin class="w-5 h-5" />
                      </div>
                      <div>
                        <div class="text-xs text-base-content/60">
                          Lokasi Kunjungan
                        </div>
                        <div class="text-sm font-bold text-base-content break-words overflow-hidden text-ellipsis">
                          {item.value.jadwal_posyandu?.lokasi || "-"}
                        </div>
                      </div>
                    </div>

                    {/* Info Kecamatan */}
                    <div class="bg-base-200/50 rounded-lg p-3 flex items-center gap-3">
                      <div class="stat-figure text-secondary">
                        <LuMapPin class="w-5 h-5" />
                      </div>
                      <div>
                        <div class="text-xs text-base-content/60">
                          Kecamatan
                        </div>
                        <div class="text-sm font-bold text-base-content">
                          {item.value.kecamatan || "-"}
                        </div>
                      </div>
                    </div>

                    {/* Info Tanggal */}
                    <div class="bg-base-200/50 rounded-lg p-3 flex items-center gap-3">
                      <div class="stat-figure text-primary">
                        <LuCalendar class="w-5 h-5" />
                      </div>
                      <div>
                        <div class="text-xs text-base-content/60">
                          Tanggal Kunjungan
                        </div>
                        <div class="text-sm font-bold text-base-content">
                          {item.value.tanggal_kunjungan?.substring(0, 10) ||
                            "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keterangan Tambahan */}
                {item.value.keterangan && (
                  <div class="mt-3 p-3 bg-base-200/30 border border-base-300 rounded-lg">
                    <div class="flex items-center gap-2 mb-1">
                      <LuInfo class="w-5 h-5 text-base-content/60" />
                      <h4 class="font-semibold text-base-content/80">
                        Keterangan Tambahan
                      </h4>
                    </div>
                    <p class="text-sm text-base-content break-words">
                      {item.value.keterangan}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* IBK Detail Accordion */}
          <div class="collapse collapse-arrow bg-base-100 border border-base-300">
            <input
              type="checkbox"
              checked={ibkAccordionOpen.value}
              onChange$={(e) => {
                const checked = (e.target as HTMLInputElement).checked;
                ibkAccordionOpen.value = checked;
                if (checked) loadIbkDetail();
              }}
              aria-label="Toggle detail IBK"
            />
            <div class="collapse-title text-lg font-semibold">
              Detail Data IBK
            </div>
            <div class="collapse-content">
              {ibkLoading.value && (
                <div class="flex justify-center items-center h-20 my-4">
                  <div class="text-center">
                    <span class="loading loading-spinner loading-lg text-primary"></span>
                    <p class="text-base-content/60 mt-4">
                      Memuat detail IBK...
                    </p>
                  </div>
                </div>
              )}
              {!ibkLoading.value && ibkDetail.value && (
                <div class="py-2">
                  <IBKDetailView data={ibkDetail.value} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
});
