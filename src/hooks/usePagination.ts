import {
  useSignal,
  useTask$,
  useComputed$,
  $,
  type QRL,
  type Signal,
} from "@qwik.dev/core";

/**
 * Pagination meta type (can be extended as needed)
 */
export interface PaginationMeta {
  totalData: number;
  totalPage: number;
  currentPage: number;
  limit: number;
}

// JSON-serializable value type
export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Serializable[]
  | { [key: string]: Serializable };

/**
 * Options for the usePagination hook
 */
export interface UsePaginationOptions<
  TFilter extends Record<string, unknown> = Record<string, unknown>,
> {
  initialPage?: number;
  initialLimit?: number;
  fetchList: QRL<(params: { page: number; limit: number } & TFilter) => void>;
  total: Signal<number>;
  totalPage?: Signal<number>;
  filters?: Signal<TFilter>;
  dependencies?: Array<Signal<Serializable>>;
}

/**
 * Reusable pagination hook for Qwik v2
 */
export function usePagination<
  TFilter extends Record<string, unknown> = Record<string, unknown>,
>({
  initialPage = 1,
  initialLimit = 10,
  fetchList,
  total,
  totalPage,
  filters,
  dependencies = [],
}: UsePaginationOptions<TFilter>) {
  const currentPage = useSignal(initialPage);
  const currentLimit = useSignal(initialLimit);

  // Meta object for pagination controls
  const meta = useComputed$(() => ({
    totalData: total.value,
    totalPage:
      totalPage?.value || Math.ceil(total.value / currentLimit.value) || 1,
    currentPage: currentPage.value,
    limit: currentLimit.value,
  }));

  // Centralized fetch handler
  const handleFetchList = $(() => {
    const filterObj = (filters?.value ?? {}) as Record<string, unknown>;
    fetchList({
      limit: currentLimit.value,
      page: currentPage.value,
      ...filterObj,
    } as { page: number; limit: number } & TFilter);
  });

  // Fetch data on mount and when dependencies change
  useTask$(({ track }) => {
    track(currentPage);
    track(currentLimit);
    // Track filters directly instead of computed filterHash
    if (filters) {
      track(filters);
    }
    dependencies.forEach((dep) => track(dep));
    handleFetchList();
  });

  // Handlers - avoid capturing meta signal by using currentPage and total directly
  const handlePageChange = $((newPage: number) => {
    const totalDataValue = total.value;
    const limitValue = currentLimit.value;
    const calculatedTotalPage =
      totalPage?.value || Math.ceil(totalDataValue / limitValue) || 1;

    if (newPage < 1 || newPage > calculatedTotalPage) return;
    currentPage.value = newPage;
  });

  const handleLimitChange = $((newLimit: number) => {
    currentLimit.value = newLimit;
    currentPage.value = 1;
  });

  const resetPage = $(() => {
    currentPage.value = 1;
  });

  return {
    currentPage,
    currentLimit,
    meta,
    handlePageChange,
    handleLimitChange,
    resetPage,
  };
}
