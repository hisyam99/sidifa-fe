import { component$, useSignal, $ } from "@qwik.dev/core";
import { useLocation, Link } from "@qwik.dev/router";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { resetPasswordSchema, type ResetPasswordForm } from "~/types/auth";
import api from "~/services/api";
import { FormField, Alert, Card } from "~/components/ui";
import { extractErrorMessage } from "~/utils/error";
import { LuLock } from "~/components/icons/lucide-optimized"; // Updated import path

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const location = useLocation();

  // Get token from URL safely for SSG
  const token = location.url?.searchParams?.get("token") || "";

  const [form, { Form, Field }] = useForm<ResetPasswordForm>({
    loader: { value: { token: token, password: "", confirmPassword: "" } },
    validate: valiForm$(resetPasswordSchema),
    validateOn: "blur",
    revalidateOn: "blur",
  });

  const handleSubmit = $(async (values: ResetPasswordForm) => {
    error.value = null;
    success.value = null;

    // Validasi token
    if (!values.token || values.token.trim() === "") {
      error.value = "Token reset password tidak valid atau sudah kadaluarsa";
      return;
    }

    // Validasi konfirmasi password
    if (values.password !== values.confirmPassword) {
      error.value = "Password dan konfirmasi password harus sama";
      return;
    }

    try {
      const requestData = {
        token: values.token,
        password: values.password,
      };

      await api.post("/auth/reset-password", requestData);
      success.value = "Password berhasil diubah!";

      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (err: unknown) {
      error.value = extractErrorMessage(err as string);
    }
  });

  // Form state is handled by the useForm hook

  return (
    <Card class="w-full">
      <div class="text-center mb-6">
        <div class="bg-success text-success-content w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <LuLock class="w-8 h-8" />
        </div>
        <h1 class="text-2xl font-bold">Reset Password</h1>
        <p class="text-base-content/70 mt-2">Masukkan password baru Anda</p>

        {/* Token is handled via hidden input */}
      </div>

      <Form onSubmit$={handleSubmit} class="space-y-4">
        <Field name="token">
          {(field, props) => <input {...props} type="hidden" value={token} />}
        </Field>

        <Field name="password">
          {(field, props) => {
            // Debug: Log perubahan password
            console.log("🔍 Password Field Change:", {
              value: field.value,
              length: field.value?.length || 0,
              hasError: !!field.error,
              error: field.error,
            });

            return (
              <FormField
                field={field}
                props={props}
                type="password"
                placeholder="Masukkan password baru"
                label="Password Baru"
                required
              />
            );
          }}
        </Field>

        <Field name="confirmPassword">
          {(field, props) => {
            // Debug: Log perubahan confirm password
            console.log("🔍 Confirm Password Field Change:", {
              value: field.value,
              length: field.value?.length || 0,
              hasError: !!field.error,
              error: field.error,
            });

            return (
              <FormField
                field={field}
                props={props}
                type="password"
                placeholder="Konfirmasi password baru"
                label="Konfirmasi Password"
                required
              />
            );
          }}
        </Field>

        <button
          type="submit"
          class="btn btn-success w-full"
          disabled={form.submitting}
          onClick$={() => {
            console.log("🔘 BUTTON CLICKED: Submit button pressed");
            console.log("🔘 Form submitting:", form.submitting);
            console.log("🔘 Form dirty:", form.dirty);
            console.log("🔘 Form touched:", form.touched);
            console.log("🔘 Form invalid:", form.invalid);
          }}
        >
          {form.submitting ? (
            <>
              <div class="skeleton w-4 h-4"></div>
              Mengubah...
            </>
          ) : (
            "Ubah Password"
          )}
        </button>
      </Form>

      <div class="divider">atau</div>

      <div class="text-center text-sm mt-2">
        <Link
          href="/auth/login"
          class="link link-primary font-medium w-full block"
        >
          Kembali ke Login
        </Link>
      </div>

      {error.value && <Alert type="error" message={error.value} class="mt-4" />}
      {success.value && (
        <Alert type="success" message={success.value} class="mt-4" />
      )}
    </Card>
  );
});
