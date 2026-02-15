import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { presensiIBKService } from "~/services/presensi-ibk.service";
import type { PresensiIBKItem } from "~/types";
import {
  LuAlertCircle,
  LuCalendar,
  LuClock,
  LuMapPin,
  LuUser,
  LuCheckCircle,
  LuXCircle,
  LuHeart,
  LuUserCheck,
} from "~/components/icons/lucide-optimized";
import { ibkService } from "~/services/api";
import { IBKDetailView } from "~/components/ibk/IBKDetailView";
import type { IBKDetailViewData } from "~/types/ibk";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";

const PRESENSI_KEY_PREFIX = "kader:presensi-ibk";
const IBK_KEY_PREFIX = "kader:ibk";

export default component$(() => {
  const loc = useLocation();
  const presensiId = loc.params.presensiId as string;
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const item = useSignal<PresensiIBKItem | null>(null);
  const ibkLoading = useSignal(false);
  const ibkDetail = useSignal<IBKDetailViewData | null>(null);
  const ibkAccordionOpen = useSignal(false);

  // Helper function to get status styling
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "HADIR":
        return {
          badge: "badge-success",
          cardBg: "bg-gradient-to-br from-success/5 to-success/10",
          borderColor: "border-success/20",
          icon: LuCheckCircle,
          iconColor: "text-success",
          text: "Hadir",
        };
      case "SAKIT":
        return {
          badge: "badge-warning",
          cardBg: "bg-gradient-to-br from-warning/5 to-warning/10",
          borderColor: "border-warning/20",
          icon: LuHeart,
          iconColor: "text-warning",
          text: "Sakit",
        };
      case "IZIN":
        return {
          badge: "badge-info",
          cardBg: "bg-gradient-to-br from-info/5 to-info/10",
          borderColor: "border-info/20",
          icon: LuUserCheck,
          iconColor: "text-info",
          text: "Izin",
        };
      default: // BELUM_HADIR
        return {
          badge: "badge-error",
          cardBg: "bg-gradient-to-br from-error/5 to-error/10",
          borderColor: "border-error/20",
          icon: LuXCircle,
          iconColor: "text-error",
          text: "Belum Hadir",
        };
    }
  };

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    error.value = null;

    const detailKey = queryClient.buildKey(
      PRESENSI_KEY_PREFIX,
      "detail",
      presensiId,
    );

    // Stale-while-revalidate: apply cached data immediately
    const cached = queryClient.getQueryData<PresensiIBKItem>(detailKey);
    if (cached) {
      item.value = cached;
      loading.value = false;

      // If data is still fresh, skip the network request entirely
      if (queryClient.isFresh(detailKey)) return;

      // Background refetch (no loading spinner)
      try {
        const res = await queryClient.fetchQuery(
          detailKey,
          () => presensiIBKService.detail(presensiId),
          DEFAULT_STALE_TIME,
        );
        const detail = res.data;
        queryClient.setQueryData(detailKey, detail, DEFAULT_STALE_TIME);
        item.value = detail;
      } catch (err: unknown) {
        console.error("Background refetch presensi detail failed:", err);
      }
      return;
    }

    // No cached data — show loading spinner
    loading.value = true;
    try {
      const res = await queryClient.fetchQuery(
        detailKey,
        () => presensiIBKService.detail(presensiId),
        DEFAULT_STALE_TIME,
      );
      const detail = res.data;
      queryClient.setQueryData(detailKey, detail, DEFAULT_STALE_TIME);
      item.value = detail;
    } catch (err: unknown) {
      error.value = (err as Error)?.message || "Gagal memuat detail presensi.";
    } finally {
      loading.value = false;
    }
  });

  const loadIbkDetail = $(async () => {
    if (ibkLoading.value || ibkDetail.value) return;
    const ibkId = item.value?.ibk?.id || item.value?.ibk_id;
    if (!ibkId) return;

    const ibkKey = queryClient.buildKey(IBK_KEY_PREFIX, "detail", ibkId);

    // Return cached IBK detail if fresh
    const cached = queryClient.getQueryData<IBKDetailViewData>(ibkKey);
    if (cached && queryClient.isFresh(ibkKey)) {
      ibkDetail.value = cached;
      return;
    }

    ibkLoading.value = true;
    try {
      const ibkRes = await queryClient.fetchQuery(
        ibkKey,
        () => ibkService.getIbkDetail(ibkId),
        DEFAULT_STALE_TIME,
      );
      const detail = ibkRes?.data || ibkRes;
      queryClient.setQueryData(ibkKey, detail, DEFAULT_STALE_TIME);
      ibkDetail.value = detail;
    } catch {
      // Silently handle error - user will see loading state end without data
    } finally {
      ibkLoading.value = false;
    }
  });

  // If accordion is already open when item arrives, fetch details
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => item.value?.ibk?.id || item.value?.ibk_id);
    track(() => ibkAccordionOpen.value);
    const ibkId = item.value?.ibk?.id || item.value?.ibk_id;
    if (ibkAccordionOpen.value && ibkId && !ibkDetail.value) {
      loadIbkDetail();
    }
  });

  return (
    <div class="w-full">
      {/* Header */}
      <div class="mb-4">
        <div class="mb-3 flex items-center gap-2">
          <h1 class="text-3xl font-bold">Detail Presensi IBK</h1>
        </div>

        {/* Back button */}
        <div class="flex justify-start">
          <Link
            href={`/kader/posyandu/${loc.params.id}/jadwal/${loc.params.jadwalId}/presensi`}
            class="btn btn-ghost btn-sm gap-2 hover:btn-primary transition-all duration-300"
          >
            ← Kembali ke Presensi
          </Link>
        </div>
      </div>

      {loading.value && (
        <div class="card bg-gradient-to-br from-primary/5 to-secondary/10 border-2 border-primary/20 overflow-hidden mb-4 animate-pulse">
          <div class="card-body p-0">
            <div class="bg-base-100/50 backdrop-blur-sm p-3 border-b border-base-200">
              <div class="flex flex-col lg:flex-row items-center justify-between gap-2">
                <div class="flex items-center gap-4">
                  <div class="skeleton w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
                  <div class="text-center lg:text-left">
                    <div class="skeleton h-6 w-32 mb-2"></div>
                    <div class="skeleton h-4 w-40"></div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="skeleton w-5 h-5 rounded-full bg-success"></div>
                  <div class="skeleton badge badge-success font-semibold w-20 h-6"></div>
                </div>
              </div>
            </div>
            <div class="p-3">
              <div class="mb-3">
                <div class="flex items-center gap-2 mb-1">
                  <div class="skeleton w-5 h-5"></div>
                  <div class="skeleton h-5 w-32"></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div class="bg-base-200/50 rounded-lg p-3 flex items-center gap-3">
                    <div class="skeleton w-4 h-4"></div>
                    <div>
                      <div class="skeleton h-4 w-16 mb-1"></div>
                      <div class="skeleton h-5 w-24"></div>
                    </div>
                  </div>
                  <div class="bg-base-200/50 rounded-lg p-3 flex items-center gap-3">
                    <div class="skeleton w-4 h-4"></div>
                    <div>
                      <div class="skeleton h-4 w-16 mb-1"></div>
                      <div class="skeleton h-5 w-32"></div>
                    </div>
                  </div>
                  <div class="bg-base-200/50 rounded-lg p-3 flex items-center gap-3">
                    <div class="skeleton w-4 h-4"></div>
                    <div>
                      <div class="skeleton h-4 w-16 mb-1"></div>
                      <div class="skeleton h-5 w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <div class="flex items-center gap-2 mb-1">
                  <div class="skeleton w-4 h-4"></div>
                  <div class="skeleton h-4 w-24"></div>
                </div>
                <div class="bg-primary/5 border border-primary/20 rounded-lg p-2">
                  <div class="skeleton h-5 w-full"></div>
                  <div class="skeleton h-5 w-3/4 mt-2"></div>
                </div>
              </div>
            </div>
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
          {/* Enhanced Presensi Card */}
          <div
            class={`card ${getStatusConfig(item.value.status_presensi || "BELUM_HADIR").cardBg} border-2 ${getStatusConfig(item.value.status_presensi || "BELUM_HADIR").borderColor} overflow-hidden mb-4`}
          >
            {/* Card Header with Status */}
            <div class="card-body p-0">
              <div class="bg-base-100/50 backdrop-blur-sm p-3 border-b border-base-200">
                <div class="flex flex-col lg:flex-row items-center justify-between gap-2">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center">
                      <LuUser class="w-6 h-6" />
                    </div>
                    <div class="text-center lg:text-left">
                      <h2 class="text-xl font-bold text-base-content">
                        {item.value.ibk?.nama ||
                          item.value.ibk_id ||
                          "IBK Tidak Dikenal"}
                      </h2>
                      <p class="text-base-content/60 font-mono">
                        NIK: {item.value.ibk?.nik || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div class="flex items-center gap-2">
                    {(() => {
                      const config = getStatusConfig(
                        item.value.status_presensi || "BELUM_HADIR",
                      );
                      const IconComponent = config.icon;
                      return (
                        <>
                          <IconComponent
                            class={`w-5 h-5 ${config.iconColor}`}
                          />
                          <div class={`badge ${config.badge} font-semibold`}>
                            {config.text}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Jadwal Information */}
              <div class="p-3">
                <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
                  <LuCalendar class="w-5 h-5 text-primary" />
                  Informasi Jadwal
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Tanggal */}
                  <div class="bg-base-200/50 rounded-lg p-3 flex items-center gap-3">
                    <div class="stat-figure text-primary">
                      <LuCalendar class="w-5 h-5" />
                    </div>
                    <div>
                      <div class="text-xs text-base-content/60">Tanggal</div>
                      <div class="text-sm font-bold text-base-content">
                        {item.value.jadwal_posyandu?.tanggal?.substring(
                          0,
                          10,
                        ) || "-"}
                      </div>
                    </div>
                  </div>

                  {/* Waktu */}
                  <div class="bg-base-200/50 rounded-lg p-3 flex items-center gap-3">
                    <div class="stat-figure text-secondary">
                      <LuClock class="w-5 h-5" />
                    </div>
                    <div>
                      <div class="text-xs text-base-content/60">Waktu</div>
                      <div class="text-sm font-bold text-base-content">
                        {item.value.jadwal_posyandu?.waktu_mulai || "-"} -{" "}
                        {item.value.jadwal_posyandu?.waktu_selesai || "-"}
                      </div>
                    </div>
                  </div>

                  {/* Lokasi */}
                  <div class="bg-base-200/50 rounded-lg p-3 flex items-center gap-3">
                    <div class="stat-figure text-accent">
                      <LuMapPin class="w-5 h-5" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-xs text-base-content/60">Lokasi</div>
                      <div class="text-sm font-bold text-base-content break-words overflow-hidden text-ellipsis">
                        {item.value.jadwal_posyandu?.lokasi || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kegiatan Info */}
                {item.value.jadwal_posyandu?.nama_kegiatan && (
                  <div class="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 class="font-semibold text-primary mb-1">
                      Nama Kegiatan
                    </h4>
                    <p class="text-sm text-base-content break-words">
                      {item.value.jadwal_posyandu.nama_kegiatan}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* IBK Detail Accordion */}
          {item.value?.ibk?.id || item.value?.ibk_id ? (
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
                {!ibkLoading.value &&
                  !ibkDetail.value &&
                  ibkAccordionOpen.value && (
                    <div class="alert alert-error">
                      <LuAlertCircle class="w-5 h-5" />
                      <span>Gagal memuat detail IBK</span>
                    </div>
                  )}
              </div>
            </div>
          ) : (
            <div class="alert alert-warning">
              <LuAlertCircle class="w-5 h-5" />
              <span>Tidak ada data IBK yang tersedia untuk ditampilkan</span>
            </div>
          )}
        </>
      )}
    </div>
  );
});
