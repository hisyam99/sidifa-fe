import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { kaderService } from "~/services/api";
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
} from "~/types/posyandu"; // Import new types

export default component$(() => {
  const posyanduList = useSignal<PosyanduItem[]>([]);
  const meta = useSignal<PaginationMeta | null>(null);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const currentPage = useSignal(1);
  const limit = useSignal(10);

  const filterOptions = useSignal<PosyanduFilterOptions>({
    nama_posyandu: "",
    status: "",
  });
  const sortOptions = useSignal<PosyanduSortOptions>({
    sortBy: "nama_asc",
  });

  const { isLoggedIn } = useAuth();

  const fetchPosyandu = $(async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await kaderService.getKaderPosyanduList({
        limit: limit.value,
        page: currentPage.value,
        nama_posyandu: filterOptions.value.nama_posyandu || undefined, // Use filterOptions
        // Add sort options if API supports
      });
      posyanduList.value = response.data;
      meta.value = response.meta;
    } catch (err: any) {
      error.value = err.message || "Gagal memuat data posyandu.";
    } finally {
      loading.value = false;
    }
  });

  useTask$(({ track }) => {
    track(isLoggedIn); // Re-run when isLoggedIn changes
    track(() => filterOptions.value.nama_posyandu); // Track filter changes
    track(() => filterOptions.value.status); // Track filter changes
    track(() => sortOptions.value.sortBy); // Track sort changes
    track(currentPage); // Track page changes
    track(limit); // Track limit changes

    if (isLoggedIn.value) {
      fetchPosyandu();
    } else {
      posyanduList.value = [];
      meta.value = null;
      error.value =
        "Anda tidak memiliki akses untuk melihat data ini. Silakan login.";
      loading.value = false;
    }
  });

  const handlePageChange = $((page: number) => {
    if (meta.value && (page < 1 || page > meta.value.totalPage)) return;
    currentPage.value = page;
    // fetchPosyandu will be triggered by useTask$ reacting to currentPage changes
  });

  const handleFilterSortChange = $(() => {
    currentPage.value = 1; // Reset page to 1 on filter/sort change
    // fetchPosyandu will be triggered by useTask$ reacting to filter/sort changes
  });

  const handleLimitChange = $((event: Event) => {
    const target = event.target as HTMLSelectElement;
    limit.value = parseInt(target.value);
    currentPage.value = 1;
    // fetchPosyandu will be triggered by useTask$ reacting to limit changes
  });

  return (
    <div>
      <PosyanduListHeader
        title="Daftar Posyandu"
        description="Berikut adalah daftar posyandu yang terdaftar pada sistem."
      />

      <PosyanduFilterSort
        filterOptions={filterOptions} // Pass filterOptions signal
        sortOptions={sortOptions} // Pass sortOptions signal
        onFilterSortChange$={handleFilterSortChange}
        limit={limit}
        onLimitChange$={handleLimitChange}
      />

      <PosyanduTable
        posyanduList={posyanduList}
        loading={loading}
        error={error}
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
