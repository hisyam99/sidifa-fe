import { $, QRL, component$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { usePresensiIBK } from "~/hooks/usePresensiIBK";
import { PresensiIBKTable } from "~/components/posyandu/presensi/PresensiIBKTable";
import { PaginationControls } from "~/components/common/PaginationControls";
import type { PresensiStatus } from "~/types";

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();
  const jadwalId = loc.params.jadwalId as string;

  const {
    list,
    total,
    page,
    limit,
    totalPage,
    loading,
    error,
    success,
    fetchList,
    updateStatus,
    setPage,
  } = usePresensiIBK({ jadwalId });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    fetchList();
  });

  const handleDetail: QRL<(id: string) => void> = $((id: string) => {
    nav(`/kader/posyandu/${loc.params.id}/jadwal/${jadwalId}/presensi/${id}`);
  });

  const handleUpdateStatus = $((id: string, status: PresensiStatus) => {
    return updateStatus(id, status);
  });

  return (
    <div class="mx-auto p-4 w-full">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Presensi IBK</h1>
      </div>

      {error.value && <div class="alert alert-error mb-2">{error.value}</div>}
      {success.value && (
        <div class="alert alert-success mb-2">{success.value}</div>
      )}

      <div class="flex flex-col md:flex-row gap-4 mb-4 items-end">
        <div>
          <label class="label">
            <span class="label-text">Tampilkan per halaman</span>
          </label>
          <select
            class="select select-bordered"
            value={limit.value}
            onChange$={(e) => {
              limit.value = Number((e.target as HTMLSelectElement).value);
              fetchList({ page: 1, limit: limit.value });
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
        items={list}
        loading={loading.value}
        onDetail$={handleDetail}
        onUpdateStatus$={handleUpdateStatus}
      />

      <PaginationControls
        meta={{
          totalData: total.value,
          totalPage: totalPage.value,
          currentPage: page.value,
          limit: limit.value,
        }}
        currentPage={page.value}
        onPageChange$={$((newPage: number) => setPage(newPage))}
      />
    </div>
  );
});
