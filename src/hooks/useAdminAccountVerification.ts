import { useSignal, $ } from "@qwik.dev/core";
import { adminService } from "~/services/api";
import type { AdminVerificationItem } from "~/types/admin-account-verification";

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
        verification?: "verified" | "unverified" | "";
        orderBy?: "asc" | "desc" | "";
      } = {},
    ) => {
      loading.value = true;
      error.value = null;
      try {
        const response = await adminService.listUsers({
          limit: params.limit ?? limit.value,
          page: params.page ?? page.value,
          name: params.name,
          role: params.role,
          verification: params.verification,
          orderBy: params.orderBy,
        });

        items.value = response.data as AdminVerificationItem[];
        totalData.value = response.meta?.totalData || 0;
        totalPages.value = response.meta?.totalPage || 1;
        page.value = response.meta?.currentPage || 1;
        limit.value = response.meta?.limit || 10;
      } catch (err: any) {
        error.value = err.message || "Gagal memuat data verifikasi akun";
      } finally {
        loading.value = false;
      }
    },
  );

  const verifyAccount = $(async (item: AdminVerificationItem) => {
    loading.value = true;
    error.value = null;
    try {
      await adminService.verifyUser(item.id, "verified");
      success.value = `Akun ${item.name} berhasil diverifikasi.`;
      await fetchList();
    } catch (err: any) {
      error.value = err.message || "Gagal memverifikasi akun";
    } finally {
      loading.value = false;
    }
  });

  const unverifyAccount = $(async (item: AdminVerificationItem) => {
    loading.value = true;
    error.value = null;
    try {
      await adminService.verifyUser(item.id, "unverified");
      success.value = `Akun ${item.name} berhasil dibatalkan verifikasinya.`;
      await fetchList();
    } catch (err: any) {
      error.value = err.message || "Gagal membatalkan verifikasi akun";
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
    unverifyAccount,
    clearMessages,
  };
};
