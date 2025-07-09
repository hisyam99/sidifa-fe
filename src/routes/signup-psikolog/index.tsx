import { component$, useSignal, $ } from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { signupPsikologSchema, type SignupPsikologForm } from "~/types/auth";
import api from "~/services/api";

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  const [form, { Form, Field }] = useForm<SignupPsikologForm>({
    loader: {
      value: {
        name: "",
        email: "",
        password: "",
        no_telp: "",
        spesialis: "",
        lokasi: "",
      },
    },
    validate: valiForm$(signupPsikologSchema),
  });

  const handleSubmit = $(async (values: SignupPsikologForm) => {
    console.log("📝 Signup Psikolog - Form Data:", values);
    error.value = null;
    success.value = null;

    try {
      const response = await api.post("/auth/signup/psikolog", values);
      console.log("🎉 Signup Psikolog - Success Response:", response.data);
      success.value = "Pendaftaran berhasil!";
    } catch (err: any) {
      console.log("💥 Signup Psikolog - Error:", err);
      error.value = err.response?.data?.message || "Pendaftaran gagal";
    }
  });

  return (
    <div class="container mx-auto max-w-md p-4">
      <h1 class="text-2xl font-bold mb-4">Daftar Psikolog</h1>

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

        <Field name="spesialis">
          {(field: any, props: any) => (
            <div>
              <input
                {...props}
                type="text"
                placeholder="Spesialis"
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
