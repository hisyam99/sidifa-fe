import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { useInformasiEdukasiAdmin } from "~/hooks/useInformasiEdukasiAdmin";
import Alert from "~/components/ui/Alert";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import { useNavigate, useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const { fetchDetail, deleteItem, loading, error, success } =
    useInformasiEdukasiAdmin();
  const nav = useNavigate();
  const loc = useLocation();
  const detail = useSignal<any>(null);
  const deleteModal = useSignal(false);

  useVisibleTask$(async () => {
    const id = loc.params.id;
    if (id) {
      const data = await fetchDetail(id);
      detail.value = data || null;
    }
  });

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Detail Informasi Edukasi</h1>
      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}
      {loading.value ? (
        <div class="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : detail.value ? (
        <div class="card bg-base-100 shadow-md p-6">
          <div class="mb-2">
            <b>Judul:</b> {detail.value.judul}
          </div>
          <div class="mb-2">
            <b>Tipe:</b> {detail.value.tipe}
          </div>
          <div class="mb-2">
            <b>Deskripsi:</b> {detail.value.deskripsi}
          </div>
          <div class="mb-2">
            <b>File:</b> {detail.value.file_url || "-"}
          </div>
          <div class="flex gap-2 mt-4">
            <button
              class="btn btn-primary"
              onClick$={() =>
                nav(`/admin/(page)/informasi/${detail.value.id}/edit`)
              }
            >
              Edit
            </button>
            <button
              class="btn btn-error"
              onClick$={() => (deleteModal.value = true)}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div class="text-center">Data tidak ditemukan</div>
      )}
      {/* Modal Delete */}
      {deleteModal.value && detail.value && (
        <div class="modal modal-open">
          <div class="modal-box">
            <h3 class="font-bold text-lg">Konfirmasi Hapus</h3>
            <p>Yakin ingin menghapus data ini?</p>
            <div class="modal-action">
              <button class="btn" onClick$={() => (deleteModal.value = false)}>
                Batal
              </button>
              <button
                class="btn btn-error"
                onClick$={async () => {
                  await deleteItem(detail.value.id);
                  deleteModal.value = false;
                  nav("/admin/(page)/informasi");
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
