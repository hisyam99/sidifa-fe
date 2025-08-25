import { component$, useSignal, $ } from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { signupPsikologSchema, type SignupPsikologForm } from "~/types/auth";
import api, { profileService } from "~/services/api";
import { FormField, Card } from "~/components/ui";
import { extractErrorMessage } from "~/utils/error";
import { sessionUtils } from "~/utils/auth";
import { LuBrain, LuArrowRight } from "~/components/icons/lucide-optimized"; // Updated import path
import { useNavigate, Link } from "@builder.io/qwik-city";
import {
  emitToastSuccess,
  emitToastError,
} from "~/components/ui/toast/ToastProvider";

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const verificationStatus = useSignal<"unverified" | "declined" | null>(null);
  const nav = useNavigate();

  const [form, { Form, Field }] = useForm<SignupPsikologForm>({
    loader: {
      value: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        no_telp: "",
        spesialis: "",
        lokasi: "",
      },
    },
    validate: valiForm$(signupPsikologSchema),
    validateOn: "change",
    revalidateOn: "change",
  });

  const handleSubmit = $(async (values: SignupPsikologForm) => {
    error.value = null;
    success.value = null;
    verificationStatus.value = null;

    try {
      await api.post("/auth/signup/psikolog", values);

      // Coba auto login setelah pendaftaran
      try {
        await api.post("/auth/login", {
          email: values.email,
          password: values.password,
        });
      } catch (loginErr: unknown) {
        const msg = extractErrorMessage(loginErr as any).toLowerCase();
        if (msg.includes("unverified")) {
          verificationStatus.value = "unverified";
          await emitToastError(
            "Akun Anda belum terverifikasi. Silakan tunggu hingga admin memverifikasi akun Anda. Cek email Anda secara berkala untuk update.",
          );
          return;
        }
        if (msg.includes("declined") || msg.includes("ditolak")) {
          verificationStatus.value = "declined";
          await emitToastError(
            "Pendaftaran akun Anda ditolak oleh admin. Silakan hubungi admin untuk klarifikasi.",
          );
          return;
        }
        throw loginErr;
      }

      // Tandai status login berhasil dan ambil profil pengguna
      sessionUtils.setAuthStatus(true);
      const profile = await profileService.getProfile();

      // Jika backend menyertakan status verifikasi pada profil
      if (profile?.verification && profile.verification !== "verified") {
        verificationStatus.value =
          profile.verification === "unverified" ? "unverified" : "declined";
        sessionUtils.clearAllAuthData();
        await emitToastError(
          "Akun Anda belum terverifikasi atau ditolak. Silakan hubungi admin.",
        );
        return;
      }

      if (profile?.role) {
        sessionUtils.setUserProfile(profile);
        let redirectTo = "/dashboard";
        if (profile.role === "admin") redirectTo = "/admin";
        else if (profile.role === "psikolog") redirectTo = "/psikolog";
        else if (profile.role === "kader" || profile.role === "posyandu")
          redirectTo = "/kader";

        success.value = "Pendaftaran berhasil! Anda akan diarahkan...";
        await emitToastSuccess(success.value, 1200);
        setTimeout(() => {
          nav(redirectTo);
        }, 1000);
        return;
      }

      success.value = "Pendaftaran berhasil! Anda akan diarahkan...";
      await emitToastSuccess(success.value, 1200);
      setTimeout(() => {
        nav("/dashboard");
      }, 1000);
    } catch (err: unknown) {
      error.value = extractErrorMessage(err as string);
      await emitToastError(error.value);
    }
  });

  return (
    <Card class="w-full mx-auto">
      <div class="text-center mb-8">
        <div class="bg-primary text-primary-content rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-xl">
          <LuBrain class="w-8 h-8" />
        </div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gradient-primary mb-2">
          Daftar Psikolog
        </h1>
        <p class="text-base-content/70 text-sm lg:text-base">
          Daftarkan praktik psikologi Anda ke sistem SIDIFA
        </p>
      </div>

      {verificationStatus.value ? (
        <div class="space-y-6">
          {verificationStatus.value === "unverified" && (
            <div class="card bg-base-200 border border-base-300 shadow-sm">
              <div class="card-body">
                <h2 class="card-title text-lg">Akun Menunggu Verifikasi</h2>
                <p class="text-base-content/80">
                  Pendaftaran berhasil, namun akun Anda belum dapat digunakan
                  karena masih menunggu verifikasi oleh admin. Silakan cek email
                  Anda secara berkala untuk informasi status verifikasi.
                </p>
                <div class="mt-4">
                  <p class="text-sm text-base-content/70">Butuh bantuan?</p>
                  <p class="text-sm">
                    Hubungi admin:{" "}
                    <Link
                      href="mailto:info@sidifa.id"
                      class="link link-primary"
                    >
                      info@sidifa.id
                    </Link>{" "}
                    atau telepon{" "}
                    <Link href="tel:+62341123456" class="link">
                      +62 341 123456
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}

          {verificationStatus.value === "declined" && (
            <div class="card bg-base-200 border border-error/30 shadow-sm">
              <div class="card-body">
                <h2 class="card-title text-lg text-error">
                  Pendaftaran Ditolak
                </h2>
                <p class="text-base-content/80">
                  Mohon maaf, pendaftaran akun Anda ditolak oleh admin. Jika
                  Anda merasa ini sebuah kekeliruan, silakan hubungi admin untuk
                  klarifikasi atau informasi lebih lanjut.
                </p>
                <div class="mt-4">
                  <p class="text-sm text-base-content/70">Kontak Admin</p>
                  <p class="text-sm">
                    Email:{" "}
                    <Link
                      href="mailto:info@sidifa.id"
                      class="link link-primary"
                    >
                      info@sidifa.id
                    </Link>{" "}
                    — Telepon:{" "}
                    <Link href="tel:+62341123456" class="link">
                      +62 341 123456
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div class="text-center">
            <Link href="/" class="btn btn-ghost">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      ) : (
        <>
          <Form onSubmit$={handleSubmit} class="space-y-6 w-full">
            {/* Personal Information */}
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-base-content">
                Informasi Pribadi
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field name="name">
                  {(field, props) => (
                    <FormField
                      field={field}
                      props={props}
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      label="Nama Lengkap"
                      required
                    />
                  )}
                </Field>

                <Field name="email">
                  {(field, props) => (
                    <FormField
                      field={field}
                      props={props}
                      type="email"
                      placeholder="Masukkan email"
                      label="Email"
                      required
                    />
                  )}
                </Field>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field name="no_telp">
                  {(field, props) => (
                    <FormField
                      field={field}
                      props={props}
                      type="tel"
                      placeholder="Masukkan nomor telepon"
                      label="Nomor Telepon"
                      required
                    />
                  )}
                </Field>
              </div>
            </div>

            {/* Password Section */}
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-base-content">
                Keamanan Akun
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field name="password">
                  {(field, props) => (
                    <FormField
                      field={field}
                      props={props}
                      type="password"
                      placeholder="Masukkan password"
                      label="Password"
                      required
                    />
                  )}
                </Field>

                <Field name="confirmPassword">
                  {(field, props) => (
                    <FormField
                      field={field}
                      props={props}
                      type="password"
                      placeholder="Konfirmasi password"
                      label="Konfirmasi Password"
                      required
                    />
                  )}
                </Field>
              </div>
            </div>

            {/* Professional Information */}
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-base-content">
                Informasi Profesional
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field name="spesialis">
                  {(field, props) => (
                    <FormField
                      field={field}
                      props={props}
                      type="text"
                      placeholder="Masukkan spesialisasi"
                      label="Spesialisasi"
                      required
                    />
                  )}
                </Field>

                <Field name="lokasi">
                  {(field, props) => (
                    <FormField
                      field={field}
                      props={props}
                      type="text"
                      placeholder="Masukkan lokasi praktik"
                      label="Lokasi Praktik"
                      required
                    />
                  )}
                </Field>
              </div>
            </div>

            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-2">
                <input type="checkbox" class="checkbox checkbox-sm" required />
                <span class="label-text">
                  Saya setuju dengan{" "}
                  <Link href="/terms" class="link link-primary">
                    syarat dan ketentuan
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-full"
              disabled={form.submitting}
            >
              {form.submitting ? (
                <>
                  <div class="skeleton w-4 h-4"></div>
                  Mendaftar...
                </>
              ) : (
                <>
                  Daftar Psikolog <LuArrowRight class="w-4 h-4" />
                </>
              )}
            </button>
          </Form>

          <div class="divider">atau</div>

          <div class="text-center text-sm">
            <span class="text-base-content/70">Sudah punya akun? </span>
            <Link href="/auth/login" class="link link-primary font-medium">
              Masuk sekarang
            </Link>
          </div>
        </>
      )}
    </Card>
  );
});
