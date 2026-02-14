import { component$, $ } from "@builder.io/qwik";
import { useLowonganAdmin } from "~/hooks/useLowonganAdmin";
import Alert from "~/components/ui/Alert";
import { AdminPageHeader } from "~/components/admin";
import { useNavigate } from "@builder.io/qwik-city";
import {
  LowonganForm,
  type LowonganFormData,
} from "~/components/admin/lowongan";

export default component$(() => {
  const { createItem, loading, error, success } = useLowonganAdmin();
  const nav = useNavigate();

  const handleSubmit = $(async (data: LowonganFormData) => {
    try {
      await createItem(data);
      if (!error.value) nav(`/admin/lowongan`);
    } catch {
      // handled in hook
    }
  });

  return (
    <div class="space-y-6">
      <AdminPageHeader
        title="Tambah Lowongan"
        description="Buat lowongan kerja inklusif baru."
      />

      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}

      <LowonganForm
        onSubmit$={handleSubmit}
        loading={loading.value}
        submitButtonText="Tambah"
      />
    </div>
  );
});
