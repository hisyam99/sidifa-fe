import { component$, useSignal, $ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { resetPasswordSchema, type ResetPasswordForm } from "~/types/auth";
import api from "~/services/api";
import { FormField, Alert, Card } from "~/components/ui";

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const location = useLocation();

  const [form, { Form, Field }] = useForm<ResetPasswordForm>({
    loader: { value: { token: "", password: "" } },
    validate: valiForm$(resetPasswordSchema),
  });

  const handleSubmit = $(async (values: ResetPasswordForm) => {
    console.log("📝 Reset Password - Form Data:", values);
    error.value = null;
    success.value = null;

    try {
      const response = await api.post("/auth/reset-password", values);
      console.log("🎉 Reset Password - Success Response:", response.data);
      success.value = "Password berhasil diubah!";

      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (err: any) {
      console.log("💥 Reset Password - Error:", err);
      error.value = err.response?.data?.message || "Gagal mengubah password";
    }
  });

  // Ambil token dari URL query parameter
  const token = location.url.searchParams.get("token") || "";

  return (
    <Card class="w-full max-w-md">
      <div class="text-center mb-6">
        <div class="avatar placeholder mb-4">
          <div class="bg-success text-success-content rounded-full w-16">
            <span class="text-2xl">🔒</span>
          </div>
        </div>
        <h1 class="text-2xl font-bold">Reset Password</h1>
        <p class="text-base-content/70 mt-2">Masukkan password baru Anda</p>
      </div>

      <Form onSubmit$={handleSubmit} class="space-y-4">
        <Field name="token">
          {(field: any, props: any) => (
            <div>
              <input {...props} type="hidden" value={token} />
            </div>
          )}
        </Field>

        <Field name="password">
          {(field: any, props: any) => (
            <FormField
              field={field}
              props={props}
              type="password"
              placeholder="Masukkan password baru"
              label="Password Baru"
              required
            />
          )}
        </Field>

        <button
          type="submit"
          class="btn btn-success w-full"
          disabled={form.submitting}
        >
          {form.submitting ? (
            <>
              <span class="loading loading-spinner loading-sm"></span>
              Mengubah...
            </>
          ) : (
            "Ubah Password"
          )}
        </button>
      </Form>

      <div class="divider">atau</div>

      <div class="text-center">
        <a href="/auth/login" class="btn btn-outline btn-sm w-full">
          Kembali ke Login
        </a>
      </div>

      {error.value && <Alert type="error" message={error.value} class="mt-4" />}
      {success.value && (
        <Alert type="success" message={success.value} class="mt-4" />
      )}
    </Card>
  );
});
