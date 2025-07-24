import { component$, useSignal, $ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { useAuth } from "~/hooks";
import { useAdminAccountVerification } from "~/hooks/useAdminAccountVerification";
import { usePagination } from "~/hooks/usePagination";

import {
  AdminVerificationListHeader,
  AdminVerificationFilterControls,
  AdminVerificationTable,
  AdminVerificationDetailCard,
} from "~/components/admin/account-verification";
import { PaginationControls, ConfirmationModal } from "~/components/common";
import Alert from "~/components/ui/Alert";

import type {
  AdminVerificationItem,
  AdminVerificationFilterOptions,
} from "~/types/admin-account-verification";

export default component$(() => {
  const { isLoggedIn } = useAuth();
  const {
    items: verificationList,
    loading,
    error,
    success,
    totalData,
    totalPages, // <-- import this
    fetchList,
    verifyAccount,
    unverifyAccount,
    clearMessages,
  } = useAdminAccountVerification();

  const filterOptions = useSignal<AdminVerificationFilterOptions>({
    name: "",
    role: "",
    orderBy: "",
  });
  // Use the reusable pagination hook
  const {
    currentPage,
    currentLimit: limit,
    meta,
    handlePageChange,
    handleLimitChange,
    resetPage,
  } = usePagination<AdminVerificationFilterOptions>({
    initialPage: 1,
    initialLimit: 10,
    fetchList: $((params) => {
      if (isLoggedIn.value) {
        fetchList(params);
      }
    }),
    total: totalData,
    totalPage: totalPages,
    filters: filterOptions,
    dependencies: [isLoggedIn],
  });

  const showDetailModal = useSignal(false);
  const showVerifyModal = useSignal(false);
  const showUnverifyModal = useSignal(false);
  const selectedAccount = useSignal<AdminVerificationItem | null>(null);

  // Filter change handler resets page and triggers fetch
  const handleFilterChange = $(async () => {
    await resetPage();
    // After resetting page, force fetch in case page is already 1
    fetchList({
      ...filterOptions.value,
      page: 1,
      limit: limit.value,
    });
  });

  // (removed obsolete handleLimitChange)

  const openDetailModal = $((account: AdminVerificationItem) => {
    selectedAccount.value = account;
    showDetailModal.value = true;
    clearMessages();
  });

  const openVerifyModal = $((account: AdminVerificationItem) => {
    selectedAccount.value = account;
    showVerifyModal.value = true;
    clearMessages();
  });

  const openUnverifyModal = $((account: AdminVerificationItem) => {
    selectedAccount.value = account;
    showUnverifyModal.value = true;
    clearMessages();
  });

  const closeModals = $(() => {
    showDetailModal.value = false;
    showVerifyModal.value = false;
    showUnverifyModal.value = false;
    selectedAccount.value = null;
    clearMessages();
  });

  const handleVerifyAccount = $(async () => {
    if (selectedAccount.value) {
      await verifyAccount(selectedAccount.value);
      if (!error.value) {
        closeModals();
      }
    }
  });

  const handleUnverifyAccount = $(async () => {
    if (selectedAccount.value) {
      await unverifyAccount(selectedAccount.value);
      if (!error.value) {
        closeModals();
      }
    }
  });

  return (
    <div>
      <AdminVerificationListHeader
        title="Verifikasi Akun Pengguna"
        description="Kelola status verifikasi akun pengguna, memastikan keabsahan data dan akses."
      />

      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}

      <AdminVerificationFilterControls
        filterOptions={filterOptions}
        onFilterChange$={handleFilterChange}
        limit={limit}
        onLimitChange$={handleLimitChange}
      />

      <AdminVerificationTable
        items={verificationList.value}
        page={currentPage.value}
        limit={limit.value}
        loading={loading.value}
        onViewDetail$={openDetailModal}
        onVerify$={openVerifyModal}
        onUnverify$={openUnverifyModal}
      />

      {meta.value && meta.value.totalPage > 1 && (
        <PaginationControls
          meta={meta.value}
          currentPage={currentPage.value}
          onPageChange$={handlePageChange}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal.value && selectedAccount.value && (
        <ConfirmationModal
          isOpen={showDetailModal}
          title="Detail Akun"
          message=""
          onConfirm$={closeModals} // No direct confirm action for detail, just close
          onCancel$={closeModals}
          confirmButtonText="Tutup"
          confirmButtonClass="btn-primary"
        >
          <AdminVerificationDetailCard
            item={selectedAccount.value}
            onVerify$={openVerifyModal}
            onUnverify$={openUnverifyModal}
          />
        </ConfirmationModal>
      )}

      {/* Verify Confirmation Modal */}
      {showVerifyModal.value && selectedAccount.value && (
        <ConfirmationModal
          isOpen={showVerifyModal}
          title="Konfirmasi Verifikasi"
          message={`Apakah Anda yakin ingin memverifikasi akun "${selectedAccount.value.name}"?`}
          onConfirm$={handleVerifyAccount}
          onCancel$={closeModals}
          confirmButtonText="Verifikasi"
          cancelButtonText="Batal"
          confirmButtonClass="btn-success"
        />
      )}

      {/* Unverify Confirmation Modal */}
      {showUnverifyModal.value && selectedAccount.value && (
        <ConfirmationModal
          isOpen={showUnverifyModal}
          title="Konfirmasi Pembatalan Verifikasi"
          message={`Apakah Anda yakin ingin membatalkan verifikasi akun "${selectedAccount.value.name}"?`}
          onConfirm$={handleUnverifyAccount}
          onCancel$={closeModals}
          confirmButtonText="Batalkan Verifikasi"
          cancelButtonText="Batal"
          confirmButtonClass="btn-warning"
        />
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Verifikasi Akun - Si-DIFA Admin",
  meta: [
    {
      name: "description",
      content: "Halaman verifikasi akun pengguna untuk admin Si-DIFA",
    },
  ],
};
