import { component$, useSignal, useComputed$, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { usePagination } from "~/hooks/usePagination";
import { kaderService } from "~/services/api";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";
import {
  PosyanduListHeader,
  PosyanduFilterSort,
  PosyanduTable,
} from "~/components/posyandu";
import { PaginationControls } from "~/components/common";
import type {
  PosyanduItem,
  PaginationMeta,
  PosyanduFilterOptions,
  PosyanduSortOptions,
} from "~/types/posyandu";

const KEY_PREFIX = "kader:posyandu";

const mapResponseItems = (data: PosyanduItem[]): PosyanduItem[] => {
  return data.map((item: PosyanduItem) => ({
    ...item,
    isRegistered: item.is_registered ?? false,
  }));
};

interface CachedListData {
  items: PosyanduItem[];
  meta: PaginationMeta;
}

export default component$(() => {
  const posyanduList = useSignal<PosyanduItem[]>([]);
  const meta = useSignal<PaginationMeta | null>(null);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);

  // Fix: computed signals for total and totalPage
  const totalDataSignal = useComputed$(() => meta.value?.totalData ?? 0);
  const totalPageSignal = useComputed$(() => meta.value?.totalPage ?? 1);

  const filterOptions = useSignal<PosyanduFilterOptions>({
    nama_posyandu: "",
    status: "",
  });
  const sortOptions = useSignal<PosyanduSortOptions>({
    sortBy: "nama_asc",
  });
  const sortByKey = useComputed$(() => sortOptions.value.sortBy ?? "");

  const { isLoggedIn } = useAuth();

  // Use the reusable pagination hook
  const {
    currentPage,
    currentLimit: limit,
    handlePageChange,
    handleLimitChange,
    resetPage,
  } = usePagination<PosyanduFilterOptions>({
    initialPage: 1,
    initialLimit: 10,
    fetchList: $(async (params) => {
      if (!isLoggedIn.value) {
        loading.value = false;
        return; // Prevent fetch during SSG or unauthenticated
      }

      error.value = null;

      const key = queryClient.buildKey(
        KEY_PREFIX,
        "list",
        params.page,
        params.limit,
        params.nama_posyandu,
        params.status,
      );

      // Stale-while-revalidate: apply cached data immediately
      const cached = queryClient.getQueryData<CachedListData>(key);
      if (cached) {
        posyanduList.value = cached.items;
        meta.value = cached.meta;

        // If data is still fresh, skip the network request entirely
        if (queryClient.isFresh(key)) return;
        // Otherwise fall through to background refetch (no loading spinner)
      }

      // Only show loading spinner when there is no cached data to display
      if (!cached) loading.value = true;

      try {
        const response = await queryClient.fetchQuery(
          key,
          () =>
            kaderService.getKaderPosyanduList({
              ...params,
            }),
          DEFAULT_STALE_TIME,
        );

        const mappedItems = mapResponseItems(response.data);
        const responseMeta: PaginationMeta = response.meta;

        const result: CachedListData = {
          items: mappedItems,
          meta: responseMeta,
        };

        // Update cache with the transformed result for instant re-use
        queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);

        posyanduList.value = result.items;
        meta.value = result.meta;
      } catch (err: unknown) {
        // Only surface the error if there was no cached fallback
        if (!cached) {
          error.value =
            (err as Error)?.message || "Gagal memuat data posyandu.";
        }
      } finally {
        loading.value = false;
      }
    }),
    total: totalDataSignal,
    totalPage: totalPageSignal,
    filters: filterOptions,
    dependencies: [isLoggedIn, sortByKey],
  });

  const registerToPosyandu = $(async (posyanduId: string) => {
    loading.value = true;
    error.value = null;
    try {
      await kaderService.registerKaderPosyandu(posyanduId);

      // Invalidate posyandu list caches so data refetches with updated registration status
      queryClient.invalidateQueries(KEY_PREFIX);

      // Refetch the current page through queryClient for consistent caching
      const key = queryClient.buildKey(
        KEY_PREFIX,
        "list",
        currentPage.value,
        limit.value,
        filterOptions.value.nama_posyandu,
        filterOptions.value.status,
      );

      const response = await queryClient.fetchQuery(
        key,
        () =>
          kaderService.getKaderPosyanduList({
            limit: limit.value,
            page: currentPage.value,
            ...filterOptions.value,
          }),
        DEFAULT_STALE_TIME,
      );

      const mappedItems = mapResponseItems(response.data);
      const responseMeta: PaginationMeta = response.meta;

      const result: CachedListData = {
        items: mappedItems,
        meta: responseMeta,
      };

      queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);

      posyanduList.value = result.items;
      meta.value = result.meta;
    } catch (err: unknown) {
      error.value = (err as Error)?.message || "Gagal mendaftar ke posyandu";
    } finally {
      loading.value = false;
    }
  });

  // Handler filter/sort
  const handleFilterSortChange = $(async () => {
    await resetPage();

    // Invalidate list cache when filter/sort params change
    queryClient.invalidateQueries(queryClient.buildKey(KEY_PREFIX, "list"));

    error.value = null;
    loading.value = true;

    try {
      const key = queryClient.buildKey(
        KEY_PREFIX,
        "list",
        1,
        limit.value,
        filterOptions.value.nama_posyandu,
        filterOptions.value.status,
      );

      const response = await queryClient.fetchQuery(
        key,
        () =>
          kaderService.getKaderPosyanduList({
            ...filterOptions.value,
            limit: limit.value,
            page: 1,
          }),
        DEFAULT_STALE_TIME,
      );

      const mappedItems = mapResponseItems(response.data);
      const responseMeta: PaginationMeta = response.meta;

      const result: CachedListData = {
        items: mappedItems,
        meta: responseMeta,
      };

      queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);

      posyanduList.value = result.items;
      meta.value = result.meta;
    } catch (err: unknown) {
      error.value = (err as Error)?.message || "Gagal memuat data posyandu.";
    } finally {
      loading.value = false;
    }
  });

  return (
    <div>
      <PosyanduListHeader
        title="Daftar Posyandu"
        description="Berikut adalah daftar posyandu yang terdaftar pada sistem."
      />

      <PosyanduFilterSort
        filterOptions={filterOptions}
        // sortOptions={sortOptions}
        onFilterSortChange$={handleFilterSortChange}
        limit={limit}
        onLimitChange$={$((event: Event) => {
          const target = event.target as HTMLSelectElement;
          const newLimit = parseInt(target.value);
          handleLimitChange(newLimit);
        })}
      />

      <PosyanduTable
        posyanduList={posyanduList}
        loading={loading}
        error={error}
        onRegister$={registerToPosyandu}
      />

      {meta.value && meta.value.totalPage > 1 && (
        <PaginationControls
          meta={meta.value}
          currentPage={currentPage.value}
          onPageChange$={handlePageChange}
        />
      )}
    </div>
  );
});
