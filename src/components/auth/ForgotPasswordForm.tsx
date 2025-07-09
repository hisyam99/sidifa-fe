import { component$, useSignal, $ } from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { forgotPasswordSchema, type ForgotPasswordForm } from "~/types/auth";
import api from "~/services/api";
import { FormField, Alert, Card } from "~/components/ui";
import { LuKey } from "@qwikest/icons/lucide";

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  const [form, { Form, Field }] = useForm<ForgotPasswordForm>({
    loader: { value: { email: "" } },
    validate: valiForm$(forgotPasswordSchema),
  });

  const handleSubmit = $(async (values: ForgotPasswordForm) => {
    console.log("Forgot Password - Form Data:", values);
    error.value = null;
    success.value = null;

    try {
      const response = await api.post("/auth/forgot-password", values);
      console.log("Forgot Password - Success Response:", response.data);
      success.value = "Email reset password telah dikirim!";
    } catch (err: any) {
      console.log("Forgot Password - Error:", err);
      error.value =
        err.response?.data?.message || "Gagal mengirim email reset password";
    }
  });

  return (
    <Card class="w-full max-w-md">
      <div class="text-center mb-6">
        <div class="avatar placeholder mb-4">
          <div class="bg-warning text-warning-content rounded-full w-16">
            <LuKey class="w-8 h-8 mx-auto" />
          </div>
        </div>
        <h1 class="text-2xl font-bold">Lupa Password</h1>
        <p class="text-base-content/70 mt-2">
          Masukkan email Anda untuk menerima link reset password
        </p>
      </div>

      <Form onSubmit$={handleSubmit} class="space-y-4">
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

        <button
          type="submit"
          class="btn btn-warning w-full"
          disabled={form.submitting}
        >
          {form.submitting ? (
            <>
              <span class="loading loading-spinner loading-sm" /> Mengirim...
            </>
          ) : (
            "Kirim Email Reset"
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
