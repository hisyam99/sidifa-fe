import { component$, useSignal, useComputed$, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { usePagination } from "~/hooks/usePagination";
import { kaderService } from "~/services/api";
import {
  PosyanduListHeader,
  PosyanduFilterSort,
  PosyanduTable,
} from "~/components/posyandu";
import { PaginationControls, GenericLoadingSpinner } from "~/components/common";
import type {
  PosyanduItem,
  PaginationMeta,
  PosyanduFilterOptions,
  PosyanduSortOptions,
} from "~/types/posyandu"; // Import new types

export default component$(() => {
  const posyanduList = useSignal<PosyanduItem[]>([]);
  const meta = useSignal<PaginationMeta | null>(null);
  const loading = useSignal(true);
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

  const { isLoggedIn } = useAuth();

  // Use the reusable pagination hook
  const {
    currentPage,
    currentLimit: limit,
    // meta: paginationMeta, (not used)
    handlePageChange,
    handleLimitChange,
    resetPage,
  } = usePagination<PosyanduFilterOptions>({
    initialPage: 1,
    initialLimit: 10,
    fetchList: $(async (params) => {
      if (!isLoggedIn.value) return; // Prevent fetch during SSG or unauthenticated
      loading.value = true;
      error.value = null;
      try {
        const response = await kaderService.getKaderPosyanduList({
          ...params,
          // Add sort options if API supports
        });
        // Map is_registered (API) ke isRegistered (camelCase)
        posyanduList.value = response.data.map((item: PosyanduItem) => ({
          ...item,
          isRegistered: item.is_registered ?? false,
        }));
        meta.value = response.meta;
      } catch (err: any) {
        error.value = err.message || "Gagal memuat data posyandu.";
      } finally {
        loading.value = false;
      }
    }),
    total: totalDataSignal,
    totalPage: totalPageSignal,
    filters: filterOptions,
    dependencies: [isLoggedIn, sortOptions],
  });

  const registerToPosyandu = $(async (posyanduId: string) => {
    loading.value = true;
    error.value = null;
    try {
      await kaderService.registerKaderPosyandu(posyanduId);
      // Refresh the list and update the state without window alert
      const response = await kaderService.getKaderPosyanduList({
        limit: limit.value,
        page: currentPage.value,
        ...filterOptions.value,
      });
      posyanduList.value = response.data.map((item: PosyanduItem) => ({
        ...item,
        isRegistered: item.is_registered ?? false,
      }));
      meta.value = response.meta;
    } catch (err: any) {
      error.value = err.message || "Gagal mendaftar ke posyandu";
    } finally {
      loading.value = false;
    }
  });

  const handleFilterSortChange = $(() => {
    resetPage();
  });

  return (
    <div>
      <PosyanduListHeader
        title="Daftar Posyandu"
        description="Berikut adalah daftar posyandu yang terdaftar pada sistem."
      />

      <PosyanduFilterSort
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        onFilterSortChange$={handleFilterSortChange}
        limit={limit}
        onLimitChange$={$((event: Event) => {
          const target = event.target as HTMLSelectElement;
          const newLimit = parseInt(target.value);
          handleLimitChange(newLimit);
        })}
      />

      {loading.value ? (
        <GenericLoadingSpinner />
      ) : (
        <PosyanduTable
          posyanduList={posyanduList}
          loading={loading}
          error={error}
          onRegister$={registerToPosyandu}
        />
      )}

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
