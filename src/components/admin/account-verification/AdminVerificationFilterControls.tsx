import { component$, Signal, QRL } from "@qwik.dev/core";
import { SearchBox } from "~/components/common";
import type { AdminVerificationFilterOptions } from "~/types/admin-account-verification";

interface AdminVerificationFilterControlsProps {
  filterOptions: Signal<AdminVerificationFilterOptions>;
  onFilterChange$: QRL<() => void>;
  limit: Signal<number>;
  onLimitChange$: QRL<(limit: number) => void>;
}

export const AdminVerificationFilterControls = component$(
  (props: AdminVerificationFilterControlsProps) => {
    const { filterOptions, onFilterChange$ } = props;

    const roleOptions = [
      { label: "Semua Peran", value: "" },
      { label: "Admin", value: "admin" },
      { label: "Posyandu", value: "posyandu" },
      { label: "Psikolog", value: "psikolog" },
    ];

    const orderByOptions = [
      { label: "Default", value: "" },
      { label: "Belum Terverifikasi", value: "asc" }, // Unverified first
      { label: "Terverifikasi", value: "desc" }, // Verified first
    ];

    const limitOptions = [
      { label: "5", value: 5 },
      { label: "10", value: 10 },
      { label: "20", value: 20 },
      { label: "50", value: 50 },
      { label: "100", value: 100 },
    ];

    return (
      <div class="mb-6 p-6 bg-base-100 rounded-lg shadow-md">
        <h2 class="card-title text-xl font-bold mb-4">
          Filter Verifikasi Akun
        </h2>
        {/* Mobile: stacked layout */}
        <div class="flex flex-col gap-4 md:hidden">
          <div class="form-control flex-1 min-w-0">
            <label
              for="search-name"
              class="label w-full whitespace-normal break-words min-h-[2.5rem]"
            >
              <span class="label-text w-full whitespace-normal break-words">
                Cari Nama Pengguna
              </span>
            </label>
            <SearchBox
              id="search-name"
              placeholder="Cari berdasarkan nama..."
              value={filterOptions.value.name || ""} // Ensure it's always a string
              onInput$={(e) =>
                (filterOptions.value.name = (
                  e.target as HTMLInputElement
                ).value)
              }
              onEnter$={onFilterChange$}
              class="input-bordered input-md h-12 w-full"
            />
          </div>
          <div class="form-control flex-1 min-w-0">
            <label
              for="filter-role"
              class="label w-full whitespace-normal break-words min-h-[2.5rem]"
            >
              <span class="label-text w-full whitespace-normal break-words">
                Filter berdasarkan Peran
              </span>
            </label>
            <select
              id="filter-role"
              class="select select-bordered select-md h-12 w-full"
              value={filterOptions.value.role}
              onChange$={(e) => {
                filterOptions.value.role = (e.target as HTMLSelectElement)
                  .value as "admin" | "posyandu" | "psikolog" | "";
                onFilterChange$();
              }}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div class="form-control flex-1 min-w-0">
            <label
              for="order-by"
              class="label w-full whitespace-normal break-words min-h-[2.5rem]"
            >
              <span class="label-text w-full whitespace-normal break-words">
                Urutkan Berdasarkan Verifikasi
              </span>
            </label>
            <select
              id="order-by"
              class="select select-bordered select-md h-12 w-full"
              value={filterOptions.value.orderBy}
              onChange$={(e) => {
                filterOptions.value.orderBy = (e.target as HTMLSelectElement)
                  .value as "asc" | "desc" | "";
                onFilterChange$();
              }}
            >
              {orderByOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div class="form-control flex-1 min-w-0">
            <label
              for="limit-per-page"
              class="label w-full whitespace-normal break-words min-h-[2.5rem]"
            >
              <span class="label-text w-full whitespace-normal break-words">
                Limit per Halaman
              </span>
            </label>
            <select
              id="limit-per-page"
              class="select select-bordered select-md h-12 w-full"
              value={props.limit.value}
              onChange$={(e) => {
                props.onLimitChange$(
                  parseInt((e.target as HTMLSelectElement).value),
                );
              }}
            >
              {limitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Desktop: grid dua baris */}
        <div class="hidden md:grid md:grid-cols-4 md:grid-rows-2 md:gap-x-4 md:gap-y-2 md:items-start">
          {/* Row 1: Labels */}
          <label
            for="search-name"
            class="label w-full whitespace-normal break-words min-h-[2.5rem] col-span-1 md:col-span-1 row-start-1 row-end-2"
          >
            <span class="label-text w-full whitespace-normal break-words">
              Cari Nama Pengguna
            </span>
          </label>
          <label
            for="filter-role"
            class="label w-full whitespace-normal break-words min-h-[2.5rem] col-span-1 md:col-span-1 row-start-1 row-end-2"
          >
            <span class="label-text w-full whitespace-normal break-words">
              Filter berdasarkan Peran
            </span>
          </label>
          <label
            for="order-by"
            class="label w-full whitespace-normal break-words min-h-[2.5rem] col-span-1 md:col-span-1 row-start-1 row-end-2"
          >
            <span class="label-text w-full whitespace-normal break-words">
              Urutkan Berdasarkan Verifikasi
            </span>
          </label>
          <label
            for="limit-per-page"
            class="label w-full whitespace-normal break-words min-h-[2.5rem] col-span-1 md:col-span-1 row-start-1 row-end-2"
          >
            <span class="label-text w-full whitespace-normal break-words">
              Limit per Halaman
            </span>
          </label>
          {/* Row 2: Inputs */}
          <div class="col-span-1 md:col-span-1 row-start-2 row-end-3">
            <SearchBox
              id="search-name"
              placeholder="Cari berdasarkan nama..."
              value={filterOptions.value.name || ""} // Ensure it's always a string
              onInput$={(e) =>
                (filterOptions.value.name = (
                  e.target as HTMLInputElement
                ).value)
              }
              onEnter$={onFilterChange$}
              class="input-bordered input-md h-12 w-full"
            />
          </div>
          <div class="col-span-1 md:col-span-1 row-start-2 row-end-3">
            <select
              id="filter-role"
              class="select select-bordered select-md h-12 w-full"
              value={filterOptions.value.role}
              onChange$={(e) => {
                filterOptions.value.role = (e.target as HTMLSelectElement)
                  .value as "admin" | "posyandu" | "psikolog" | "";
                onFilterChange$();
              }}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div class="col-span-1 md:col-span-1 row-start-2 row-end-3">
            <select
              id="order-by"
              class="select select-bordered select-md h-12 w-full"
              value={filterOptions.value.orderBy}
              onChange$={(e) => {
                filterOptions.value.orderBy = (e.target as HTMLSelectElement)
                  .value as "asc" | "desc" | "";
                onFilterChange$();
              }}
            >
              {orderByOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div class="col-span-1 md:col-span-1 row-start-2 row-end-3">
            <select
              id="limit-per-page"
              class="select select-bordered select-md h-12 w-full"
              value={props.limit.value}
              onChange$={(e) => {
                props.onLimitChange$(
                  parseInt((e.target as HTMLSelectElement).value),
                );
              }}
            >
              {limitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div class="flex justify-end mt-4 md:mt-0">
          <button
            class="btn btn-primary w-full md:w-auto"
            onClick$={onFilterChange$}
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    );
  },
);
