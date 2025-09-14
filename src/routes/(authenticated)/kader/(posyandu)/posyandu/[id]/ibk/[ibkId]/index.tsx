import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
  type QRL,
} from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { useLocation, useNavigate } from "@qwik.dev/router";
import { ibkService } from "~/services/api";
import { IBKDetailView } from "~/components/ibk/IBKDetailView";
import { extractErrorMessage } from "~/utils/error";
import { LuAlertCircle } from "~/components/icons/lucide-optimized";

export default component$(() => {
  const nav = useNavigate();
  const loc = useLocation();
  const posyanduId = loc.params.id as string;
  const ibkId = loc.params.ibkId as string;

  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const data = useSignal<any | null>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await ibkService.getIbkDetail(ibkId);
      data.value = res?.data || res;
    } catch (err: any) {
      error.value = extractErrorMessage(err);
    } finally {
      loading.value = false;
    }
  });

  const handleBack: QRL<() => void> = $(() =>
    nav(`/kader/posyandu/${posyanduId}/ibk`),
  );
  const handleEdit: QRL<() => void> = $(() =>
    nav(`/kader/posyandu/${posyanduId}/ibk/${ibkId}/edit`),
  );

  return (
    <main>
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold">Detail Data IBK</h1>
        <p class="text-base-content/70">
          Informasi lengkap individu berkebutuhan khusus
        </p>
      </div>

      {loading.value && (
        <div class="flex justify-center items-center h-40">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {error.value && (
        <div class="alert alert-error">
          <LuAlertCircle class="w-6 h-6" />
          <span>{error.value}</span>
        </div>
      )}

      {!loading.value && !error.value && data.value && (
        <IBKDetailView
          data={data.value}
          onBack$={handleBack}
          onEdit$={handleEdit}
        />
      )}
    </main>
  );
});

export const head: DocumentHead = {
  title: "Detail IBK | SIDIFA",
  meta: [
    {
      name: "description",
      content: "Detail lengkap data IBK di SIDIFA",
    },
  ],
};
