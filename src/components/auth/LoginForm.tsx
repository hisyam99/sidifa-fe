import { component$, useSignal, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { loginSchema, type LoginForm } from "~/types/auth";
import api from "~/services/api";
import { Alert } from "~/components/ui";
import {
  LuLock,
  LuMail,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuHeart,
  LuShield,
  LuZap,
} from "@qwikest/icons/lucide";

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const showPassword = useSignal(false);
  const nav = useNavigate();

  const [form, { Form, Field }] = useForm<LoginForm>({
    loader: { value: { email: "", password: "" } },
    validate: valiForm$(loginSchema),
  });

  const handleSubmit = $(async (values: LoginForm) => {
    console.log("Login - Form Data:", values);
    error.value = null;
    success.value = null;

    try {
      const response = await api.post("/auth/login", values);
      console.log("Login - Success Response:", response.data);

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
      console.log("Login - Error:", err);
      error.value = err.response?.data?.message || "Login gagal";
    }
  });

  return (
    <div class="w-full max-w-md mx-auto">
      <div class="card-elegant">
        <div class="card-body p-8">
          {/* Header */}
          <div class="text-center mb-8">
            <div class="avatar placeholder mb-6">
              <div class="bg-gradient-primary text-white rounded-full w-20 h-20 shadow-xl">
                <LuLock class="w-10 h-10" />
              </div>
            </div>
            <h1 class="text-3xl font-bold text-gradient-primary mb-2">
              Masuk ke SIDIFA
            </h1>
            <p class="text-base-content/70 text-lg">
              Silakan masuk dengan akun Anda untuk mengakses layanan
            </p>
          </div>

          {/* Features */}
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="flex flex-col items-center gap-2 p-3 bg-primary/5 rounded-lg">
              <LuHeart class="w-5 h-5 text-primary" />
              <span class="text-xs font-medium text-center">
                Layanan Inklusif
              </span>
            </div>
            <div class="flex flex-col items-center gap-2 p-3 bg-secondary/5 rounded-lg">
              <LuShield class="w-5 h-5 text-secondary" />
              <span class="text-xs font-medium text-center">
                Aman & Terpercaya
              </span>
            </div>
            <div class="flex flex-col items-center gap-2 p-3 bg-accent/5 rounded-lg">
              <LuZap class="w-5 h-5 text-accent" />
              <span class="text-xs font-medium text-center">Akses Cepat</span>
            </div>
          </div>

          <Form onSubmit$={handleSubmit} class="space-y-6">
            <Field name="email">
              {(field: any, props: any) => (
                <div class="form-control">
                  <label for="email" class="label">
                    <span class="label-text font-medium">Email</span>
                  </label>
                  <div class="relative">
                    <input
                      {...props}
                      id="email"
                      type="email"
                      placeholder="Masukkan email Anda"
                      class="input input-bordered w-full pl-12 focus-ring"
                      classList={{
                        "input-error": field.error,
                      }}
                    />
                    <LuMail class="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40" />
                  </div>
                  {field.error && (
                    <label class="label">
                      <span class="label-text-alt text-error">
                        {field.error}
                      </span>
                    </label>
                  )}
                </div>
              )}
            </Field>

            <Field name="password">
              {(field: any, props: any) => (
                <div class="form-control">
                  <label for="password" class="label">
                    <span class="label-text font-medium">Password</span>
                  </label>
                  <div class="relative">
                    <input
                      {...props}
                      id="password"
                      type={showPassword.value ? "text" : "password"}
                      placeholder="Masukkan password Anda"
                      class="input input-bordered w-full pl-12 pr-12 focus-ring"
                      classList={{
                        "input-error": field.error,
                      }}
                    />
                    <LuLock class="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40" />
                    <button
                      type="button"
                      class="absolute right-4 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm"
                      onClick$={() =>
                        (showPassword.value = !showPassword.value)
                      }
                    >
                      {showPassword.value ? (
                        <LuEyeOff class="w-4 h-4" />
                      ) : (
                        <LuEye class="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {field.error && (
                    <label class="label">
                      <span class="label-text-alt text-error">
                        {field.error}
                      </span>
                    </label>
                  )}
                </div>
              )}
            </Field>

            <div class="flex items-center justify-between">
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
              class="btn-hero w-full"
              disabled={form.submitting}
            >
              {form.submitting ? (
                <>
                  <span class="loading loading-spinner loading-sm" />
                  Masuk...
                </>
              ) : (
                <>
                  Masuk ke SIDIFA
                  <LuArrowRight class="w-4 h-4" />
                </>
              )}
            </button>
          </Form>

          <div class="divider">atau</div>

          <div class="space-y-4">
            <div class="text-center">
              <span class="text-base-content/70">Belum punya akun? </span>
              <a
                href="/auth/signup/posyandu"
                class="link link-primary font-semibold"
              >
                Daftar sekarang
              </a>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <a
                href="/auth/signup/posyandu"
                class="btn btn-outline btn-sm gap-2"
              >
                <span class="text-xs">Daftar Posyandu</span>
              </a>
              <a
                href="/auth/signup/psikolog"
                class="btn btn-outline btn-sm gap-2"
              >
                <span class="text-xs">Daftar Psikolog</span>
              </a>
            </div>
          </div>

          {error.value && (
            <Alert type="error" message={error.value} class="mt-6" />
          )}
          {success.value && (
            <Alert type="success" message={success.value} class="mt-6" />
          )}
        </div>
      </div>
    </div>
  );
});
