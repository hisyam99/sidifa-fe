import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
  QRL,
} from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { jadwalPosyanduService } from "~/services/jadwal-posyandu.service";
import type { JadwalPosyanduItem, PresensiStatus } from "~/types";
import {
  LuCalendar,
  LuMapPin,
  LuClock,
  LuFileText,
  LuUser,
  LuBuilding,
  LuClipboardList,
  LuTrendingUp,
  LuUsers,
  LuAlertCircle,
  LuBarChart,
} from "~/components/icons/lucide-optimized";
import { usePresensiIBK } from "~/hooks/usePresensiIBK";
import { PresensiIBKTable } from "~/components/posyandu/presensi/PresensiIBKTable";
import { PaginationControls } from "~/components/common/PaginationControls";
import { useMonitoringIBK } from "~/hooks/useMonitoringIBK";
import { MonitoringIBKTable } from "~/components/posyandu/monitoring/MonitoringIBKTable";
import { MonitoringIBKForm } from "~/components/posyandu/monitoring/MonitoringIBKForm";

function mapApiToJadwalItem(apiData: any): JadwalPosyanduItem {
  return {
    id: apiData.id,
    posyandu_id: apiData.posyandu_id,
    nama_kegiatan: apiData.nama_kegiatan,
    jenis_kegiatan: apiData.jenis_kegiatan,
    deskripsi: apiData.deskripsi,
    lokasi: apiData.lokasi,
    tanggal: apiData.tanggal,
    waktu_mulai: apiData.waktu_mulai,
    waktu_selesai: apiData.waktu_selesai,
    file_url: apiData.file_name ? `/uploads/${apiData.file_name}` : undefined,
    created_at: apiData.created_at,
    updated_at: apiData.updated_at,
    posyandu: apiData.posyandu || undefined,
  };
}

