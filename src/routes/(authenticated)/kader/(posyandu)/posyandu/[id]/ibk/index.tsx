import { component$, useSignal, $, useTask$ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import type { DocumentHead } from "@builder.io/qwik-city";
import { IBKTable, Alert } from "~/components/ui";
import { PaginationControls } from "~/components/common";
import type { IBKRecord } from "~/types";
import { LuPlus, LuActivity } from "~/components/icons/lucide-optimized";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { ibkService } from "~/services/api";
import { useDebouncer } from "~/utils/debouncer";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";

const KEY_PREFIX = "kader:ibk";

// Type for IBK API response item
interface IBKApiItem {
  id: string;
  nama: string;
  nik: string | number;
  jenis_kelamin?: string;
  alamat?: string;
  created_at: string;
  updated_at?: string;
}

interface CachedIBKListData {
  items: IBKRecord[];
  total: number;
  totalPages: number;
}

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

  const limitOptions = ["5", "10", "20", "50", "100"];

  // Extract posyanduId from route params
  const posyanduId = location.params.id;

  const existingIBK = useSignal<IBKRecord[]>([]);
  const tableRef = useSignal<HTMLDivElement | undefined>(undefined);
  const hasInteracted = useSignal(false);
  const nikError = useSignal<string | null>(null);

  const { isLoggedIn } = useAuth();

  const mapApiToIBKRecords = $((data: IBKApiItem[]): IBKRecord[] => {
    return data.map((item: IBKApiItem) => ({
      personal_data: {
        id: item.id,
        nama_lengkap: item.nama,
        nik: String(item.nik),
        tempat_lahir: "-",
        tanggal_lahir: "",
        gender:
          item.jenis_kelamin?.toLowerCase() === "laki-laki"
            ? "laki-laki"
            : "perempuan",
        agama: "",
        alamat_lengkap: item.alamat || "",
        rt_rw: "",
        kecamatan: "",
        kabupaten: "",
        provinsi: "",
        kode_pos: "",
        no_telp: "",
        nama_ayah: "",
        nama_ibu: "",
        created_at: item.created_at,
        updated_at: item.updated_at || "",
      },
      disability_info: undefined,
      visit_history: [],
      posyandu_id: posyanduId,
      status: "active",
      total_kunjungan: 0,
      last_visit: undefined,
      next_scheduled_visit: undefined,
    }));
  });

  // Fetch IBK list from backend with caching
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

    error.value = null;

    const key = queryClient.buildKey(
      KEY_PREFIX,
      posyanduId,
      "list",
      page.value,
      limit.value,
      searchNama.value || undefined,
      searchNik.value || undefined,
    );

    // Stale-while-revalidate: apply cached data immediately
    const cached = queryClient.getQueryData<CachedIBKListData>(key);
    if (cached) {
      existingIBK.value = cached.items;
      total.value = cached.total;
      totalPages.value = cached.totalPages;

      // If data is still fresh, skip the network request entirely
      if (queryClient.isFresh(key)) return;
      // Otherwise fall through to background refetch (no loading spinner)
    }

    // Only show loading spinner when there is no cached data to display
    if (!cached) loading.value = true;

    try {
      const res = await queryClient.fetchQuery(
        key,
        () =>
          ibkService.getIbkListByPosyandu({
            posyanduId,
            page: page.value,
            limit: limit.value,
            orderBy: "created_at",
            nama: searchNama.value ? searchNama.value : undefined,
            nik: searchNik.value ? searchNik.value : undefined,
          }),
        DEFAULT_STALE_TIME,
      );

      const mappedItems = await mapApiToIBKRecords(res.data || []);

      const result: CachedIBKListData = {
        items: mappedItems,
        total: res.meta?.totalData || 0,
        totalPages: res.meta?.totalPage || 1,
      };

      // Update cache with the transformed result for instant re-use
      queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);

      existingIBK.value = result.items;
      total.value = result.total;
      totalPages.value = result.totalPages;
    } catch (err: unknown) {
      // Only surface the error if there was no cached fallback
      if (!cached) {
        error.value =
          (err as Error)?.message ||
          "Gagal memuat data IBK. Pastikan ID Posyandu benar.";
        setTimeout(() => navigate("/kader/posyandu"), 2000);
      }
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

  // IBK actions
  const handleEdit = $((ibk: IBKRecord) => {
    navigate(`/kader/posyandu/${posyanduId}/ibk/${ibk.personal_data.id}/edit`);
  });

  // Filtered IBK list
  const filteredIBK = useSignal<IBKRecord[]>([]);
  useTask$(({ track }) => {
    track(() => existingIBK.value);
    filteredIBK.value = existingIBK.value;
  });

  // View Detail: navigate to dedicated page
  const handleViewDetail = $((ibk: IBKRecord) => {
    navigate(`/kader/posyandu/${posyanduId}/ibk/${ibk.personal_data.id}`);
  });

  const debouncedFetch = useDebouncer(
    $(async () => {
      page.value = 1;
      // Invalidate list cache when search params change
      queryClient.invalidateQueries(
        queryClient.buildKey(KEY_PREFIX, posyanduId, "list"),
      );
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
