import { component$ } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";

export type AccountStatusVariant = "unverified" | "declined";

interface AccountStatusCardProps {
  variant: AccountStatusVariant;
  title?: string;
  message?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export const AccountStatusCard = component$<AccountStatusCardProps>(
  ({
    variant,
    title,
    message,
    contactEmail = "info@sidifa.id",
    contactPhone = "+62 341 123456",
  }) => {
    const isDeclined = variant === "declined";

    const defaultTitle = isDeclined
      ? "Pendaftaran Ditolak"
      : "Akun Menunggu Verifikasi";
    const defaultMessage = isDeclined
      ? "Mohon maaf, pendaftaran akun Anda ditolak oleh admin. Jika Anda merasa ini sebuah kekeliruan, silakan hubungi admin untuk klarifikasi atau informasi lebih lanjut."
      : "Akun Anda belum dapat digunakan karena masih menunggu verifikasi oleh admin. Silakan cek email Anda secara berkala untuk informasi status verifikasi.";

    return (
      <div
        class={`card ${isDeclined ? "bg-base-200 border border-error/30" : "bg-base-200 border border-base-300"} shadow-sm`}
      >
        <div class="card-body">
          <h2 class={`card-title text-lg ${isDeclined ? "text-error" : ""}`}>
            {title || defaultTitle}
          </h2>
          <p class="text-base-content/80">{message || defaultMessage}</p>
          <div class="mt-4">
            <p class="text-sm text-base-content/70">Kontak Admin</p>
            <p class="text-sm">
              Email:{" "}
              <Link href={`mailto:${contactEmail}`} class="link link-primary">
                {contactEmail}
              </Link>{" "}
              — Telepon:{" "}
              <Link href={`tel:${contactPhone}`} class="link">
                {contactPhone}
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  },
);
