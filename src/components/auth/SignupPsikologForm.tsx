import { component$, useSignal, $ } from "@qwik.dev/core";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { signupPsikologSchema, type SignupPsikologForm } from "~/types/auth";
import api from "~/services/api";
import { FormField, Alert, Card } from "~/components/ui";
import { extractErrorMessage } from "~/utils/error";
import { LuBrain, LuArrowRight } from "~/components/icons/lucide-optimized"; // Updated import path

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  const [form, { Form, Field }] = useForm<SignupPsikologForm>({
    loader: {
      value: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        no_telp: "",
        spesialis: "",
        lokasi: "",
      },
    },
    validate: valiForm$(signupPsikologSchema),
    validateOn: "blur",
    revalidateOn: "blur",
  });

  const handleSubmit = $(async (values: SignupPsikologForm) => {
    error.value = null;
    success.value = null;

    // Custom validation untuk memastikan password dan confirmPassword sama
    if (values.password !== values.confirmPassword) {
      error.value = "Password dan konfirmasi password tidak sama";
      return;
    }

    try {
      await api.post("/auth/signup/psikolog", values);
      success.value = "Pendaftaran berhasil!";
    } catch (err: any) {
      error.value = extractErrorMessage(err);
    }
  });

  return (
    <Card class="w-full max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <div class="bg-primary text-primary-content rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-xl">
          <LuBrain class="w-8 h-8" />
        </div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gradient-primary mb-2">
          Daftar Psikolog
        </h1>
        <p class="text-base-content/70 text-sm lg:text-base">
          Daftarkan praktik psikologi Anda ke sistem SIDIFA
        </p>
      </div>

      <Form onSubmit$={handleSubmit} class="space-y-6 w-full">
        {/* Personal Information */}
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-base-content">
            Informasi Pribadi
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field name="name">
              {(field: any, props: any) => (
                <FormField
                  field={field}
                  props={props}
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  label="Nama Lengkap"
                  required
                />
              )}
            </Field>

            <Field name="email">
              {(field: any, props: any) => (
                <FormField
                  field={field}
                  props={props}
                  type="email"
                  placeholder="Masukkan email"
                  label="Email"
                  required
                />
              )}
            </Field>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field name="no_telp">
              {(field: any, props: any) => (
                <FormField
                  field={field}
                  props={props}
                  type="tel"
                  placeholder="Masukkan nomor telepon"
                  label="Nomor Telepon"
                  required
                />
              )}
            </Field>
          </div>
        </div>

        {/* Password Section */}
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-base-content">Keamanan Akun</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field name="password">
              {(field: any, props: any) => (
                <FormField
                  field={field}
                  props={props}
                  type="password"
                  placeholder="Masukkan password"
                  label="Password"
                  required
                />
              )}
            </Field>

            <Field name="confirmPassword">
              {(field: any, props: any) => (
                <FormField
                  field={field}
                  props={props}
                  type="password"
                  placeholder="Konfirmasi password"
                  label="Konfirmasi Password"
                  required
                />
              )}
            </Field>
          </div>
        </div>

        {/* Professional Information */}
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-base-content">
            Informasi Profesional
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field name="spesialis">
              {(field: any, props: any) => (
                <FormField
                  field={field}
                  props={props}
                  type="text"
                  placeholder="Masukkan spesialisasi"
                  label="Spesialisasi"
                  required
                />
              )}
            </Field>

            <Field name="lokasi">
              {(field: any, props: any) => (
                <FormField
                  field={field}
                  props={props}
                  type="text"
                  placeholder="Masukkan lokasi praktik"
                  label="Lokasi Praktik"
                  required
                />
              )}
            </Field>
          </div>
        </div>

        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-2">
            <input type="checkbox" class="checkbox checkbox-sm" required />
            <span class="label-text">
              Saya setuju dengan{" "}
              <a href="/terms" class="link link-primary">
                syarat dan ketentuan
              </a>
            </span>
          </label>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-full"
          disabled={form.submitting}
        >
          {form.submitting ? (
            <>
              <div class="skeleton w-4 h-4"></div>
              Mendaftar...
            </>
          ) : (
            <>
              Daftar Psikolog <LuArrowRight class="w-4 h-4" />
            </>
          )}
        </button>
      </Form>

      <div class="divider">atau</div>

      <div class="text-center text-sm">
        <span class="text-base-content/70">Sudah punya akun? </span>
        <a href="/auth/login" class="link link-primary font-medium">
          Masuk sekarang
        </a>
      </div>

      {error.value && <Alert type="error" message={error.value} class="mt-6" />}
      {success.value && (
        <Alert type="success" message={success.value} class="mt-6" />
      )}
    </Card>
  );
});
