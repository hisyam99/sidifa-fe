import { component$, useSignal, $ } from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { signupPsikologSchema, type SignupPsikologForm } from "~/types/auth";
import api from "~/services/api";
import FormField from "~/components/ui/FormField";
import Alert from "~/components/ui/Alert";

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
    <>
      <h1 class="text-2xl font-bold mb-4">Daftar Psikolog</h1>

      <Form onSubmit$={handleSubmit} class="flex flex-col gap-3">
        <Field name="name">
          {(field: any, props: any) => (
            <FormField
              field={field}
              props={props}
              type="text"
              placeholder="Nama Lengkap"
            />
          )}
        </Field>

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

        <Field name="no_telp">
          {(field: any, props: any) => (
            <FormField
              field={field}
              props={props}
              type="text"
              placeholder="No Telp"
            />
          )}
        </Field>

        <Field name="spesialis">
          {(field: any, props: any) => (
            <FormField
              field={field}
              props={props}
              type="text"
              placeholder="Spesialis"
            />
          )}
        </Field>

        <Field name="lokasi">
          {(field: any, props: any) => (
            <FormField
              field={field}
              props={props}
              type="text"
              placeholder="Lokasi"
            />
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

      {error.value && <Alert type="error" message={error.value} class="mt-2" />}
      {success.value && (
        <Alert type="success" message={success.value} class="mt-2" />
      )}
    </>
  );
});
