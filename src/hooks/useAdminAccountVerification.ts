import { useSignal, $ } from "@builder.io/qwik";
import { adminService } from "~/services/api";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";
import type { AdminVerificationItem } from "~/types/admin-account-verification";

const KEY_PREFIX = "admin:verification";

interface APIUserRow {
  id: string;
  name: string;
  email: string;
  role: "admin" | "posyandu" | "psikolog";
  verification: "verified" | "unverified" | "declined";
  requested_at?: string;
  verified_at?: string | null;
}

interface CachedListData {
  items: AdminVerificationItem[];
  totalData: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const useAdminAccountVerification = () => {
  const items = useSignal<AdminVerificationItem[]>([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const totalData = useSignal<number>(0);
  const totalPages = useSignal<number>(1);
  const page = useSignal<number>(1);
  const limit = useSignal<number>(10);

  const fetchList = $(
    async (
      params: {
        limit?: number;
        page?: number;
        name?: string;
        role?: "admin" | "posyandu" | "psikolog" | "";
        verification?: "verified" | "unverified" | "declined" | "";
        status?: "verified" | "unverified" | "declined" | "";
        orderBy?: "asc" | "desc" | "";
      } = {},
    ) => {
      error.value = null;

      const resolvedPage = params.page ?? page.value;
      const resolvedLimit = params.limit ?? limit.value;

      const key = queryClient.buildKey(
        KEY_PREFIX,
        "list",
        resolvedPage,
        resolvedLimit,
        params.name,
        params.role,
        params.status ?? params.verification,
        params.orderBy,
      );

      // Stale-while-revalidate: apply cached data immediately
      const cached = queryClient.getQueryData<CachedListData>(key);
      if (cached) {
        items.value = cached.items;
        totalData.value = cached.totalData;
        totalPages.value = cached.totalPages;
        page.value = cached.page;
        limit.value = cached.limit;

        if (queryClient.isFresh(key)) return;
      }

      if (!cached) loading.value = true;

      try {
        const response = await queryClient.fetchQuery(
          key,
          () =>
            adminService.listUsers({
              limit: resolvedLimit,
              page: resolvedPage,
              name: params.name,
              role: params.role,
              verification: params.status ?? params.verification ?? "",
            }),
          DEFAULT_STALE_TIME,
        );

        const rows = Array.isArray(response.data) ? response.data : [];
        const transformed = rows.map(
          (row: APIUserRow): AdminVerificationItem => ({
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role,
            status: row.verification ?? "unverified",
            requested_at: row.requested_at ?? "",
            verified_at: row.verified_at ?? null,
          }),
        );

        const result: CachedListData = {
          items: transformed,
          totalData: response.meta?.totalData || 0,
          totalPages: response.meta?.totalPage || 1,
          page: response.meta?.currentPage || 1,
          limit: response.meta?.limit || 10,
        };

        queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);

        items.value = result.items;
        totalData.value = result.totalData;
        totalPages.value = result.totalPages;
        page.value = result.page;
        limit.value = result.limit;
      } catch (err: unknown) {
        if (!cached) {
          error.value =
            (err as Error)?.message || "Gagal memuat data verifikasi akun";
          items.value = [];
        }
      } finally {
        loading.value = false;
      }
    },
  );

  const verifyAccount = $(async (item: AdminVerificationItem) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await adminService.verifyUser(item.id, "verified");
      success.value = `Akun ${item.name} berhasil diverifikasi.`;
      queryClient.invalidateQueries(KEY_PREFIX);
      await fetchList();
    } catch (err: unknown) {
      error.value = (err as Error)?.message || "Gagal memverifikasi akun";
    } finally {
      loading.value = false;
    }
  });

  const declineAccount = $(async (item: AdminVerificationItem) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await adminService.verifyUser(item.id, "declined");
      success.value = `Akun ${item.name} ditolak.`;
      queryClient.invalidateQueries(KEY_PREFIX);
      await fetchList();
    } catch (err: unknown) {
      error.value = (err as Error)?.message || "Gagal menandai declined";
    } finally {
      loading.value = false;
    }
  });

  const clearMessages = $(() => {
    error.value = null;
    success.value = null;
  });

  return {
    items,
    loading,
    error,
    success,
    totalData,
    totalPages,
    page,
    limit,
    fetchList,
    verifyAccount,
    declineAccount,
    clearMessages,
  };
};
