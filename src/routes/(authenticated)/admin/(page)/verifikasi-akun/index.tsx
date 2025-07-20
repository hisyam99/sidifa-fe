import {
  component$,
  useSignal,
  useTask$,
  useComputed$,
  $,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
import { useAdminAccountVerification } from "~/hooks/useAdminAccountVerification";

import {
  AdminVerificationListHeader,
  AdminVerificationFilterControls,
  AdminVerificationTable,
  AdminVerificationDetailCard,
} from "~/components/admin/account-verification";
import {
  PaginationControls,
  ConfirmationModal,
  GenericLoadingSpinner,
} from "~/components/common";
import Alert from "~/components/ui/Alert";

import type {
  AdminVerificationItem,
  AdminVerificationFilterOptions,
} from "~/types/admin-account-verification";
import type { PaginationMeta } from "~/types/posyandu"; // Reusing pagination meta

export default component$(() => {
  const { isLoggedIn } = useAuth();
  const {
    items: verificationList,
    loading,
    error,
    success,
    total,
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
  const currentPage = useSignal(1);
  const limit = useSignal(10);

  const meta = useComputed$<PaginationMeta>(() => {
    return {
      totalData: total.value,
      totalPage: Math.ceil(total.value / limit.value),
      currentPage: currentPage.value,
      limit: limit.value,
    };
  });

  const showDetailModal = useSignal(false);
  const showVerifyModal = useSignal(false);
  const showUnverifyModal = useSignal(false);
  const selectedAccount = useSignal<AdminVerificationItem | null>(null);

  const handleFetchVerificationList = $(async () => {
    await fetchList({
      limit: limit.value,
      page: currentPage.value,
      name: filterOptions.value.name || undefined,
      role: filterOptions.value.role || undefined,
      orderBy: filterOptions.value.orderBy || undefined,
    });
  });

  useTask$(({ track }) => {
    track(isLoggedIn);
    track(() => filterOptions.value.name);
    track(() => filterOptions.value.role);
    track(currentPage);
    track(limit);

    if (isLoggedIn.value) {
      handleFetchVerificationList();
    } else {
      verificationList.value = [];
    }
  });

  const handleFilterChange = $(() => {
    currentPage.value = 1;
    handleFetchVerificationList();
  });

  const handlePageChange = $((pageNumber: number) => {
    if (
      meta.value.totalPage &&
      (pageNumber < 1 || pageNumber > meta.value.totalPage)
    )
      return;
    currentPage.value = pageNumber;
  });

  const handleLimitChange = $((newLimit: number) => {
    limit.value = newLimit;
    currentPage.value = 1; // Reset to first page when limit changes
    handleFetchVerificationList();
  });

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
    handleFetchVerificationList();
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

      {loading.value ? (
        <GenericLoadingSpinner />
      ) : (
        <AdminVerificationTable
          items={verificationList.value}
          page={currentPage.value}
          limit={limit.value}
          onViewDetail$={openDetailModal}
          onVerify$={openVerifyModal}
          onUnverify$={openUnverifyModal}
        />
      )}

      {meta.value.totalPage > 1 && (
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
