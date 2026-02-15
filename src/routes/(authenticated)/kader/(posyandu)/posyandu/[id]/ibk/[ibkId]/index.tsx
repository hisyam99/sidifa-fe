import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
  useContext,
  type QRL,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { ibkService } from "~/services/api";
import { IBKDetailView } from "~/components/ibk/IBKDetailView";
import { extractErrorMessage } from "~/utils/error";
import { LuAlertCircle } from "~/components/icons/lucide-optimized";
import type { IBKDetailViewData } from "~/types/ibk";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";
import {
  BreadcrumbContext,
  setBreadcrumbName,
} from "~/contexts/breadcrumb.context";

const KEY_PREFIX = "kader:ibk";

export default component$(() => {
  const nav = useNavigate();
  const loc = useLocation();
  const posyanduId = loc.params.id as string;
  const ibkId = loc.params.ibkId as string;

  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const data = useSignal<IBKDetailViewData | null>(null);
  const breadcrumbOverrides = useContext(BreadcrumbContext);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    error.value = null;

    const key = queryClient.buildKey(KEY_PREFIX, "detail", ibkId);

    // Stale-while-revalidate: apply cached data immediately
    const cached = queryClient.getQueryData<IBKDetailViewData>(key);
    if (cached) {
      data.value = cached;
      loading.value = false;

      if (cached?.nama) {
        setBreadcrumbName(breadcrumbOverrides, ibkId, String(cached.nama));
      }

      // If data is still fresh, skip the network request entirely
      if (queryClient.isFresh(key)) return;

      // Otherwise fall through to background refetch (no loading spinner)
      try {
        const res = await queryClient.fetchQuery(
          key,
          () => ibkService.getIbkDetail(ibkId),
          DEFAULT_STALE_TIME,
        );
        const detail = res?.data || res;
        queryClient.setQueryData(key, detail, DEFAULT_STALE_TIME);
        data.value = detail;
        if (detail?.nama) {
          setBreadcrumbName(breadcrumbOverrides, ibkId, String(detail.nama));
        }
      } catch (err: unknown) {
        // Silently fail on background refetch since we have cached data
        console.error("Background refetch IBK detail failed:", err);
      }
      return;
    }

    // No cached data — show loading spinner
    loading.value = true;
    try {
      const res = await queryClient.fetchQuery(
        key,
        () => ibkService.getIbkDetail(ibkId),
        DEFAULT_STALE_TIME,
      );
      const detail = res?.data || res;
      queryClient.setQueryData(key, detail, DEFAULT_STALE_TIME);
      data.value = detail;
      if (detail?.nama) {
        setBreadcrumbName(breadcrumbOverrides, ibkId, String(detail.nama));
      }
    } catch (err: unknown) {
      error.value = extractErrorMessage(err as Error);
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
