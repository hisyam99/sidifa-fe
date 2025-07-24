import { component$, useSignal, $ } from "@qwik.dev/core";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { loginSchema, type LoginForm } from "~/types/auth";
import api, { profileService } from "~/services/api";
import { sessionUtils } from "~/utils/auth";
import { Alert, Card, FormField } from "~/components/ui";
import { extractErrorMessage } from "~/utils/error";
import { LuArrowRight } from "~/components/icons/lucide-optimized"; // Updated import path

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  const [form, { Form, Field }] = useForm<LoginForm>({
    loader: { value: { email: "", password: "" } },
    validate: valiForm$(loginSchema),
    validateOn: "blur",
    revalidateOn: "blur",
  });

  const handleSubmit = $(async (values: LoginForm) => {
    error.value = null;
    success.value = null;
    try {
      await api.post("/auth/login", values);
      // Tandai status login berhasil di localStorage sebelum redirect
      sessionUtils.setAuthStatus(true);
      // Fetch user profile
      const profile = await profileService.getProfile();
      if (profile?.role) {
        sessionUtils.setUserProfile(profile);
        let redirectTo = "/dashboard";
        if (profile.role === "admin") redirectTo = "/admin";
        else if (profile.role === "psikolog") redirectTo = "/psikolog";
        else if (profile.role === "kader" || profile.role === "posyandu")
          redirectTo = "/kader";
        success.value = "Login berhasil!";
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 1000);
        return;
      }
      // Fallback jika tidak dapat role
      success.value = "Login berhasil!";
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err: any) {
      error.value = extractErrorMessage(err);
    }
  });

  return (
    <Card class="w-full max-w-md mx-auto">
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
          <a
            href="/auth/forgot-password"
            class="link link-primary text-sm font-medium"
          >
            Lupa Password?
          </a>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-full"
          disabled={form.submitting}
        >
          {form.submitting ? (
            <>
              <div class="skeleton w-4 h-4"></div>
              Masuk...
            </>
          ) : (
            <>
              Masuk ke SIDIFA <LuArrowRight class="w-4 h-4" />
            </>
          )}
        </button>
      </Form>

      <div class="divider">atau</div>

      <div class="text-center text-sm space-y-2">
        <span class="text-base-content/70">Belum punya akun?</span>
        <div class="flex flex-col sm:flex-row gap-2 justify-center mt-1">
          <a href="/auth/signup/kader" class="link link-primary font-medium">
            Daftar Posyandu
          </a>
          <span class="text-base-content/40">|</span>
          <a href="/auth/signup/psikolog" class="link link-primary font-medium">
            Daftar Psikolog
          </a>
        </div>
      </div>

      {error.value && <Alert type="error" message={error.value} class="mt-6" />}
      {success.value && (
        <Alert type="success" message={success.value} class="mt-6" />
      )}
    </Card>
  );
});
