import { component$ } from "@builder.io/qwik";

export const IBKTableSkeleton = component$(() => {
  const rows = Array.from({ length: 5 });
  const cols = ["NIK", "Nama", "Jenis Kelamin", "Alamat"];
  return (
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            {cols.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((_, i) => (
            <tr key={i}>
              {cols.map((_, j) => (
                <td key={j}>
                  <div class="skeleton h-4 w-full rounded bg-base-200 animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
