// File: /sidifa-fev2/src/routes/posyandu/pendataan-ibk/index.tsx

import { component$, useSignal, $, useTask$ } from "@builder.io/qwik";
import { useAuth } from "~/hooks"; // Add this import
import type { DocumentHead } from "@builder.io/qwik-city";
import { IBKTable, LoadingSpinner, Alert } from "~/components/ui";
import { PaginationControls } from "~/components/common";
import type { IBKRecord } from "~/types";
import {
  LuPlus,
  LuActivity,
  // Ensure all necessary icons are imported
} from "~/components/icons/lucide-optimized"; // Changed import source
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { ibkService } from "~/services/api";
import { useDebouncer } from "~/utils/debouncer";

export default component$(() => {
  const search = useSignal("");
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const location = useLocation();
  const page = useSignal(1);
  const limit = useSignal(5);
  const total = useSignal(0);
  const totalPages = useSignal(1);
  const navigate = useNavigate();

  // Search/filter state
  const genderFilter = useSignal("");
  // Modal state
  const showDetailModal = useSignal(false);
  const ibkDetail = useSignal<any>(null);

  const limitOptions = ["5", "10", "20", "50", "100"];

  // Extract posyanduId from route params
  const posyanduId = location.params.id;
  console.log("POSYANDU ID", posyanduId);

  const existingIBK = useSignal<IBKRecord[]>([]);
  const tableRef = useSignal<HTMLDivElement | undefined>(undefined);
  const hasInteracted = useSignal(false);

  const { isLoggedIn } = useAuth(); // Get isLoggedIn

  // Fetch IBK list from backend
  const fetchIbkList = $(async () => {
    if (!isLoggedIn.value || !posyanduId) {
      if (!posyanduId) {
        error.value =
          "ID Posyandu tidak ditemukan. Anda akan diarahkan ke daftar posyandu.";
        setTimeout(() => navigate("/kader/posyandu"), 2000);
        loading.value = false;
      }
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const res = await ibkService.getIbkListByPosyandu({
        posyanduId,
        page: page.value,
        limit: limit.value,
        orderBy: "created_at",
        nama: search.value ? search.value : undefined,
      });
      existingIBK.value = (res.data || []).map((item: any) => ({
        personal_data: {
          id: item.id,
          nama_lengkap: item.nama,
          nik: String(item.nik),
          tempat_lahir: "-", // not provided
          tanggal_lahir: "", // not provided
          gender:
            item.jenis_kelamin?.toLowerCase() === "laki-laki"
              ? "laki-laki"
              : "perempuan",
          agama: "", // not provided
          alamat_lengkap: item.alamat,
          rt_rw: "", // not provided
          kecamatan: "", // not provided
          kabupaten: "", // not provided
          provinsi: "", // not provided
          kode_pos: "", // not provided
          no_telp: "", // not provided
          nama_ayah: "", // not provided
          nama_ibu: "", // not provided
          created_at: item.created_at,
          updated_at: item.updated_at || "",
        },
        disability_info: undefined,
        visit_history: [],
        posyandu_id: posyanduId,
        status: "active", // or use item.status if available
        total_kunjungan: 0,
        last_visit: undefined,
        next_scheduled_visit: undefined,
      }));
      total.value = res.meta?.totalData || 0;
      totalPages.value = res.meta?.totalPage || 1;
      console.log(
        "IBK meta:",
        res.meta,
        "total:",
        total.value,
        "totalPages:",
        totalPages.value,
        "limit:",
        limit.value,
      );
    } catch (err: any) {
      error.value =
        err?.message || "Gagal memuat data IBK. Pastikan ID Posyandu benar.";
      setTimeout(() => navigate("/kader/posyandu"), 2000);
    } finally {
      loading.value = false;
    }
  });

  useTask$(({ track }) => {
    track(() => posyanduId);
    track(() => page.value);
    track(() => limit.value);
    track(() => isLoggedIn.value);
    if (!isLoggedIn.value) return;
    fetchIbkList();
  });

  useTask$(({ track }) => {
    track(() => page.value);
    const loadingVal = track(() => loading.value);
    // Scroll ke atas hanya saat loading selesai (false) dan page berubah
    if (hasInteracted.value && !loadingVal && tableRef.value) {
      setTimeout(() => {
        tableRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  });

  // Remove showAddForm, currentStep, formData, wizardSteps, and all form logic

  // Initial data loading or side effects for pendataan-ibk
  useTask$(({ track }) => {
    track(isLoggedIn); // Re-run when isLoggedIn changes

    if (isLoggedIn.value) {
      // This is where you would call your data fetching function, e.g., fetchDataForIBK();
      console.log("Fetching IBK data now that user is logged in.");
      // For now, it's a console log as there's no explicit fetch call in the mock data section.
      // If you have a function like `fetchIBKData()` uncomment and call it here.
      // fetchDataForIBK();
    } else {
      console.log("Not logged in, not fetching IBK data.");
      // Clear any data if not logged in, or show appropriate message
      existingIBK.value.splice(0, existingIBK.value.length);
    }
  });

  // IBK actions (no changes needed here)
  const handleEdit = $((ibk: IBKRecord) => {
    navigate(
      `/kader/posyandu/${posyanduId}/pendataan-ibk/${ibk.personal_data.id}/edit`,
    );
  });

  // Filtered IBK list (only gender in-memory)
  const filteredIBK = useSignal<IBKRecord[]>([]);
  useTask$(({ track }) => {
    track(() => existingIBK.value);
    track(() => genderFilter.value);
    let data = existingIBK.value;
    if (genderFilter.value) {
      data = data.filter(
        (ibk) => ibk.personal_data.gender === genderFilter.value,
      );
    }
    filteredIBK.value = data;
  });
  // Modal handlers
  const handleViewDetail = $(async (ibk: IBKRecord) => {
    showDetailModal.value = true;
    ibkDetail.value = null;
    try {
      const res = await ibkService.getIbkDetail(ibk.personal_data.id!);
      ibkDetail.value = res;
    } catch {
      // error handling already handled above
    } finally {
      // detailLoading.value = false; // This was part of the modal, now removed
    }
  });

  const debouncedFetch = useDebouncer(
    $(async () => {
      page.value = 1;
      await fetchIbkList();
    }),
    400,
  );

  return (
    <main>
      <div class="container mx-auto">
        {/* Page Header */}
        <div class="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-primary mb-2 break-words whitespace-normal">
              Pusat Pendataan dan Monitoring IBK
            </h1>
            <p class="text-base-content/70 text-base sm:text-lg">
              Kelola data individu berkebutuhan khusus dengan sistem
              terintegrasi
            </p>
            <p class="break-words whitespace-normal">
              Posyandu ID: {posyanduId}
            </p>
          </div>
          <button
            class="btn btn-primary gap-2 shadow-lg w-full sm:w-auto"
            onClick$={() =>
              navigate(`/kader/posyandu/${posyanduId}/ibk/create`)
            }
          >
            <LuPlus class="w-5 h-5" />
            <span class="hidden xs:inline">Tambah Data IBK</span>
            <span class="inline xs:hidden">Tambah</span>
          </button>
        </div>

        {/* Error States */}
        {error.value && (
          <div class="py-4 flex flex-col items-center gap-2">
            <Alert type="error" message={error.value} />
            <button
              class="btn btn-primary"
              onClick$={() => navigate("/kader/posyandu")}
            >
              Kembali ke Daftar Posyandu
            </button>
          </div>
        )}

        {/* IBK List */}
        {!error.value && (
          <>
            <div class="flex flex-col" ref={tableRef}>
              {/* IBKFilterControls */}
              <div class="flex flex-col md:flex-row gap-4 mb-4 items-end w-full">
                <div class="w-full md:w-auto flex-1">
                  <label class="label">
                    <span class="label-text">Cari Nama/NIK</span>
                  </label>
                  <input
                    class="input input-bordered w-full"
                    type="text"
                    placeholder="Cari berdasarkan nama atau NIK..."
                    value={search.value}
                    onInput$={(e) => {
                      search.value = (e.target as HTMLInputElement).value;
                      debouncedFetch();
                    }}
                  />
                </div>
                <div class="w-full md:w-auto">
                  <label class="label">
                    <span class="label-text">Jenis Kelamin</span>
                  </label>
                  <select
                    class="select select-bordered w-full"
                    value={genderFilter.value}
                    onChange$={(e) => {
                      genderFilter.value = (
                        e.target as HTMLSelectElement
                      ).value;
                      page.value = 1;
                      fetchIbkList();
                    }}
                  >
                    <option value="">Semua</option>
                    <option value="laki-laki">Laki-laki</option>
                    <option value="perempuan">Perempuan</option>
                  </select>
                </div>
                <div class="w-full md:w-auto">
                  <label class="label">
                    <span class="label-text">Limit per Halaman</span>
                  </label>
                  <select
                    class="select select-bordered w-full"
                    value={String(limit.value)}
                    onChange$={(e) => {
                      limit.value = parseInt(
                        (e.target as HTMLSelectElement).value,
                      );
                      page.value = 1;
                      fetchIbkList();
                    }}
                  >
                    {limitOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* IBK List Table with overlay loading */}
              <IBKTable
                ibkList={filteredIBK}
                loading={loading}
                error={error}
                onViewDetail$={handleViewDetail}
                onEdit$={handleEdit}
              />
              <div class="mt-auto">
                {totalPages.value > 1 && (
                  <PaginationControls
                    meta={{
                      totalData: total.value,
                      totalPage: totalPages.value,
                      currentPage: page.value,
                      limit: limit.value,
                    }}
                    currentPage={page.value}
                    onPageChange$={(newPage) => {
                      hasInteracted.value = true;
                      page.value = newPage;
                      setTimeout(() => {
                        const el = document.getElementById("ibk-table-title");
                        if (el) el.focus();
                      }, 0);
                    }}
                  />
                )}
              </div>
              {/* Detail Modal */}
              {showDetailModal.value && (
                <div class="modal modal-open">
                  <div class="modal-box max-w-2xl">
                    <h3 class="font-bold text-lg mb-4">Detail Data IBK</h3>
                    {loading.value ? ( // Changed from detailLoading.value
                      <div class="flex justify-center items-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : error.value ? ( // Changed from detailError.value
                      <div class="alert alert-error my-4">{error.value}</div>
                    ) : ibkDetail.value ? (
                      <div class="space-y-4">
                        {/* Data Diri */}
                        <div class="border-b pb-2 mb-2">
                          <h4 class="font-semibold text-base mb-2">
                            Data Diri
                          </h4>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                            <div>
                              <b>NIK:</b> {ibkDetail.value.nik}
                            </div>
                            <div>
                              <b>Nama:</b> {ibkDetail.value.nama}
                            </div>
                            <div>
                              <b>Tempat Lahir:</b>{" "}
                              {ibkDetail.value.tempat_lahir}
                            </div>
                            <div>
                              <b>Tanggal Lahir:</b>{" "}
                              {ibkDetail.value.tanggal_lahir}
                            </div>
                            <div>
                              <b>Jenis Kelamin:</b>{" "}
                              {ibkDetail.value.jenis_kelamin}
                            </div>
                            <div>
                              <b>Agama:</b> {ibkDetail.value.agama}
                            </div>
                            <div>
                              <b>Umur:</b> {ibkDetail.value.umur}
                            </div>
                            <div>
                              <b>Alamat:</b> {ibkDetail.value.alamat}
                            </div>
                            <div>
                              <b>No. Telp:</b> {ibkDetail.value.no_telp}
                            </div>
                            <div>
                              <b>Nama Wali:</b> {ibkDetail.value.nama_wali}
                            </div>
                            <div>
                              <b>No. Telp Wali:</b>{" "}
                              {ibkDetail.value.no_telp_wali}
                            </div>
                          </div>
                        </div>
                        {/* Kesehatan IBK */}
                        {ibkDetail.value.kesehatan_ibk && (
                          <div class="border-b pb-2 mb-2">
                            <h4 class="font-semibold text-base mb-2">
                              Kesehatan IBK
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                              <div>
                                <b>Hasil Diagnosa:</b>{" "}
                                {ibkDetail.value.kesehatan_ibk.hasil_diagnosa}
                              </div>
                              <div>
                                <b>ODGJ:</b>{" "}
                                {ibkDetail.value.kesehatan_ibk.odgj
                                  ? "Ya"
                                  : "Tidak"}
                              </div>
                              <div>
                                <b>Jenis Bantuan:</b>{" "}
                                {ibkDetail.value.kesehatan_ibk.jenis_bantuan}
                              </div>
                              <div>
                                <b>Riwayat Terapi:</b>{" "}
                                {ibkDetail.value.kesehatan_ibk.riwayat_terapi}
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Detail IBK */}
                        {ibkDetail.value.detail_ibk && (
                          <div class="border-b pb-2 mb-2">
                            <h4 class="font-semibold text-base mb-2">
                              Detail Sosial & Pendidikan
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                              <div>
                                <b>Pekerjaan:</b>{" "}
                                {ibkDetail.value.detail_ibk.pekerjaan}
                              </div>
                              <div>
                                <b>Pendidikan:</b>{" "}
                                {ibkDetail.value.detail_ibk.pendidikan}
                              </div>
                              <div>
                                <b>Status Perkawinan:</b>{" "}
                                {ibkDetail.value.detail_ibk.status_perkawinan}
                              </div>
                              <div>
                                <b>Titik Koordinat:</b>{" "}
                                {ibkDetail.value.detail_ibk.titik_koordinat}
                              </div>
                              <div>
                                <b>Keterangan Tambahan:</b>{" "}
                                {ibkDetail.value.detail_ibk.keterangan_tambahan}
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Assesmen IBK */}
                        {ibkDetail.value.assesmen_ibk && (
                          <div>
                            <h4 class="font-semibold text-base mb-2">
                              Asesmen Psikologi
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                              <div>
                                <b>Total IQ:</b>{" "}
                                {ibkDetail.value.assesmen_ibk.total_iq}
                              </div>
                              <div>
                                <b>Kategori IQ:</b>{" "}
                                {ibkDetail.value.assesmen_ibk.kategori_iq}
                              </div>
                              <div>
                                <b>Tipe Kepribadian:</b>{" "}
                                {ibkDetail.value.assesmen_ibk.tipe_kepribadian}
                              </div>
                              <div>
                                <b>Deskripsi Kepribadian:</b>{" "}
                                {
                                  ibkDetail.value.assesmen_ibk
                                    .deskripsi_kepribadian
                                }
                              </div>
                              <div>
                                <b>Potensi:</b>{" "}
                                {ibkDetail.value.assesmen_ibk.potensi}
                              </div>
                              <div>
                                <b>Minat:</b>{" "}
                                {ibkDetail.value.assesmen_ibk.minat}
                              </div>
                              <div>
                                <b>Bakat:</b>{" "}
                                {ibkDetail.value.assesmen_ibk.bakat}
                              </div>
                              <div>
                                <b>Keterampilan:</b>{" "}
                                {ibkDetail.value.assesmen_ibk.keterampilan}
                              </div>
                              <div>
                                <b>Catatan Psikolog:</b>{" "}
                                {ibkDetail.value.assesmen_ibk.catatan_psikolog}
                              </div>
                              <div>
                                <b>Rekomendasi Intervensi:</b>{" "}
                                {
                                  ibkDetail.value.assesmen_ibk
                                    .rekomendasi_intervensi
                                }
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                    <div class="modal-action">
                      <button
                        class="btn btn-ghost"
                        onClick$={() => (showDetailModal.value = false)}
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                  <div
                    class="modal-backdrop"
                    onClick$={() => (showDetailModal.value = false)}
                  ></div>
                </div>
              )}
            </div>

            {existingIBK.value.length === 0 && (
              <div class="text-center py-16">
                <LuActivity class="w-24 h-24 text-base-content/30 mx-auto mb-6" />
                <h3 class="text-2xl font-bold text-base-content/70 mb-4">
                  Belum ada data IBK
                </h3>
                <p class="text-base-content/60 mb-8 max-w-md mx-auto">
                  Mulai dengan menambahkan data IBK pertama di wilayah Anda
                </p>
                <button
                  class="btn btn-primary btn-lg gap-3"
                  onClick$={() =>
                    navigate(`/kader/posyandu/${posyanduId}/ibk/create`)
                  }
                >
                  <LuPlus class="w-6 h-6" />
                  Tambah Data IBK Pertama
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Pendataan IBK | SIDIFA",
  meta: [
    {
      name: "description",
      content:
        "Pusat pendataan dan monitoring individu berkebutuhan khusus dengan sistem multi-step form yang terintegrasi.",
    },
    {
      property: "og:title",
      content: "Pendataan IBK | SIDIFA",
    },
    {
      property: "og:description",
      content:
        "Kelola data IBK dengan mudah menggunakan sistem pendataan yang komprehensif.",
    },
  ],
};
