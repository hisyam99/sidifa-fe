import { component$, useSignal, $ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
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

  // Ambil token dari URL query parameter
  const token = location.url.searchParams.get("token") || "";

  // Debug: Log semua parameter URL
  console.log("🔍 URL Debug Info:");
  console.log("Full URL:", location.url.href);
  console.log("Pathname:", location.url.pathname);
  console.log("Search params:", location.url.search);
  console.log("Search params length:", location.url.search.length);
  console.log(
    "All search params:",
    Object.fromEntries(location.url.searchParams.entries()),
  );
  console.log(
    "Search params entries count:",
    Array.from(location.url.searchParams.entries()).length,
  );
  console.log("Token extracted:", token);
  console.log("Token length:", token.length);
  console.log("Token is empty:", !token);

  // Debug: Cek apakah ada parameter lain
  console.log("🔍 All URL Parameters:");
  for (const [key, value] of location.url.searchParams.entries()) {
    console.log(`  • ${key}: ${value}`);
  }

  const [form, { Form, Field }] = useForm<ResetPasswordForm>({
    loader: { value: { token: token, password: "", confirmPassword: "" } },
    validate: valiForm$(resetPasswordSchema),
    validateOn: "blur",
    revalidateOn: "blur",
  });

  const handleSubmit = $(async (values: ResetPasswordForm) => {
    console.log("=".repeat(80));
    console.log("🚀 RESET PASSWORD FORM SUBMIT STARTED");
    console.log("=".repeat(80));

    // Debug: Input dari user
    console.log("📝 USER INPUT:");
    console.log("  • Token:", values.token);
    console.log("  • Password:", values.password);
    console.log("  • Confirm Password:", values.confirmPassword);
    console.log("  • Password Length:", values.password?.length || 0);
    console.log("  • Token Length:", values.token?.length || 0);
    console.log("  • All Values:", JSON.stringify(values, null, 2));

    error.value = null;
    success.value = null;

    // Validasi token
    if (!values.token || values.token.trim() === "") {
      console.log("❌ VALIDATION ERROR: Token is empty");
      error.value = "Token reset password tidak valid atau sudah kadaluarsa";
      return;
    }

    // Validasi konfirmasi password
    if (values.password !== values.confirmPassword) {
      console.log("❌ VALIDATION ERROR: Password confirmation mismatch");
      console.log("  • Password:", values.password);
      console.log("  • Confirm Password:", values.confirmPassword);
      error.value = "Password dan konfirmasi password harus sama";
      return;
    }

    console.log("✅ VALIDATION PASSED: Password confirmation match");

    try {
      // Kirim request dengan format yang sama seperti Postman
      const requestData = {
        token: values.token,
        password: values.password,
      };

      console.log("📤 REQUEST TO SERVER:");
      console.log("  • URL:", "/auth/reset-password");
      console.log("  • Method:", "POST");
      console.log("  • Data:", JSON.stringify(requestData, null, 2));
      console.log("  • Data Type:", typeof requestData);
      console.log("  • Token in request:", requestData.token);
      console.log("  • Password in request:", requestData.password);

      console.log("🔄 SENDING REQUEST...");
      const startTime = Date.now();

      const response = await api.post("/auth/reset-password", requestData);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log("✅ SUCCESS RESPONSE FROM SERVER:");
      console.log("  • Status:", response.status);
      console.log("  • Status Text:", response.statusText);
      console.log("  • Response Time:", responseTime + "ms");
      console.log("  • Headers:", response.headers);
      console.log("  • Data:", response.data);
      console.log("  • Data Type:", typeof response.data);

      success.value = "Password berhasil diubah!";
      console.log("✅ SUCCESS: Password reset completed");

      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        console.log("🔄 REDIRECTING: Going to login page...");
        window.location.href = "/auth/login";
      }, 2000);
    } catch (err: any) {
      console.log("❌ ERROR RESPONSE FROM SERVER:");
      console.log("  • Error Type:", err.constructor.name);
      console.log("  • Error Message:", err.message);
      console.log("  • Error Stack:", err.stack);

      if (err.response) {
        console.log("  • Response Status:", err.response.status);
        console.log("  • Response Status Text:", err.response.statusText);
        console.log("  • Response Headers:", err.response.headers);
        console.log("  • Response Data:", err.response.data);
        console.log("  • Response Config:", {
          url: err.response.config?.url,
          method: err.response.config?.method,
          baseURL: err.response.config?.baseURL,
          data: err.response.config?.data,
        });
      } else if (err.request) {
        console.log("  • Request Error:", err.request);
        console.log("  • No Response Received");
      } else {
        console.log("  • Network Error:", err.message);
      }

      error.value = extractErrorMessage(err);
      console.log("❌ ERROR: Password reset failed");
    }

    console.log("=".repeat(80));
    console.log("🏁 RESET PASSWORD FORM SUBMIT ENDED");
    console.log("=".repeat(80));
  });

  // Debug: Log form state
  console.log("🔍 Form State:", {
    submitting: form.submitting,
    dirty: form.dirty,
    touched: form.touched,
    invalid: form.invalid,
  });

  // Debug: Log form validation status
  console.log("🔍 Form Validation Status:", {
    invalid: form.invalid,
    dirty: form.dirty,
    touched: form.touched,
  });

  return (
    <Card class="w-full">
      <div class="text-center mb-6">
        <div class="bg-success text-success-content w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <LuLock class="w-8 h-8" />
        </div>
        <h1 class="text-2xl font-bold">Reset Password</h1>
        <p class="text-base-content/70 mt-2">Masukkan password baru Anda</p>

        {/* Debug info untuk development */}
        {import.meta.env.DEV && (
          <div class="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p class="text-sm text-warning">
              <strong>Debug Info:</strong> Token:{" "}
              {token ? `${token.substring(0, 20)}...` : "Tidak ada token"}
            </p>
          </div>
        )}
      </div>

      <Form onSubmit$={handleSubmit} class="space-y-4">
        <Field name="token">
          {(field: any, props: any) => {
            console.log("🔍 Token Field Debug:");
            console.log("Token value:", token);
            console.log("Field props:", props);
            console.log("Field value:", field.value);

            return (
              <div>
                <input {...props} type="hidden" value={token} />
                {/* Debug: Tampilkan token di console untuk memastikan */}
                <script
                  dangerouslySetInnerHTML={`
                  console.log("🔍 Hidden input token value:", "${token}");
                `}
                />
              </div>
            );
          }}
        </Field>

        <Field name="password">
          {(field: any, props: any) => {
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
          {(field: any, props: any) => {
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
        <a
          href="/auth/login"
          class="link link-primary font-medium w-full block"
        >
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
