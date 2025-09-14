import { component$, useSignal, useVisibleTask$, $, QRL } from "@qwik.dev/core";
import { useLocation, useNavigate } from "@qwik.dev/router";
import { useJadwalPosyandu } from "~/hooks/useJadwalPosyandu";
import { JadwalPosyanduTable } from "~/components/posyandu/jadwal/JadwalPosyanduTable";
import { JadwalPosyanduForm } from "~/components/posyandu/jadwal/JadwalPosyanduForm";
import { PaginationControls } from "~/components/common/PaginationControls";

export default component$(() => {
  const location = useLocation();
  const nav = useNavigate();
  const posyanduId = location.params.id as string;

  const showForm = useSignal(false);
  const editId = useSignal<string | null>(null);

  const {
    jadwalList,
    total,
    page,
    limit,
    totalPage,
    loading,
    error,
    success,
    selectedJadwal,
    fetchList,
    fetchDetail,
    createJadwal,
    updateJadwal,
    deleteJadwal,
    setPage,
  } = useJadwalPosyandu({ posyanduId });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    fetchList();
  });

  const handleCreate = $(async (data: any) => {
    console.log("DEBUG HANDLE CREATE DATA", data);
    await createJadwal({ ...data, posyandu_id: posyanduId });
    showForm.value = false;
  });

  const handleEdit: QRL<(id: string) => void> = $(async (id: string) => {
    editId.value = id;
    await fetchDetail(id);
    console.log("DEBUG selectedJadwal after fetch", selectedJadwal.value);
    showForm.value = true;
  });

  const handleUpdate = $(async (data: any) => {
    if (editId.value) {
      await updateJadwal(editId.value, { ...data, posyandu_id: posyanduId });
      editId.value = null;
      showForm.value = false;
    }
  });

  const handleDetail: QRL<(jadwalId: string) => void> = $(
    (jadwalId: string) => {
      nav(`/kader/posyandu/${posyanduId}/jadwal/${jadwalId}`);
    },
  );

  return (
    <div class="mx-auto w-full">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Jadwal Posyandu</h1>
        <button
          class="btn btn-primary"
          onClick$={() => {
            showForm.value = true;
            editId.value = null;
          }}
        >
          Tambah Jadwal
        </button>
      </div>
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
            <option selected value={10}>
              10
            </option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      {error.value && <div class="alert alert-error mb-2">{error.value}</div>}
      {success.value && (
        <div class="alert alert-success mb-2">{success.value}</div>
      )}
      <div
        id="jadwal-table-scroll-anchor"
        class="overflow-x-auto bg-base-100 p-2"
      >
        <JadwalPosyanduTable
          items={jadwalList}
          loading={loading.value}
          onEdit$={handleEdit}
          onDetail$={handleDetail}
          onDelete$={deleteJadwal}
        />
        <PaginationControls
          meta={{
            totalData: total.value,
            totalPage: totalPage.value,
            currentPage: page.value,
            limit: limit.value,
          }}
          currentPage={page.value}
          onPageChange$={$((newPage: number) => {
            setPage(newPage);
            const el = document.getElementById("jadwal-table-scroll-anchor");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          })}
        />
      </div>
      {showForm.value && (
        <dialog
          open
          class="modal modal-bottom sm:modal-middle"
          onClose$={() => {
            showForm.value = false;
            editId.value = null;
          }}
        >
          <div class="modal-box max-w-lg max-h-[calc(100dvh-4rem)] overflow-y-auto">
            <button
              class="btn btn-sm btn-circle absolute right-2 top-2"
              onClick$={() => {
                showForm.value = false;
                editId.value = null;
              }}
            >
              ✕
            </button>
            {editId.value && !selectedJadwal.value ? (
              <div class="flex justify-center items-center h-32">
                Loading...
              </div>
            ) : (
              <>
                {console.log(
                  "DEBUG initialData",
                  editId.value ? selectedJadwal.value || undefined : undefined,
                )}
                <JadwalPosyanduForm
                  key={editId.value || "create"}
                  initialData={
                    editId.value ? selectedJadwal.value || undefined : undefined
                  }
                  onSubmit$={editId.value ? handleUpdate : handleCreate}
                  loading={loading.value}
                  submitButtonText={
                    editId.value ? "Update Jadwal" : "Simpan Jadwal"
                  }
                />
              </>
            )}
          </div>
          <form method="dialog" class="modal-backdrop">
            <button
              onClick$={() => {
                showForm.value = false;
                editId.value = null;
              }}
            >
              close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
});
