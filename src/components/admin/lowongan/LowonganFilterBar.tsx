import { component$, PropFunction, Signal } from "@builder.io/qwik";
import type { LowonganFilterOptions } from "~/types/lowongan";

interface LowonganFilterBarProps {
  filterOptions: Signal<LowonganFilterOptions>;
  onFilterChange$: PropFunction<() => void>;
  limit: Signal<number>;
  onLimitChange$: PropFunction<(limit: number) => void>;
}

export const LowonganFilterBar = component$<LowonganFilterBarProps>(
  ({ filterOptions, onFilterChange$, limit, onLimitChange$ }) => {
    return (
      <div class="grid grid-cols-1 md:grid-cols-6 gap-3 bg-base-100 p-4 rounded-lg shadow">
        <input
          class="input input-bordered w-full"
          placeholder="Nama lowongan"
          value={filterOptions.value.nama_lowongan || ""}
          onInput$={(e) => {
            filterOptions.value = {
              ...filterOptions.value,
              nama_lowongan: (e.target as HTMLInputElement).value,
            };
            onFilterChange$();
          }}
        />
        <input
          class="input input-bordered w-full"
          placeholder="Perusahaan"
          value={filterOptions.value.nama_perusahaan || ""}
          onInput$={(e) => {
            filterOptions.value = {
              ...filterOptions.value,
              nama_perusahaan: (e.target as HTMLInputElement).value,
            };
            onFilterChange$();
          }}
        />
        <input
          class="input input-bordered w-full"
          placeholder="Jenis pekerjaan"
          value={filterOptions.value.jenis_pekerjaan || ""}
          onInput$={(e) => {
            filterOptions.value = {
              ...filterOptions.value,
              jenis_pekerjaan: (e.target as HTMLInputElement).value,
            };
            onFilterChange$();
          }}
        />
        <input
          class="input input-bordered w-full"
          placeholder="Lokasi"
          value={filterOptions.value.lokasi || ""}
          onInput$={(e) => {
            filterOptions.value = {
              ...filterOptions.value,
              lokasi: (e.target as HTMLInputElement).value,
            };
            onFilterChange$();
          }}
        />
        <input
          class="input input-bordered w-full"
          placeholder="Jenis difasilitas"
          value={filterOptions.value.jenis_difasilitas || ""}
          onInput$={(e) => {
            filterOptions.value = {
              ...filterOptions.value,
              jenis_difasilitas: (e.target as HTMLInputElement).value,
            };
            onFilterChange$();
          }}
        />
        <select
          class="select select-bordered w-full"
          value={filterOptions.value.status || ""}
          onChange$={(e) => {
            filterOptions.value = {
              ...filterOptions.value,
              status: (e.target as HTMLSelectElement).value,
            };
            onFilterChange$();
          }}
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
        <div class="md:col-span-6 flex items-center gap-3 justify-end">
          <span class="text-sm">Tampilkan</span>
          <select
            class="select select-bordered"
            value={String(limit.value)}
            onChange$={(e) =>
              onLimitChange$(parseInt((e.target as HTMLSelectElement).value))
            }
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span class="text-sm">per halaman</span>
        </div>
      </div>
    );
  },
);
