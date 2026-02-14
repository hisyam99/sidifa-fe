import { component$, $ } from "@builder.io/qwik";
import { useInformasiEdukasiAdmin } from "~/hooks/useInformasiEdukasiAdmin";
import Alert from "~/components/ui/Alert";
import { AdminPageHeader } from "~/components/admin";
import { useNavigate } from "@builder.io/qwik-city";
import {
  InformasiForm,
  InformasiFormData,
} from "~/components/admin/information";

export default component$(() => {
  const { createItem, loading, error, success } = useInformasiEdukasiAdmin();
  const nav = useNavigate();

  const handleSubmit = $(async (data: InformasiFormData) => {
    try {
      await createItem({
        judul: data.judul,
        tipe: data.tipe,
        deskripsi: data.deskripsi,
        file: data.file,
      });
      if (!error.value) {
        nav(`/admin/informasi`);
      }
    } catch {
      // Error is already handled in createItem function
    }
  });

  return (
    <div class="space-y-6">
      <AdminPageHeader
        title="Tambah Informasi Edukasi"
        description="Buat artikel, panduan, atau materi edukasi baru untuk pengguna."
      />

      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}

      <InformasiForm
        onSubmit$={handleSubmit}
        loading={loading.value}
        submitButtonText="Tambah"
      />
    </div>
  );
});
