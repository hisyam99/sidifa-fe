import { component$, Signal, QRL } from "@builder.io/qwik";
import { SearchBox } from "~/components/common";
import type { RoleFilterOption } from "~/types/user-management";

interface UserFilterControlsProps {
  searchQuery: Signal<string>;
  selectedRole: Signal<string>;
  roleOptions: RoleFilterOption[];
  onFilterChange$: QRL<() => void>;
}

export const UserFilterControls = component$(
  (props: UserFilterControlsProps) => {
    const { searchQuery, selectedRole, roleOptions, onFilterChange$ } = props;

    return (
      <div class="mb-6 p-6 bg-base-100 rounded-lg shadow-md">
        <h2 class="card-title text-xl font-bold mb-4">Filter Pengguna</h2>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="form-control flex-1">
            <label for="search-user" class="label">
              <span class="label-text">Cari Pengguna</span>
            </label>
            <SearchBox
              id="search-user"
              placeholder="Cari berdasarkan nama atau email..."
              value={searchQuery} // Changed from bind:value to value
              onInput$={(e) =>
                (searchQuery.value = (e.target as HTMLInputElement).value)
              } // Added onInput$
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
              value={selectedRole.value}
              onChange$={(e) => {
                selectedRole.value = (e.target as HTMLSelectElement).value;
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
