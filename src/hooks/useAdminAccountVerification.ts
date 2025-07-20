import { useSignal, $ } from "@builder.io/qwik";
import { adminService } from "~/services/api";
import type { AdminVerificationItem } from "~/types/admin-account-verification"; // Removed unused import
import type { User } from "~/types/admin"; // Import User type

export const useAdminAccountVerification = () => {
  const items = useSignal<AdminVerificationItem[]>([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const total = useSignal<number>(0);
  const page = useSignal<number>(1);
  const limit = useSignal<number>(10);

  const fetchList = $(
    async (
      params: {
        limit?: number;
        page?: number;
        name?: string;
        role?: "admin" | "posyandu" | "psikolog" | "";
        status?: "verified" | "unverified" | "";
      } = {},
    ) => {
      loading.value = true;
      error.value = null;
      try {
        const response = await adminService.listUsers({
          limit: params.limit ?? limit.value,
          page: params.page ?? page.value,
          name: params.name,
          // role and status filters might need mapping to backend API expectations
          // For now, assume backend listUsers can filter by these directly or needs adjustments
        });

        // Filter response data by role and status manually if API doesn't support it directly
        let filteredData = response.data;
        if (params.role) {
          filteredData = filteredData.filter(
            (user: User) => user.role === params.role,
          );
        }
        if (params.status) {
          filteredData = filteredData.filter(
            (user: User) => user.verification === params.status,
          );
        }

        items.value = filteredData as AdminVerificationItem[];
        total.value = response.meta?.totalUsers || 0;
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
    total,
    page,
    limit,
    fetchList,
    verifyAccount,
    unverifyAccount,
    clearMessages,
  };
};
