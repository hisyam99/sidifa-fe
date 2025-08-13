import { component$, QRL } from "@builder.io/qwik";
import type { AdminVerificationItem } from "~/types/admin-account-verification";

interface AdminVerificationDetailCardProps {
  item: AdminVerificationItem;
  onVerify$?: QRL<(item: AdminVerificationItem) => void>;
  onUnverify$?: QRL<(item: AdminVerificationItem) => void>;
}

export const AdminVerificationDetailCard = component$(
  (props: AdminVerificationDetailCardProps) => {
    const { item, onVerify$, onUnverify$ } = props;

    if (!item) {
      return (
        <div class="text-center text-base-content/60 py-8">
          No account selected.
        </div>
      );
    }

    const getStatusBadgeClass = (
      status: "verified" | "unverified" | "declined",
    ) => {
      if (status === "verified") return "badge-success";
      if (status === "declined") return "badge-error";
      return "badge-warning";
    };

    const getStatusLabel = (status: "verified" | "unverified" | "declined") => {
      if (status === "verified") return "Terverifikasi";
      if (status === "declined") return "Ditolak";
      return "Belum Terverifikasi";
    };

    return (
      <div class="card bg-base-100 shadow-md p-6">
        <h2 class="card-title text-xl font-bold mb-4">
          Detail Akun Verifikasi
        </h2>
        <div class="space-y-2 mb-4">
          <div>
            <b>Nama:</b> {item.name}
          </div>
          <div>
            <b>Email:</b> {item.email}
          </div>
          <div>
            <b>Peran:</b> {item.role}
          </div>
          <div>
            <b>Status Verifikasi:</b>{" "}
            <span class={`badge ${getStatusBadgeClass(item.verification)}`}>
              {getStatusLabel(item.verification)}
            </span>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 mt-4">
          {item.verification !== "verified" && onVerify$ && (
            <button class="btn btn-success" onClick$={() => onVerify$(item)}>
              Verifikasi Akun
            </button>
          )}
          {item.verification !== "unverified" && onUnverify$ && (
            <button class="btn btn-warning" onClick$={() => onUnverify$(item)}>
              Tandai Unverified
            </button>
          )}
        </div>
      </div>
    );
  },
);
