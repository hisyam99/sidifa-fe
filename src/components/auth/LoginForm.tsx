import { component$, useSignal, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { loginSchema, type LoginForm } from "~/types/auth";
import api, { profileService } from "~/services/api";
import { sessionUtils } from "~/utils/auth";
import { Card, FormField } from "~/components/ui";
import { extractErrorMessage } from "~/utils/error";
import { LuArrowRight } from "~/components/icons/lucide-optimized"; // Updated import path
import {
  emitToastSuccess,
  emitToastError,
} from "~/components/ui/toast/ToastProvider";
import { AccountStatusCard } from "~/components/ui/AccountStatusCard";
import { setUiAuthCookies } from "~/utils/ui-auth-cookie";

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const accountStatus = useSignal<"unverified" | "declined" | null>(null);

  const [form, { Form, Field }] = useForm<LoginForm>({
    loader: { value: { email: "", password: "" } },
    validate: valiForm$(loginSchema),
    validateOn: "blur",
    revalidateOn: "blur",
  });

  const handleSubmit = $(async (values: LoginForm) => {
    error.value = null;
    success.value = null;
    accountStatus.value = null;
    try {
      await api.post("/auth/login", values);
      // Tandai status login berhasil di localStorage sebelum redirect
      sessionUtils.setAuthStatus(true);
      // Fetch user profile
      const profile = await profileService.getProfile();
      if (profile?.role) {
        sessionUtils.setUserProfile(profile);
        // Set UI auth cookies untuk SSR snapshot
        setUiAuthCookies({
          userId: profile.id,
          email: profile.email,
          role: profile.role,
        });
        let redirectTo = "/dashboard";
        if (profile.role === "admin") redirectTo = "/admin";
        else if (profile.role === "psikolog") redirectTo = "/psikolog";
        else if (profile.role === "kader" || profile.role === "posyandu")
          redirectTo = "/kader";
        success.value = "Login berhasil!";
        await emitToastSuccess("Login berhasil! Mengalihkan...", 1200);
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 1000);
        return;
      }
      // Fallback jika tidak dapat role
      success.value = "Login berhasil!";
      await emitToastSuccess("Login berhasil! Mengalihkan...", 1200);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err: any) {
      const raw = extractErrorMessage(err);
      const msg = raw.toLowerCase();

      // Tangani status khusus dari backend
      if (msg.includes("unverified")) {
        accountStatus.value = "unverified";
        await emitToastError(
          "Akun Anda belum terverifikasi. Silakan tunggu hingga admin memverifikasi akun Anda. Cek email Anda secara berkala untuk update.",
        );
        return;
      }
      if (msg.includes("declined") || msg.includes("ditolak")) {
        accountStatus.value = "declined";
        return;
      }

      error.value = raw;
      await emitToastError(raw);
    }
  });

  return (
    <Card class="w-full mx-auto">
      <div class="text-center mb-8">
        <div class="bg-gradient-primary rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-xl">
          <LuArrowRight class="w-8 h-8" />
        </div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gradient-primary mb-2">
          Masuk ke SIDIFA
        </h1>
        <p class="text-base-content/70 text-sm lg:text-base">
          Silakan masuk dengan akun Anda untuk mengakses layanan
        </p>
      </div>

      {accountStatus.value === "declined" ? (
        <div class="space-y-6">
          <AccountStatusCard variant="declined" />
          <div class="text-center">
            <Link href="/" class="btn btn-ghost">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      ) : (
        <Form onSubmit$={handleSubmit} class="space-y-6 w-full">
          <Field name="email">
            {(field: any, props: any) => (
              <FormField
                field={field}
                props={props}
                type="email"
                placeholder="Masukkan email Anda"
                label="Email"
                required
              />
            )}
          </Field>

          <Field name="password">
            {(field: any, props: any) => (
              <FormField
                field={field}
                props={props}
                type="password"
                placeholder="Masukkan password Anda"
                label="Password"
                required
              />
            )}
          </Field>

          <div class="flex items-center justify-between w-full">
            <label class="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                class="checkbox checkbox-primary checkbox-sm"
              />
              <span class="label-text font-medium">Ingat saya</span>
            </label>
            <Link
              href="/auth/forgot-password"
              class="link link-primary text-sm font-medium"
            >
              Lupa Password?
            </Link>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full"
            disabled={form.submitting}
          >
            {form.submitting ? (
              <>
                <div class="skeleton w-4 h-4"></div>
                Memproses...
              </>
            ) : (
              <>Masuk</>
            )}
          </button>
        </Form>
      )}
    </Card>
  );
});
