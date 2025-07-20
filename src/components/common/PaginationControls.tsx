import { component$, $, QRL } from "@builder.io/qwik";
import { LuChevronLeft, LuChevronRight } from "~/components/icons/lucide-optimized"; // Updated import path
import type { PaginationMeta } from "~/types/posyandu"; // Use generic pagination meta if it becomes common

interface PaginationControlsProps {
  meta: PaginationMeta | null;
  currentPage: number;
  onPageChange$: QRL<(page: number) => void>;
}

export const PaginationControls = component$(
  (props: PaginationControlsProps) => {
    const { meta, currentPage, onPageChange$ } = props;

    const totalPages = meta?.totalPage || 1;

    const getPaginationButtons = (
      currentPage: number,
      totalPages: number,
    ): (number | string)[] => {
      const buttons: (number | string)[] = []; // Explicitly type the array
      const maxButtons = 5;
      if (totalPages <= maxButtons) {
        for (let i = 1; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = startPage + maxButtons - 1;
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = endPage - maxButtons + 1;
        }
        if (startPage > 1) {
          buttons.push(1);
          if (startPage > 2) buttons.push("...");
        }
        for (let i = startPage; i <= endPage; i++) {
          buttons.push(i);
        }
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) buttons.push("...");
          buttons.push(totalPages);
        }
      }
      return buttons;
    };

    return (
      <div class="flex justify-center mt-6">
        <div class="join">
          <button
            class="join-item btn"
            disabled={currentPage === 1}
            onClick$={() => onPageChange$(currentPage - 1)}
          >
            <LuChevronLeft class="w-4 h-4" />
          </button>
          {getPaginationButtons(currentPage, totalPages).map(
            (page: number | string, index: number) => (
              <button
                key={index}
                class={`join-item btn ${page === currentPage ? "btn-active" : ""}`}
                disabled={typeof page !== "number"}
                onClick$={$(() => {
                  if (typeof page === "number") {
                    onPageChange$(page);
                  }
                })}
              >
                {page}
              </button>
            ),
          )}
          <button
            class="join-item btn"
            disabled={currentPage === totalPages}
            onClick$={() => onPageChange$(currentPage + 1)}
          >
            <LuChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  },
);
