import { component$, useTask$, useSignal, $ } from "@qwik.dev/core";
import { useAuth } from "~/hooks";
import { useInformasiEdukasiAdmin } from "~/hooks/useInformasiEdukasiAdmin";
import Alert from "~/components/ui/Alert";
import { useNavigate, useLocation } from "@qwik.dev/router";
import {
  InformasiForm,
  InformasiFormData,
} from "~/components/admin/information";
import { GenericLoadingSpinner } from "~/components/common";
import type { InformasiItem } from "~/types/informasi"; // Ensure InformasiItem is imported

export default component$(() => {
  const { fetchDetail, updateItem, loading, error, success } =
    useInformasiEdukasiAdmin();
  const nav = useNavigate();
  const loc = useLocation();
  const initialFormData = useSignal<InformasiFormData | null>(null);

  const { isLoggedIn } = useAuth();

  useTask$(async ({ track }) => {
    track(isLoggedIn);
    const id = track(() => loc.params.id);

    if (isLoggedIn.value && id) {
      const data: InformasiItem | null = await fetchDetail(id); // Explicitly type data
      if (data) {
        initialFormData.value = {
          judul: data.judul || "",
          tipe: data.tipe || "",
          deskripsi: data.deskripsi || "",
          file_name: data.file_name || "", // Changed from file_name to file_name
        };
      }
    }
  });

  const handleSubmit = $(async (data: InformasiFormData) => {
    const id = loc.params.id;
    if (!id) return;
    try {
      await updateItem({
        id,
        judul: data.judul,
        tipe: data.tipe,
        deskripsi: data.deskripsi,
        file: data.file,
      });
      if (!error.value) {
        nav(`/admin/informasi/detail/${id}`);
      }
    } catch {
      // Error is already handled in updateItem function
    }
  });

  return (
    <div class="p-4 mx-auto">
      <h1 class="text-2xl font-bold mb-4">Edit Informasi Edukasi</h1>
      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}

      {loading.value ? (
        <GenericLoadingSpinner />
      ) : initialFormData.value ? (
        <InformasiForm
          initialData={initialFormData.value}
          onSubmit$={handleSubmit}
          loading={loading.value}
          submitButtonText="Simpan Perubahan"
        />
      ) : (
        <div class="text-center py-8 text-base-content/70">
          Data tidak ditemukan atau gagal dimuat.
        </div>
      )}
    </div>
  );
});
