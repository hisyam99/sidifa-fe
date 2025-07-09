import { component$, useSignal, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { loginSchema, type LoginForm } from "~/types/auth";
import api from "~/services/api";

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
    <div class="container mx-auto max-w-md p-4">
      <h1 class="text-2xl font-bold mb-4">Login</h1>

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

        <Field name="password">
          {(field: any, props: any) => (
            <div>
              <input
                {...props}
                type="password"
                placeholder="Password"
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
          {form.submitting ? "Login..." : "Login"}
        </button>
      </Form>

      <div class="mt-4 text-center">
        <a href="/forgot-password" class="text-blue-500 hover:underline">
          Lupa Password?
        </a>
      </div>

      {error.value && <div class="text-red-500 mt-2">{error.value}</div>}
      {success.value && <div class="text-green-500 mt-2">{success.value}</div>}
    </div>
  );
});
