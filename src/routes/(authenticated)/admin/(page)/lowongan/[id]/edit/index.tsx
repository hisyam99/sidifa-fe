import { component$, useTask$, useSignal, $ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { useLowonganAdmin } from "~/hooks/useLowonganAdmin";
import { AdminPageHeader } from "~/components/admin";
import Alert from "~/components/ui/Alert";
import {
  LowonganForm,
  type LowonganFormData,
} from "~/components/admin/lowongan";
import type { LowonganItem } from "~/types/lowongan";

export default component$(() => {
  const { fetchDetail, updateItem, loading, error, success } =
    useLowonganAdmin();
  const loc = useLocation();
  const nav = useNavigate();
  const initial = useSignal<LowonganItem | null>(null);

  useTask$(async ({ track }) => {
    track(() => loc.params.id);
    const id = loc.params["id"];
    if (id) initial.value = await fetchDetail(id);
  });

  const handleSubmit = $(async (data: LowonganFormData) => {
    try {
      const id = loc.params["id"];
      await updateItem({ id, ...data });
      if (!error.value) nav(`/admin/lowongan`);
    } catch {
      // handled in hook
    }
  });

  return (
    <div class="space-y-6">
      <AdminPageHeader
        title="Edit Lowongan"
        description="Perbarui informasi lowongan kerja inklusif."
      />

      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}

      {initial.value && (
        <LowonganForm
          initialData={initial.value}
          onSubmit$={handleSubmit}
          loading={loading.value}
          submitButtonText="Simpan Perubahan"
        />
      )}
    </div>
  );
});