export default component$(() => {
  const location = useLocation();
  const nav = useNavigate();
  const jadwalId = location.params.jadwalId as string;
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const jadwal = useSignal<JadwalPosyanduItem | null>(null);
  const activeTab = useSignal<"monitoring" | "presensi">(
    location.url.pathname.includes("/presensi") ? "presensi" : "monitoring",
  );
  const monitoringShowForm = useSignal(false);
  const monitoringEditId = useSignal<string | null>(null);

  // Presensi state (embedded)
  const {
    list: presensiList,
    total: presensiTotal,
    page: presensiPage,
    limit: presensiLimit,
    totalPage: presensiTotalPage,
    loading: presensiLoading,
    error: presensiError,
    success: presensiSuccess,
    fetchList: fetchPresensi,
    updateStatus,
    setPage: setPresensiPage,
  } = usePresensiIBK({ jadwalId });

  const {
    list: monitoringList,
    total: monitoringTotal,
    page: monitoringPage,
    limit: monitoringLimit,
    totalPage: monitoringTotalPage,
    loading: monitoringLoading,
    error: monitoringError,
    success: monitoringSuccess,
    selected: monitoringSelected,
    fetchList: fetchMonitoring,
    fetchDetail: fetchMonitoringDetail,
    createItem: createMonitoring,
    updateItem: updateMonitoring,
    setPage: setMonitoringPage,
  } = useMonitoringIBK({ jadwalId });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    loading.value = true;
    error.value = null;
    try {
      const apiData = await jadwalPosyanduService.getJadwalDetail(jadwalId);
      const data = apiData.data || apiData;
      jadwal.value = mapApiToJadwalItem(data);
    } catch (err: any) {
      error.value = err.message || "Gagal memuat detail jadwal posyandu.";
    } finally {
      loading.value = false;
    }
  });

  const handlePresensiDetail: QRL<(id: string) => void> = $((id: string) => {
    nav(
      `/kader/posyandu/${location.params.id}/jadwal/${location.params.jadwalId}/presensi/${id}`,
    );
  });

  const handleUpdateStatus = $((id: string, status: PresensiStatus) => {
    return updateStatus(id, status);
  });

  const handleMonitoringCreate = $(async (data: any) => {
    await createMonitoring({ ...data, jadwal_posyandu_id: jadwalId });
    monitoringShowForm.value = false;
  });

  const handleMonitoringEdit: QRL<(id: string) => void> = $(
    async (id: string) => {
      monitoringEditId.value = id;
      await fetchMonitoringDetail(id);
      monitoringShowForm.value = true;
    },
  );

  const handleMonitoringUpdate = $(async (data: any) => {
    if (monitoringEditId.value) {
      await updateMonitoring(monitoringEditId.value, {
        ...data,
        jadwal_posyandu_id: jadwalId,
      });
      monitoringEditId.value = null;
      monitoringShowForm.value = false;
    }
  });

  // Load presensi when tab opened
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => activeTab.value);
    if (activeTab.value === "presensi") {
      fetchPresensi();
    }
  });

  // Load monitoring when tab opened
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => activeTab.value);
    if (activeTab.value === "monitoring") {
      fetchMonitoring();
    }
  });

  return (
    <div class="mx-auto w-full">
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 class="text-3xl font-bold flex items-center gap-2">
          <LuClipboardList class="w-8 h-8 text-primary" /> Jadwal Posyandu
          Detail
        </h1>
        {jadwal.value && (
          <span class="badge badge-lg badge-primary text-base-100 font-semibold px-4 py-2 shadow">
            {jadwal.value.nama_kegiatan}
          </span>
        )}
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
      {jadwal.value && (
        <div class="card bg-base-100 shadow-xl p-0 overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Info utama */}
            <div class="p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-base-200">
              <div class="flex items-center gap-3">
                <LuUser class="w-6 h-6 text-primary" />
                <span class="font-semibold">Jenis Kegiatan:</span>
                <span class="badge badge-outline badge-info text-info-content ml-2">
                  {jadwal.value.jenis_kegiatan}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <LuCalendar class="w-6 h-6 text-primary" />
                <span class="font-semibold">Tanggal:</span>
                <span class="ml-2">
                  {jadwal.value.tanggal?.substring(0, 10)}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <LuClock class="w-6 h-6 text-primary" />
                <span class="font-semibold">Waktu:</span>
                <span class="ml-2">
                  {jadwal.value.waktu_mulai} - {jadwal.value.waktu_selesai}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <LuMapPin class="w-6 h-6 text-primary" />
                <span class="font-semibold">Lokasi:</span>
                <span class="ml-2">{jadwal.value.lokasi}</span>
              </div>
              {jadwal.value.file_url && (
                <div class="flex items-center gap-3">
                  <LuFileText class="w-6 h-6 text-primary" />
                  <span class="font-semibold">File:</span>
                  <a
                    href={jadwal.value.file_url}
                    target="_blank"
                    class="link link-primary underline ml-2"
                  >
                    Lihat File
                  </a>
                </div>
              )}
              <div class="flex items-center gap-3">
                <LuTrendingUp class="w-6 h-6 text-primary" />
                <span class="font-semibold">Dibuat:</span>
                <span class="ml-2">{jadwal.value.created_at}</span>
              </div>
              <div class="flex items-center gap-3">
                <LuTrendingUp class="w-6 h-6 text-primary" />
                <span class="font-semibold">Diupdate:</span>
                <span class="ml-2">{jadwal.value.updated_at || "-"}</span>
              </div>
            </div>
            {/* Deskripsi & Posyandu */}
            <div class="p-6 flex flex-col gap-6">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <LuClipboardList class="w-5 h-5 text-primary" />
                  <span class="font-semibold">Deskripsi Kegiatan</span>
                </div>
                <div class="bg-base-200 rounded p-3 text-base-content/80">
                  {jadwal.value.deskripsi}
                </div>
              </div>
              {jadwal.value.posyandu && (
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <LuBuilding class="w-5 h-5 text-primary" />
                    <span class="font-semibold">Info Posyandu</span>
                  </div>
                  <div class="bg-base-200 rounded p-3 flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <LuUsers class="w-4 h-4 text-info" />
                      <span class="font-medium">
                        {jadwal.value.posyandu.nama_posyandu}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <LuMapPin class="w-4 h-4 text-info" />
                      <span>{jadwal.value.posyandu.alamat}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Tabs Section */}
      <div id="jadwal-tabs" class="mt-8">
        <div role="tablist" class="tabs tabs-lifted">
          <a
            role="tab"
            class={`tab ${activeTab.value === "monitoring" ? "tab-active" : ""}`}
            onClick$={() => {
              activeTab.value = "monitoring";
              nav(
                `/kader/posyandu/${location.params.id}/jadwal/${location.params.jadwalId}#jadwal-tabs`,
              );
            }}
          >
            <span class="flex items-center gap-2">
              <LuBarChart class="w-4 h-4" /> Monitoring
            </span>
          </a>
          <a
            role="tab"
            class={`tab ${activeTab.value === "presensi" ? "tab-active" : ""}`}
            onClick$={() => {
              activeTab.value = "presensi";
              nav(
                `/kader/posyandu/${location.params.id}/jadwal/${location.params.jadwalId}/presensi#jadwal-tabs`,
              );
            }}
          >
            <span class="flex items-center gap-2">
              <LuCalendar class="w-4 h-4" /> Presensi
            </span>
          </a>
        </div>
        <div class="border border-base-300 rounded-b-box bg-base-100 p-4">
          {activeTab.value === "monitoring" && (
            <div class="flex flex-col gap-4">
              {monitoringError.value && (
                <div class="alert alert-error">{monitoringError.value}</div>
              )}
              {monitoringSuccess.value && (
                <div class="alert alert-success">{monitoringSuccess.value}</div>
              )}
              <div class="flex items-end gap-4 flex-wrap">
                <div>
                  <label class="label">
                    <span class="label-text">Tampilkan per halaman</span>
                  </label>
                  <select
                    class="select select-bordered"
                    value={monitoringLimit.value}
                    onChange$={(e) => {
                      monitoringLimit.value = Number(
                        (e.target as HTMLSelectElement).value,
                      );
                      fetchMonitoring({
                        page: 1,
                        limit: monitoringLimit.value,
                      });
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <button
                  class="btn btn-primary"
                  onClick$={() => {
                    monitoringShowForm.value = true;
                    monitoringEditId.value = null;
                  }}
                >
                  Tambah Monitoring
                </button>
              </div>
              <MonitoringIBKTable
                items={monitoringList}
                loading={monitoringLoading.value}
                onDetail$={$((id: string) =>
                  nav(
                    `/kader/posyandu/${location.params.id}/jadwal/${location.params.jadwalId}/monitoring/${id}`,
                  ),
                )}
                onEdit$={handleMonitoringEdit}
              />
              <PaginationControls
                meta={{
                  totalData: monitoringTotal.value,
                  totalPage: monitoringTotalPage.value,
                  currentPage: monitoringPage.value,
                  limit: monitoringLimit.value,
                }}
                currentPage={monitoringPage.value}
                onPageChange$={$((newPage: number) =>
                  setMonitoringPage(newPage),
                )}
              />

              {monitoringShowForm.value && (
                <div class="modal modal-open">
                  <div class="modal-box max-w-2xl">
                    <button
                      class="btn btn-sm btn-circle absolute right-2 top-2"
                      onClick$={() => {
                        monitoringShowForm.value = false;
                        monitoringEditId.value = null;
                      }}
                    >
                      ✕
                    </button>
                    <MonitoringIBKForm
                      initialData={
                        monitoringEditId.value
                          ? {
                              ...(monitoringSelected.value || {}),
                              jadwal_posyandu_id: jadwalId,
                              posyandu_id: location.params.id as string,
                            }
                          : {
                              jadwal_posyandu_id: jadwalId,
                              posyandu_id: location.params.id as string,
                            }
                      }
                      onSubmit$={
                        monitoringEditId.value
                          ? handleMonitoringUpdate
                          : handleMonitoringCreate
                      }
                      loading={monitoringLoading.value}
                      submitButtonText={
                        monitoringEditId.value
                          ? "Update Monitoring"
                          : "Simpan Monitoring"
                      }
                      isEditing={!!monitoringEditId.value}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab.value === "presensi" && (
            <div class="flex flex-col gap-4">
              {presensiError.value && (
                <div class="alert alert-error">{presensiError.value}</div>
              )}
              {presensiSuccess.value && (
                <div class="alert alert-success">{presensiSuccess.value}</div>
              )}
              <div class="flex items-end gap-4 flex-wrap">
                <div>
                  <label class="label">
                    <span class="label-text">Tampilkan per halaman</span>
                  </label>
                  <select
                    class="select select-bordered"
                    value={presensiLimit.value}
                    onChange$={(e) => {
                      presensiLimit.value = Number(
                        (e.target as HTMLSelectElement).value,
                      );
                      fetchPresensi({ page: 1, limit: presensiLimit.value });
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
              <PresensiIBKTable
                items={presensiList}
                loading={presensiLoading.value}
                onDetail$={handlePresensiDetail}
                onUpdateStatus$={handleUpdateStatus}
              />
              <PaginationControls
                meta={{
                  totalData: presensiTotal.value,
                  totalPage: presensiTotalPage.value,
                  currentPage: presensiPage.value,
                  limit: presensiLimit.value,
                }}
                currentPage={presensiPage.value}
                onPageChange$={$((newPage: number) => setPresensiPage(newPage))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
