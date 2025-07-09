import { component$, useSignal, $ } from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { signupPosyanduSchema, type SignupPosyanduForm } from "~/types/auth";
import api from "~/services/api";
import { FormField, Alert, Card } from "~/components/ui";

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  const [form, { Form, Field }] = useForm<SignupPosyanduForm>({
    loader: {
      value: {
        name: "",
        email: "",
        password: "",
        no_telp: "",
        nama_posyandu: "",
        lokasi: "",
      },
    },
    validate: valiForm$(signupPosyanduSchema),
  });

  const handleSubmit = $(async (values: SignupPosyanduForm) => {
    console.log("📝 Signup Posyandu - Form Data:", values);
    error.value = null;
    success.value = null;

    try {
      const response = await api.post("/auth/signup/posyandu", values);
      console.log("🎉 Signup Posyandu - Success Response:", response.data);
      success.value = "Pendaftaran berhasil!";
    } catch (err: any) {
      console.log("💥 Signup Posyandu - Error:", err);
      error.value = err.response?.data?.message || "Pendaftaran gagal";
    }
  });

  return (
    <Card class="w-full max-w-2xl">
      <div class="text-center mb-6">
        <div class="avatar placeholder mb-4">
          <div class="bg-primary text-primary-content rounded-full w-16">
            <span class="text-2xl">🏥</span>
          </div>
        </div>
        <h1 class="text-2xl font-bold">Daftar Posyandu</h1>
        <p class="text-base-content/70 mt-2">
          Daftarkan posyandu Anda ke sistem SIDIFA
        </p>
      </div>

      <Form onSubmit$={handleSubmit} class="space-y-4">
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field name="nama_posyandu">
            {(field: any, props: any) => (
              <FormField
                field={field}
                props={props}
                type="text"
                placeholder="Masukkan nama posyandu"
                label="Nama Posyandu"
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
                placeholder="Masukkan lokasi posyandu"
                label="Lokasi Posyandu"
                required
              />
            )}
          </Field>
        </div>

        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-2">
            <input type="checkbox" class="checkbox checkbox-sm" required />
            <span class="label-text">
              Saya setuju dengan{" "}
              <a href="#" class="link link-primary">
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
              <span class="loading loading-spinner loading-sm"></span>
              Mendaftar...
            </>
          ) : (
            "Daftar Posyandu"
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

      {error.value && <Alert type="error" message={error.value} class="mt-4" />}
      {success.value && (
        <Alert type="success" message={success.value} class="mt-4" />
      )}
    </Card>
  );
});
