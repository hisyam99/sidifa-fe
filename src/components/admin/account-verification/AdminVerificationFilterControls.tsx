import { component$, Signal, QRL } from "@builder.io/qwik";
import { SearchBox } from "~/components/common";
import type { AdminVerificationFilterOptions } from "~/types/admin-account-verification";

interface AdminVerificationFilterControlsProps {
  filterOptions: Signal<AdminVerificationFilterOptions>;
  onFilterChange$: QRL<() => void>;
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

    const statusOptions = [
      { label: "Semua Status", value: "" },
      { label: "Terverifikasi", value: "verified" },
      { label: "Belum Terverifikasi", value: "unverified" },
    ];

    return (
      <div class="mb-6 p-6 bg-base-100 rounded-lg shadow-md">
        <h2 class="card-title text-xl font-bold mb-4">
          Filter Verifikasi Akun
        </h2>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="form-control flex-1">
            <label for="search-name" class="label">
              <span class="label-text">Cari Nama Pengguna</span>
            </label>
            <SearchBox
              id="search-name"
              placeholder="Cari berdasarkan nama..."
              value={filterOptions.value.name || ""} // Ensure it's always a string
              onInput$={(e) =>
                (filterOptions.value.name = (e.target as HTMLInputElement).value)
              }
              onEnter$={onFilterChange$}
              class="input-bordered"
            />
          </div>
          <div class="form-control flex-1">
            <label for="filter-role" class="label">
              <span class="label-text">Filter berdasarkan Peran</span>
            </label>
            <select
              id="filter-role"
              class="select select-bordered w-full"
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
          <div class="form-control flex-1">
            <label for="filter-status" class="label">
              <span class="label-text">
                Filter berdasarkan Status Verifikasi
              </span>
            </label>
            <select
              id="filter-status"
              class="select select-bordered w-full"
              value={filterOptions.value.status}
              onChange$={(e) => {
                filterOptions.value.status = (e.target as HTMLSelectElement)
                  .value as "verified" | "unverified" | "";
                onFilterChange$();
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button class="btn btn-primary" onClick$={onFilterChange$}>
            Terapkan Filter
          </button>
        </div>
      </div>
    );
  },
);
