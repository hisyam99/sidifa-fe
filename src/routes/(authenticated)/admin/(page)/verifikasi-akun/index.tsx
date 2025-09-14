import { component$, useSignal, $ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { useAuth } from "~/hooks";
import { useAdminAccountVerification } from "~/hooks/useAdminAccountVerification";
import { usePagination } from "~/hooks/usePagination";

import {
  AdminVerificationListHeader,
  AdminVerificationFilterControls,
  AdminVerificationTable,
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
    totalPages,
    fetchList,
    verifyAccount,
    declineAccount,
    clearMessages,
  } = useAdminAccountVerification();

  const filterOptions = useSignal<AdminVerificationFilterOptions>({
    name: "",
    role: "",
    orderBy: "",
  });

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

  const showVerifyModal = useSignal(false);
  const showDeclineModal = useSignal(false);
  const selectedAccount = useSignal<AdminVerificationItem | null>(null);

  const handleFilterChange = $(async () => {
    await resetPage();
    fetchList({
      ...filterOptions.value,
      page: 1,
      limit: limit.value,
    });
  });

  const openVerifyModal = $((account: AdminVerificationItem) => {
    selectedAccount.value = account;
    showVerifyModal.value = true;
    clearMessages();
  });

  const openDeclineModal = $((account: AdminVerificationItem) => {
    selectedAccount.value = account;
    showDeclineModal.value = true;
    clearMessages();
  });

  const closeModals = $(() => {
    showVerifyModal.value = false;
    showDeclineModal.value = false;
    selectedAccount.value = null;
    clearMessages();
  });

  const handleVerifyAccount = $(async () => {
    if (selectedAccount.value) {
      await verifyAccount(selectedAccount.value);
      if (!error.value) closeModals();
    }
  });

  const handleDeclineAccount = $(async () => {
    if (selectedAccount.value) {
      await declineAccount(selectedAccount.value);
      if (!error.value) closeModals();
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
        onVerify$={openVerifyModal}
        onDecline$={openDeclineModal}
      />

      {meta.value && meta.value.totalPage > 1 && (
        <PaginationControls
          meta={meta.value}
          currentPage={currentPage.value}
          onPageChange$={$((newPage: number) => {
            handlePageChange(newPage);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const el = document.getElementById("admin-verif-table-title");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              });
            });
          })}
        />
      )}

      {/* Verify Confirmation Modal */}
      {showVerifyModal.value && selectedAccount.value && (
        <ConfirmationModal
          isOpen={showVerifyModal}
          title="Konfirmasi Verifikasi Akun"
          message={`Apakah Anda yakin ingin memverifikasi dan mengaktifkan akun "${selectedAccount.value.name}" dengan peran "${selectedAccount.value.role}"? Setelah diverifikasi, pengguna dapat mengakses sistem sesuai dengan hak akses perannya.`}
          onConfirm$={handleVerifyAccount}
          onCancel$={closeModals}
          confirmButtonText="✓ Verifikasi & Aktifkan Akun"
          cancelButtonText="✕ Batal Verifikasi"
          confirmButtonClass="btn-success"
        />
      )}

      {/* Decline Confirmation Modal */}
      {showDeclineModal.value && selectedAccount.value && (
        <ConfirmationModal
          isOpen={showDeclineModal}
          title="Konfirmasi Penolakan Akun"
          message={`Apakah Anda yakin ingin menolak dan memblokir akun "${selectedAccount.value.name}" dengan peran "${selectedAccount.value.role}"? Akun yang ditolak tidak akan dapat mengakses sistem dan pengguna akan menerima notifikasi penolakan.`}
          onConfirm$={handleDeclineAccount}
          onCancel$={closeModals}
          confirmButtonText="⚠ Tolak & Blokir Akun"
          cancelButtonText="✕ Batal Penolakan"
          confirmButtonClass="btn-error"
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
