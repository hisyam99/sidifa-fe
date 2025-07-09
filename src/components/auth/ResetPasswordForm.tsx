import { component$, useSignal, $ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { resetPasswordSchema, type ResetPasswordForm } from "~/types/auth";
import api from "~/services/api";
import FormField from "~/components/ui/FormField";
import Alert from "~/components/ui/Alert";

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
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      console.log("💥 Reset Password - Error:", err);
      error.value = err.response?.data?.message || "Gagal mengubah password";
    }
  });

  // Ambil token dari URL query parameter
  const token = location.url.searchParams.get("token") || "";

  return (
    <>
      <h1 class="text-2xl font-bold mb-4">Reset Password</h1>
      <p class="text-gray-600 mb-4">Masukkan password baru Anda.</p>

      <Form onSubmit$={handleSubmit} class="flex flex-col gap-3">
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
              placeholder="Password Baru"
            />
          )}
        </Field>

        <button
          type="submit"
          class="btn btn-primary"
          disabled={form.submitting}
        >
          {form.submitting ? "Mengubah..." : "Ubah Password"}
        </button>
      </Form>

      <div class="mt-4 text-center">
        <a href="/login" class="text-blue-500 hover:underline">
          Kembali ke Login
        </a>
      </div>

      {error.value && <Alert type="error" message={error.value} class="mt-2" />}
      {success.value && (
        <Alert type="success" message={success.value} class="mt-2" />
      )}
    </>
  );
});
