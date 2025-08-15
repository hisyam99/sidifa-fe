import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import { JobCard } from "~/components/jobs";
import { LowonganFilterBar } from "~/components/admin/lowongan/LowonganFilterBar";
import { PaginationControls } from "~/components/common/PaginationControls";
import { usePagination } from "~/hooks/usePagination";
import type { LowonganFilterOptions } from "~/types/lowongan";
import { useLowonganKader } from "~/hooks/useLowonganKader";
import { GenericLoadingSpinner } from "~/components/common";

export default component$(() => {
  const nav = useNavigate();
  const filterOptions = useSignal<LowonganFilterOptions>({});
  const { items, loading, error, total, totalPage, fetchList } =
    useLowonganKader();

  const {
    currentPage,
    currentLimit,
    meta,
    handlePageChange,
    handleLimitChange,
    resetPage,
  } = usePagination<LowonganFilterOptions>({
    initialPage: 1,
    initialLimit: 10,
    fetchList: $((params) => fetchList(params)),
    total,
    totalPage,
    filters: filterOptions,
  });

  const handleFilterChange = $(async () => {
    await resetPage();
    await fetchList({
      limit: currentLimit.value,
      page: 1,
      ...filterOptions.value,
    });
  });

  // Ensure initial client-side fetch occurs
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    await fetchList({
      limit: currentLimit.value,
      page: currentPage.value,
      ...filterOptions.value,
    });
  });

  return (
    <div>
      <h1 class="text-3xl font-bold mb-2">
        Lowongan Pekerjaan Ramah Disabilitas
      </h1>
      <p class="mb-6">
        Temukan dan bagikan informasi lowongan kerja yang inklusif.
      </p>

      <div class="mb-4">
        <LowonganFilterBar
          filterOptions={filterOptions}
          onFilterChange$={handleFilterChange}
          limit={currentLimit}
          onLimitChange$={handleLimitChange}
        />
      </div>

      {loading.value && <GenericLoadingSpinner />}
      {error.value && <div class="alert alert-error mb-4">{error.value}</div>}

      <div class="space-y-6">
        {items.value.map((job) => (
          <JobCard
            key={job.id}
            title={job.nama_lowongan}
            company={job.nama_perusahaan}
            location={job.lokasi}
            type={job.jenis_pekerjaan}
            tags={
              [
                job.jenis_difasilitas,
                job.status,
                ...(job.tanggal_mulai ? ["Mulai: " + job.tanggal_mulai] : []),
                ...(job.tanggal_selesai
                  ? ["Selesai: " + job.tanggal_selesai]
                  : []),
              ].filter(Boolean) as string[]
            }
            onViewDetail$={$(() => nav(`/kader/lowongan/detail/${job.id}`))}
          />
        ))}
      </div>

      <PaginationControls
        meta={meta.value}
        currentPage={currentPage.value}
        onPageChange$={handlePageChange}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Lowongan Pekerjaan - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Lowongan Pekerjaan Ramah Disabilitas - Si-DIFA",
    },
  ],
};
