import { component$, useSignal, $ } from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { signupPosyanduSchema, type SignupPosyanduForm } from "~/types/auth";
import api from "~/services/api";

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
    <div class="container mx-auto max-w-md p-4">
      <h1 class="text-2xl font-bold mb-4">Daftar Posyandu</h1>

      <Form onSubmit$={handleSubmit} class="flex flex-col gap-3">
        <Field name="name">
          {(field: any, props: any) => (
            <div>
              <input
                {...props}
                type="text"
                placeholder="Nama Lengkap"
                class="input input-bordered w-full"
              />
              {field.error && (
                <div class="text-red-500 text-sm mt-1">{field.error}</div>
              )}
            </div>
          )}
        </Field>

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

        <Field name="no_telp">
          {(field: any, props: any) => (
            <div>
              <input
                {...props}
                type="text"
                placeholder="No Telp"
                class="input input-bordered w-full"
              />
              {field.error && (
                <div class="text-red-500 text-sm mt-1">{field.error}</div>
              )}
            </div>
          )}
        </Field>

        <Field name="nama_posyandu">
          {(field: any, props: any) => (
            <div>
              <input
                {...props}
                type="text"
                placeholder="Nama Posyandu"
                class="input input-bordered w-full"
              />
              {field.error && (
                <div class="text-red-500 text-sm mt-1">{field.error}</div>
              )}
            </div>
          )}
        </Field>

        <Field name="lokasi">
          {(field: any, props: any) => (
            <div>
              <input
                {...props}
                type="text"
                placeholder="Lokasi"
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
          {form.submitting ? "Mendaftar..." : "Daftar"}
        </button>
      </Form>

      {error.value && <div class="text-red-500 mt-2">{error.value}</div>}
      {success.value && <div class="text-green-500 mt-2">{success.value}</div>}
    </div>
  );
});
