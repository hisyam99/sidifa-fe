import { component$, useSignal, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { loginSchema, type LoginForm } from "~/types/auth";
import api from "~/services/api";
import { FormField, Alert, Card } from "~/components/ui";

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
        nav("/dashboard/profile");
      }, 1000);
    } catch (err: any) {
      console.log("💥 Login - Error:", err);
      error.value = err.response?.data?.message || "Login gagal";
    }
  });

  return (
    <Card class="w-full max-w-md">
      <div class="text-center mb-6">
        <div class="avatar placeholder mb-4">
          <div class="bg-primary text-primary-content rounded-full w-16">
            <span class="text-2xl">🔐</span>
          </div>
        </div>
        <h1 class="text-2xl font-bold">Masuk ke SIDIFA</h1>
        <p class="text-base-content/70 mt-2">Silakan masuk dengan akun Anda</p>
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

        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-2">
            <input type="checkbox" class="checkbox checkbox-sm" />
            <span class="label-text">Ingat saya</span>
          </label>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-full"
          disabled={form.submitting}
        >
          {form.submitting ? (
            <>
              <span class="loading loading-spinner loading-sm"></span>
              Masuk...
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </Form>

      <div class="divider">atau</div>

      <div class="space-y-3">
        <a href="/auth/forgot-password" class="btn btn-outline btn-sm w-full">
          Lupa Password?
        </a>

        <div class="text-center text-sm">
          <span class="text-base-content/70">Belum punya akun? </span>
          <a href="/auth/signup/posyandu" class="link link-primary font-medium">
            Daftar sekarang
          </a>
        </div>
      </div>

      {error.value && <Alert type="error" message={error.value} class="mt-4" />}
      {success.value && (
        <Alert type="success" message={success.value} class="mt-4" />
      )}
    </Card>
  );
});
