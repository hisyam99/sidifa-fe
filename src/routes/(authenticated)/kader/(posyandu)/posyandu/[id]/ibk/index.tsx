import { component$, useSignal, $, useTask$ } from "@builder.io/qwik";
import { useAuth } from "~/hooks"; // Add this import
import type { DocumentHead } from "@builder.io/qwik-city";
import { IBKTable, Alert } from "~/components/ui";
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
  const searchNama = useSignal("");
  const searchNik = useSignal("");
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const location = useLocation();
  const page = useSignal(1);
  const limit = useSignal(5);
  const total = useSignal(0);
  const totalPages = useSignal(1);
  const navigate = useNavigate();

  // Search/filter state
  // HAPUS: const genderFilter = useSignal("");

  const limitOptions = ["5", "10", "20", "50", "100"];

  // Extract posyanduId from route params
  const posyanduId = location.params.id;
  console.log("POSYANDU ID", posyanduId);

  const existingIBK = useSignal<IBKRecord[]>([]);
  const tableRef = useSignal<HTMLDivElement | undefined>(undefined);
  const hasInteracted = useSignal(false);
  const nikError = useSignal<string | null>(null);

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
        nama: searchNama.value ? searchNama.value : undefined,
        nik: searchNik.value ? searchNik.value : undefined,
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

  // Initial data loading or side effects for ibk
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
    navigate(`/kader/posyandu/${posyanduId}/ibk/${ibk.personal_data.id}/edit`);
  });

  // Filtered IBK list (only gender in-memory)
  const filteredIBK = useSignal<IBKRecord[]>([]);
  useTask$(({ track }) => {
    track(() => existingIBK.value);
    // HAPUS: track(() => genderFilter.value);
    const data = existingIBK.value;
    // HAPUS: if (genderFilter.value) {
    // HAPUS:   data = data.filter(
    // HAPUS:     (ibk) => ibk.personal_data.gender === genderFilter.value,
    // HAPUS:   );
    // HAPUS: }
    filteredIBK.value = data;
  });
  // View Detail: navigate to dedicated page
  const handleViewDetail = $((ibk: IBKRecord) => {
    navigate(`/kader/posyandu/${posyanduId}/ibk/${ibk.personal_data.id}`);
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
                    <span class="label-text">Cari Nama</span>
                  </label>
                  <input
                    class="input input-bordered w-full"
                    type="text"
                    placeholder="Cari berdasarkan nama..."
                    value={searchNama.value}
                    onInput$={(e) => {
                      searchNama.value = (e.target as HTMLInputElement).value;
                      debouncedFetch();
                    }}
                  />
                </div>
                <div class="w-full md:w-auto flex-1">
                  <label class="label">
                    <span class="label-text">Cari NIK</span>
                  </label>
                  <div class="relative">
                    <input
                      class={`input input-bordered w-full ${nikError.value ? "border-error focus:border-error" : ""}`}
                      type="number"
                      inputMode="numeric"
                      placeholder="Cari berdasarkan NIK..."
                      value={searchNik.value}
                      onInput$={(e) => {
                        const val = (
                          e.target as HTMLInputElement
                        ).value.replace(/[^\d]/g, "");
                        searchNik.value = val;
                        nikError.value =
                          val.length > 0 && val.length !== 16
                            ? "NIK harus 16 digit angka"
                            : null;
                        debouncedFetch();
                      }}
                    />
                    {nikError.value && (
                      <div class="absolute left-0 top-full mt-1 text-error text-xs rounded px-2 py-1 z-10 w-full">
                        {nikError.value}
                      </div>
                    )}
                  </div>
                </div>
                {/* HAPUS: <div class="w-full md:w-auto"> ... <label class="label"><span class="label-text">Jenis Kelamin</span></label> ... <select ...>...</select> ... </div> */}
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
