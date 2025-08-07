import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
  QRL,
} from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { useJadwalPosyandu } from "~/hooks/useJadwalPosyandu";
import { JadwalPosyanduTable } from "~/components/posyandu/jadwal/JadwalPosyanduTable";
import { JadwalPosyanduForm } from "~/components/posyandu/jadwal/JadwalPosyanduForm";

export default component$(() => {
  const location = useLocation();
  const nav = useNavigate();
  const posyanduId = location.params.id as string;

  const showForm = useSignal(false);
  const editId = useSignal<string | null>(null);

  const {
    jadwalList,
    loading,
    error,
    success,
    fetchList,
    createJadwal,
    updateJadwal,
    selectedJadwal,
    fetchDetail,
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
    <div class="max-w-4xl mx-auto p-4">
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
      {error.value && <div class="alert alert-error mb-2">{error.value}</div>}
      {success.value && (
        <div class="alert alert-success mb-2">{success.value}</div>
      )}
      <JadwalPosyanduTable
        items={jadwalList}
        loading={loading.value}
        onEdit$={handleEdit}
        onDetail$={handleDetail}
      />
      {showForm.value && (
        <div class="modal modal-open">
          <div class="modal-box max-w-lg">
            <button
              class="btn btn-sm btn-circle absolute right-2 top-2"
              onClick$={() => {
                showForm.value = false;
                editId.value = null;
              }}
            >
              ✕
            </button>
            <JadwalPosyanduForm
              initialData={
                editId.value ? selectedJadwal.value || undefined : undefined
              }
              onSubmit$={editId.value ? handleUpdate : handleCreate}
              loading={loading.value}
              submitButtonText={
                editId.value ? "Update Jadwal" : "Simpan Jadwal"
              }
            />
          </div>
        </div>
      )}
    </div>
  );
});
