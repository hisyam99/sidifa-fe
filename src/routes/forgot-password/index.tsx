import { component$, useSignal, $ } from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { forgotPasswordSchema, type ForgotPasswordForm } from "~/types/auth";
import api from "~/services/api";

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  const [form, { Form, Field }] = useForm<ForgotPasswordForm>({
    loader: { value: { email: "" } },
    validate: valiForm$(forgotPasswordSchema),
  });

  const handleSubmit = $(async (values: ForgotPasswordForm) => {
    console.log("📝 Forgot Password - Form Data:", values);
    error.value = null;
    success.value = null;

    try {
      const response = await api.post("/auth/forgot-password", values);
      console.log("🎉 Forgot Password - Success Response:", response.data);
      success.value = "Email reset password telah dikirim!";
    } catch (err: any) {
      console.log("💥 Forgot Password - Error:", err);
      error.value =
        err.response?.data?.message || "Gagal mengirim email reset password";
    }
  });

  return (
    <div class="container mx-auto max-w-md p-4">
      <h1 class="text-2xl font-bold mb-4">Lupa Password</h1>
      <p class="text-gray-600 mb-4">
        Masukkan email Anda untuk menerima link reset password.
      </p>

      <Form onSubmit$={handleSubmit} class="flex flex-col gap-3">
        <Field name="email">
          {(field: any, props: any) => (
            <div>
              <input
                {...props}
                type="email"
                placeholder="Email"
                class="input input-bordered w-full"
              />
              {field.error && (
                <div class="text-red-500 text-sm mt-1">{field.error}</div>
              )}
            </div>
          )}
        </Field>

        <button
          type="submit"
          class="btn btn-primary"
          disabled={form.submitting}
        >
          {form.submitting ? "Mengirim..." : "Kirim Email Reset"}
        </button>
      </Form>

      <div class="mt-4 text-center">
        <a href="/login" class="text-blue-500 hover:underline">
          Kembali ke Login
        </a>
      </div>

      {error.value && <div class="text-red-500 mt-2">{error.value}</div>}
      {success.value && <div class="text-green-500 mt-2">{success.value}</div>}
    </div>
  );
});
