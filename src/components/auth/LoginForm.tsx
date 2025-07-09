import { component$, useSignal, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { loginSchema, type LoginForm } from "~/types/auth";
import api from "~/services/api";
import FormField from "~/components/ui/FormField";
import Alert from "~/components/ui/Alert";

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const nav = useNavigate();

  const [form, { Form, Field }] = useForm<LoginForm>({
    loader: { value: { email: "", password: "" } },
    validate: valiForm$(loginSchema),
  });

  const handleSubmit = $(async (values: LoginForm) => {
    console.log("📝 Login - Form Data:", values);
    error.value = null;
    success.value = null;

    try {
      const response = await api.post("/auth/login", values);
      console.log("🎉 Login - Success Response:", response.data);

      // Simpan access_token ke localStorage
      localStorage.setItem("access_token", response.data.access_token);

      // Buat user data dari response
      const userData = {
        id: response.data.user?.id || Date.now(),
        name: response.data.user?.name || values.email.split("@")[0],
        email: values.email,
        role: response.data.user?.role || "user",
        no_telp: response.data.user?.no_telp || "",
        nama_posyandu: response.data.user?.nama_posyandu || "",
        lokasi: response.data.user?.lokasi || "",
        spesialis: response.data.user?.spesialis || "",
      };

      localStorage.setItem("user", JSON.stringify(userData));

      success.value = "Login berhasil!";

      // Redirect ke profile setelah 1 detik
      setTimeout(() => {
        nav("/profile");
      }, 1000);
    } catch (err: any) {
      console.log("💥 Login - Error:", err);
      error.value = err.response?.data?.message || "Login gagal";
    }
  });

  return (
    <>
      <h1 class="text-2xl font-bold mb-4">Login</h1>

      <Form onSubmit$={handleSubmit} class="flex flex-col gap-3">
        <Field name="email">
          {(field: any, props: any) => (
            <FormField
              field={field}
              props={props}
              type="email"
              placeholder="Email"
            />
          )}
        </Field>

        <Field name="password">
          {(field: any, props: any) => (
            <FormField
              field={field}
              props={props}
              type="password"
              placeholder="Password"
            />
          )}
        </Field>

        <button
          type="submit"
          class="btn btn-primary"
          disabled={form.submitting}
        >
          {form.submitting ? "Login..." : "Login"}
        </button>
      </Form>

      <div class="mt-4 text-center">
        <a href="/forgot-password" class="text-blue-500 hover:underline">
          Lupa Password?
        </a>
      </div>

      {error.value && <Alert type="error" message={error.value} class="mt-2" />}
      {success.value && (
        <Alert type="success" message={success.value} class="mt-2" />
      )}
    </>
  );
});
