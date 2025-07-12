import { component$, useSignal, $ } from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { loginSchema, type LoginForm } from "~/types/auth";
import { authService } from "~/services/api";
import { Alert, Card, FormField } from "~/components/ui";
import { extractErrorMessage } from "~/utils/error";
import { useAuth } from "~/hooks";
import { LuArrowRight } from "@qwikest/icons/lucide";

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const loading = useSignal(false);
  const { refreshUserData } = useAuth();
  const nav = useNavigate();

  const [, { Form, Field }] = useForm<LoginForm>({
    loader: { value: { email: "", password: "" } },
    validate: valiForm$(loginSchema),
    validateOn: "blur",
    revalidateOn: "blur",
  });

  const handleSubmit = $(async (values: LoginForm) => {
    error.value = null;
    success.value = null;
    loading.value = true;
    
    try {
      // Use the improved authService.login
      console.log("🔐 Starting login process...");
      await authService.login(values);
      
      // Check if cookies were set
      const cookies = document.cookie;
      console.log("🍪 Cookies after login:", cookies);
      
      if (!cookies.includes("jwt")) {
        console.warn("⚠️ JWT cookie not found after login");
        error.value = "Login berhasil tapi ada masalah dengan cookies. Silakan coba refresh halaman.";
        return;
      }
      
      success.value = "Login berhasil!";
      
      // Refresh user data to update authentication state
      await refreshUserData();
      
      // Navigate immediately after state is updated
      nav("/dashboard");
    } catch (err: any) {
      console.error("❌ Login error:", err);
      error.value = extractErrorMessage(err);
    } finally {
      loading.value = false;
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
          disabled={loading.value}
        >
          {loading.value ? (
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
          <a href="/auth/signup/posyandu" class="link link-primary font-medium">
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
