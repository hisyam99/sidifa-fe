import { component$, useSignal, useTask$, $, QRL } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { ibkService } from "~/services/api";
import { PaginationControls } from "~/components/common";
import { IBKTable } from "~/components/ui/IBKTable";
import type { IBKRecord } from "~/types/ibk";

export default component$(() => {
  const ibkList = useSignal<IBKRecord[]>([]);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const page = useSignal(1);
  const limit = useSignal(10);
  const total = useSignal(0);
  const totalPages = () => Math.ceil(total.value / limit.value) || 1;

  // Search/filter state
  const search = useSignal("");
  const genderFilter = useSignal("");

  // TODO: Replace with dynamic posyanduId selection or filter
  const posyanduId = "356682f4-6cfd-4148-84bd-4fc631db753a";

  const { isLoggedIn } = useAuth();

  const fetchIbkList = $(async () => {
    if (!isLoggedIn.value || !posyanduId) return;
    loading.value = true;
    error.value = null;
    try {
      const res = await ibkService.getIbkListByPosyandu({
        posyanduId,
        page: page.value,
        limit: limit.value,
        orderBy: "created_at",
      });
      ibkList.value = (res.data || []).map((item: any) => ({
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
      total.value = res.meta?.total || 0;
    } catch (err: any) {
      error.value = err.message || "Gagal memuat data IBK.";
    } finally {
      loading.value = false;
    }
  });

  useTask$(async ({ track }) => {
    track(() => page.value);
    track(() => limit.value);
    track(() => isLoggedIn.value);
    await fetchIbkList();
  });

  // Filtered IBK list (in-memory, for now)
  const filteredIBK = useSignal<IBKRecord[]>([]);
  useTask$(({ track }) => {
    track(() => ibkList.value);
    track(() => search.value);
    track(() => genderFilter.value);
    let data = ibkList.value;
    if (search.value) {
      const q = search.value.toLowerCase();
      data = data.filter(
        (ibk) =>
          ibk.personal_data.nama_lengkap.toLowerCase().includes(q) ||
          ibk.personal_data.nik.includes(q),
      );
    }
    if (genderFilter.value) {
      data = data.filter(
        (ibk) => ibk.personal_data.gender === genderFilter.value,
      );
    }
    filteredIBK.value = data;
  });

  // Modal handlers
  const handleViewDetail: QRL<(ibk: IBKRecord) => void> = $((ibk) => {
    window.location.href = `/kader/posyandu/${posyanduId}/pendataan-ibk/${ibk.personal_data.id}`;
  });
  const handleEdit: QRL<(ibk: IBKRecord) => void> = $((ibk) => {
    window.location.href = `/kader/posyandu/${posyanduId}/pendataan-ibk/${ibk.personal_data.id}/edit`;
  });

  return (
    <div>
      <div class="flex flex-col md:flex-row gap-4 mb-4 items-end">
        <div class="flex-1">
          <label class="label">
            <span class="label-text">Cari Nama/NIK</span>
          </label>
          <input
            class="input input-bordered w-full"
            type="text"
            placeholder="Cari berdasarkan nama atau NIK..."
            value={search.value}
            onInput$={(e) =>
              (search.value = (e.target as HTMLInputElement).value)
            }
          />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Jenis Kelamin</span>
          </label>
          <select
            class="select select-bordered"
            value={genderFilter.value}
            onChange$={(e) =>
              (genderFilter.value = (e.target as HTMLSelectElement).value)
            }
          >
            <option value="">Semua</option>
            <option value="laki-laki">Laki-laki</option>
            <option value="perempuan">Perempuan</option>
          </select>
        </div>
      </div>
      <IBKTable
        ibkList={filteredIBK}
        loading={loading}
        error={error}
        onViewDetail$={handleViewDetail}
        onEdit$={handleEdit}
      />
      {totalPages() > 1 && (
        <PaginationControls
          meta={{
            totalData: total.value,
            totalPage: totalPages(),
            currentPage: page.value,
            limit: limit.value,
          }}
          currentPage={page.value}
          onPageChange$={(newPage) => (page.value = newPage)}
        />
      )}
    </div>
  );
});
