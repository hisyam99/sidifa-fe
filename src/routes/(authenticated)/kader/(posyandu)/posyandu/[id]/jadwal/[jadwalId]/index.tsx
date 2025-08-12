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
  LuBuilding,
  LuClipboardList,
  LuTrendingUp,
  LuUsers,
  LuAlertCircle,
  LuBarChart,
  LuCheckCircle,
  LuDownload,
  LuUser,
} from "~/components/icons/lucide-optimized";
import { usePresensiIBK } from "~/hooks/usePresensiIBK";
import { PresensiIBKTable } from "~/components/posyandu/presensi/PresensiIBKTable";
import { PaginationControls } from "~/components/common/PaginationControls";
import { useMonitoringIBK } from "~/hooks/useMonitoringIBK";
import { MonitoringIBKTable } from "~/components/posyandu/monitoring/MonitoringIBKTable";
import { MonitoringIBKForm } from "~/components/posyandu/monitoring/MonitoringIBKForm";
import { IBKSearchSelect } from "~/components/posyandu/monitoring/IBKSearchSelect";
import { buildJadwalPosyanduUrl } from "~/utils/url";

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
    file_url: buildJadwalPosyanduUrl(apiData.file_name || apiData.file_url),
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
    // Prefer hash (#tab=presensi) to avoid full route nav; fallback to path
    (location.url.hash || "").includes("tab=presensi")
      ? "presensi"
      : location.url.pathname.includes("/presensi")
        ? "presensi"
        : "monitoring",
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
    bulkUpdateStatus,
    setPage: setPresensiPage,
    addToPresensi,
  } = usePresensiIBK({ jadwalId });

  const presensiAddOpen = useSignal(false);

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
    deleteItem: deleteMonitoring,
    setPage: setMonitoringPage,
  } = useMonitoringIBK({ jadwalId });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    (async () => {
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
    })();
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

  const handleMonitoringDelete = $(async (id: string) => {
    if (
      confirm(
        "Yakin ingin menghapus monitoring ini? Tindakan ini tidak dapat dibatalkan.",
      )
    ) {
      await deleteMonitoring(id);
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

  // Sync tab with hash changes (back/forward)
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const handler = () => {
      activeTab.value = (location.url.hash || "").includes("tab=presensi")
        ? "presensi"
        : "monitoring";
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  });

  // Ensure when opening /presensi path, the Presensi tab is active and focused
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const isPresensiPath = location.url.pathname.includes("/presensi");
    const isPresensiHash = (location.url.hash || "").includes("tab=presensi");
    if (isPresensiPath || isPresensiHash) {
      activeTab.value = "presensi";
      if (!isPresensiHash) {
        // Update hash without reloading
        window.history.replaceState(null, "", "#tab=presensi");
      }
      // Focus and scroll to tabs container
      setTimeout(() => {
        document.getElementById("tab-presensi")?.focus();
        document
          .getElementById("jadwal-tabs")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  });

  return (
    <div class="w-full max-w-[1200px]">
      {/* Back button to Jadwal List */}
      <div class="mb-4">
        <a
          href={`/kader/posyandu/${location.params.id}/jadwal`}
          class="btn btn-ghost btn-sm gap-2 hover:btn-primary transition-all duration-300"
        >
          ← Kembali ke Jadwal
        </a>
      </div>

      {loading.value && (
        <div class="flex justify-center items-center h-40">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
      {error.value && (
        <div class="alert alert-error flex items-center gap-2 mb-3">
          <LuAlertCircle class="w-6 h-6" /> {error.value}
        </div>
      )}

      {jadwal.value && (
        <>
          {/* Enhanced Jadwal Card */}
          <div class="card bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 overflow-hidden mb-4">
            {/* Card Header with Event Info */}
            <div class="card-body p-0">
              <div class="bg-base-100/50 backdrop-blur-sm p-3 border-b border-base-200">
                <div class="flex flex-col lg:flex-row items-center justify-between gap-2">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-focus text-primary-content flex items-center justify-center">
                      <LuCalendar class="w-6 h-6" />
                    </div>
                    <div class="text-center lg:text-left">
                      <h2 class="text-xl font-bold text-base-content">
                        {jadwal.value.nama_kegiatan}
                      </h2>
                      <div class="flex flex-wrap gap-2 justify-center lg:justify-start">
                        <div class="badge badge-primary badge-sm font-semibold">
                          {jadwal.value.jenis_kegiatan}
                        </div>
                        <div class="badge badge-outline badge-sm">
                          {jadwal.value.tanggal?.substring(0, 10)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div class="flex items-center gap-2">
                    <LuCheckCircle class="w-5 h-5 text-success" />
                    <div class="badge badge-success font-semibold">
                      Terjadwal
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Stats */}
              <div class="p-3">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  {/* Tanggal & Waktu */}
                  <div class="bg-base-200/50 rounded-lg p-2 flex items-center gap-2">
                    <div class="text-primary">
                      <LuClock class="w-4 h-4" />
                    </div>
                    <div>
                      <div class="text-xs text-base-content/60">Waktu</div>
                      <div class="text-sm font-bold text-base-content">
                        {jadwal.value.waktu_mulai} -{" "}
                        {jadwal.value.waktu_selesai}
                      </div>
                    </div>
                  </div>

                  {/* Lokasi */}
                  <div class="bg-base-200/50 rounded-lg p-2 flex items-center gap-2">
                    <div class="text-accent">
                      <LuMapPin class="w-4 h-4" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-xs text-base-content/60">Lokasi</div>
                      <div class="text-sm font-bold text-base-content truncate">
                        {jadwal.value.lokasi}
                      </div>
                    </div>
                  </div>

                  {/* File Attachment */}
                  <div class="bg-base-200/50 rounded-lg p-2 flex items-center gap-2">
                    <div class="text-secondary">
                      <LuFileText class="w-4 h-4" />
                    </div>
                    <div>
                      <div class="text-xs text-base-content/60">Dokumen</div>
                      {jadwal.value.file_url ? (
                        <a
                          href={buildJadwalPosyanduUrl(jadwal.value.file_url)}
                          target="_blank"
                          class="btn btn-xs btn-primary gap-1"
                        >
                          <LuDownload class="w-3 h-3" />
                          File
                        </a>
                      ) : (
                        <span class="text-xs text-base-content/50">
                          Tidak ada
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Deskripsi Kegiatan */}
                <div class="mb-3">
                  <h4 class="text-sm font-semibold mb-1 flex items-center gap-2 text-base-content/80">
                    <LuClipboardList class="w-4 h-4 text-primary" />
                    Deskripsi Kegiatan
                  </h4>
                  <div class="bg-primary/5 border border-primary/20 rounded-lg p-2">
                    <p class="text-sm text-base-content leading-relaxed break-words">
                      {jadwal.value.deskripsi}
                    </p>
                  </div>
                </div>

                {/* Info Posyandu */}
                {jadwal.value.posyandu && (
                  <div class="mb-3">
                    <h4 class="text-sm font-semibold mb-1 flex items-center gap-2 text-base-content/80">
                      <LuBuilding class="w-4 h-4 text-info" />
                      Informasi Posyandu
                    </h4>
                    <div class="bg-info/5 border border-info/20 rounded-lg p-2">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div class="flex items-center gap-2">
                          <LuUsers class="w-4 h-4 text-info" />
                          <div>
                            <div class="text-xs text-base-content/60">
                              Nama Posyandu
                            </div>
                            <div class="text-sm font-semibold text-base-content">
                              {jadwal.value.posyandu.nama_posyandu}
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <LuMapPin class="w-4 h-4 text-info" />
                          <div>
                            <div class="text-xs text-base-content/60">
                              Alamat
                            </div>
                            <div class="text-sm font-semibold text-base-content break-words">
                              {jadwal.value.posyandu.alamat}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline Info */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div class="flex items-center gap-2 p-2 bg-base-200/30 rounded-lg">
                    <LuTrendingUp class="w-4 h-4 text-success" />
                    <div>
                      <div class="text-xs text-base-content/60">Dibuat</div>
                      <div class="text-sm font-medium text-base-content">
                        {jadwal.value.created_at}
                      </div>
                    </div>
                  </div>
                  {jadwal.value.updated_at && (
                    <div class="flex items-center gap-2 p-2 bg-base-200/30 rounded-lg">
                      <LuTrendingUp class="w-4 h-4 text-warning" />
                      <div>
                        <div class="text-xs text-base-content/60">
                          Terakhir Diupdate
                        </div>
                        <div class="text-sm font-medium text-base-content">
                          {jadwal.value.updated_at}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tabs Section */}
      <div id="jadwal-tabs" class="mt-4">
        <div role="tablist" class="tabs tabs-lifted">
          <a
            role="tab"
            id="tab-monitoring"
            class={`tab ${activeTab.value === "monitoring" ? "tab-active" : ""}`}
            href="#tab=monitoring"
            onClick$={$(() => {
              activeTab.value = "monitoring";
              // Update hash without route reload
              window.history.replaceState(null, "", "#tab=monitoring");
              document
                .getElementById("jadwal-tabs")
                ?.scrollIntoView({ behavior: "smooth" });
            })}
            title="Monitoring"
          >
            <span class="flex items-center gap-2">
              <LuBarChart class="w-4 h-4" /> Monitoring
            </span>
          </a>
          <a
            role="tab"
            id="tab-presensi"
            class={`tab ${activeTab.value === "presensi" ? "tab-active" : ""}`}
            href="#tab=presensi"
            onClick$={$(() => {
              activeTab.value = "presensi";
              // Update hash without route reload
              window.history.replaceState(null, "", "#tab=presensi");
              document
                .getElementById("jadwal-tabs")
                ?.scrollIntoView({ behavior: "smooth" });
            })}
            title="Presensi"
          >
            <span class="flex items-center gap-2">
              <LuCalendar class="w-4 h-4" /> Presensi
            </span>
          </a>
        </div>
        <div class="border border-base-300 rounded-b-box bg-base-100 p-4">
          {activeTab.value === "monitoring" && (
            <div class="space-y-3">
              {monitoringError.value && (
                <div class="alert alert-error text-sm py-2">
                  {monitoringError.value}
                </div>
              )}
              {monitoringSuccess.value && (
                <div class="alert alert-success text-sm py-2">
                  {monitoringSuccess.value}
                </div>
              )}

              {/* Compact Controls */}
              <div class="bg-base-100 border border-base-300 rounded-lg p-3">
                <div class="flex items-center justify-between gap-3 flex-wrap">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-base-content/70">
                      Show:
                    </span>
                    <select
                      class="select select-bordered select-sm w-20"
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
                    </select>
                  </div>
                  <button
                    class="btn btn-primary btn-sm gap-2"
                    onClick$={() => {
                      monitoringShowForm.value = true;
                      monitoringEditId.value = null;
                    }}
                  >
                    <LuBarChart class="w-4 h-4" />
                    Tambah Monitoring
                  </button>
                </div>
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
                onDelete$={handleMonitoringDelete}
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
                <dialog
                  open
                  class="modal modal-bottom sm:modal-middle"
                  onClose$={() => {
                    monitoringShowForm.value = false;
                    monitoringEditId.value = null;
                  }}
                >
                  <div class="modal-box modal-box-overflow-visible max-w-xl">
                    <button
                      class="btn btn-sm btn-circle absolute right-2 top-2"
                      onClick$={() => {
                        monitoringShowForm.value = false;
                        monitoringEditId.value = null;
                      }}
                    >
                      ✕
                    </button>
                    <div class="max-h-[calc(100dvh-4rem)] overflow-y-auto">
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
                  <form method="dialog" class="modal-backdrop">
                    <button
                      onClick$={() => {
                        monitoringShowForm.value = false;
                        monitoringEditId.value = null;
                      }}
                    >
                      close
                    </button>
                  </form>
                </dialog>
              )}
            </div>
          )}

          {activeTab.value === "presensi" && (
            <div class="space-y-3">
              {presensiError.value && (
                <div class="alert alert-error text-sm py-2">
                  {presensiError.value}
                </div>
              )}
              {presensiSuccess.value && (
                <div class="alert alert-success text-sm py-2">
                  {presensiSuccess.value}
                </div>
              )}

              {/* Compact Controls */}
              <div class="bg-base-100 border border-base-300 rounded-lg p-3">
                <div class="flex items-center justify-between gap-3 flex-wrap">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-base-content/70">
                      Show:
                    </span>
                    <select
                      class="select select-bordered select-sm w-20"
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
                    </select>
                  </div>
                  <button
                    class="btn btn-primary btn-sm gap-2"
                    onClick$={() => {
                      presensiAddOpen.value = true;
                    }}
                  >
                    <LuUser class="w-4 h-4" />
                    Tambah IBK
                  </button>
                </div>
              </div>

              <PresensiIBKTable
                items={presensiList}
                loading={presensiLoading.value}
                onDetail$={handlePresensiDetail}
                onUpdateStatus$={handleUpdateStatus}
                onBulkUpdate$={bulkUpdateStatus}
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

              {presensiAddOpen.value && (
                <dialog
                  open
                  class="modal modal-bottom sm:modal-middle"
                  onClose$={() => {
                    presensiAddOpen.value = false;
                  }}
                >
                  <div class="modal-box modal-box-overflow-visible max-w-md">
                    <button
                      class="btn btn-sm btn-circle absolute right-2 top-2"
                      onClick$={() => {
                        presensiAddOpen.value = false;
                      }}
                    >
                      ✕
                    </button>
                    <div class="max-h-[calc(100dvh-4rem)] overflow-y-auto">
                      <h3 class="font-bold text-lg mb-3">
                        Tambah IBK ke Presensi
                      </h3>
                      <div class="space-y-4">
                        <div>
                          <label class="label label-text font-medium mb-1">
                            Pilih IBK
                          </label>
                        </div>
                        <IBKSearchSelect
                          posyanduId={location.params.id as string}
                          jadwalId={location.params.jadwalId as string}
                          targetInputId="presensi-ibk-id"
                          placeholder="Cari nama IBK..."
                        />
                        <input id="presensi-ibk-id" type="hidden" />
                        <button
                          class="btn btn-primary btn-sm w-full gap-2"
                          onClick$={$(() => {
                            const el = document.getElementById(
                              "presensi-ibk-id",
                            ) as HTMLInputElement | null;
                            const idVal = el?.value?.trim();
                            if (idVal) {
                              addToPresensi({ user_ibk_id: idVal });
                              presensiAddOpen.value = false;
                            }
                          })}
                        >
                          <LuUser class="w-4 h-4" />
                          Simpan
                        </button>
                      </div>
                    </div>
                  </div>
                  <form method="dialog" class="modal-backdrop">
                    <button
                      onClick$={() => {
                        presensiAddOpen.value = false;
                      }}
                    >
                      close
                    </button>
                  </form>
                </dialog>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
