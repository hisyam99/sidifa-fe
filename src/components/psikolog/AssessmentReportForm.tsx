import { component$, $, QRL } from "@qwik.dev/core";
import { patientsListForForm } from "~/data/assessment-report-data";

interface AssessmentReportFormProps {
  onSubmit$: QRL<
    (data: { patient: string; date: string; result: string }) => void
  >;
}

export const AssessmentReportForm = component$(
  (props: AssessmentReportFormProps) => {
    const { onSubmit$ } = props;

    // Using local signals for form inputs for simplicity
    // For more complex forms, consider useStore or form libraries
    // const patient = useSignal('');
    // const date = useSignal('');
    // const result = useSignal('');

    const handleSubmit = $(async (event: Event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      const patient = formData.get("patient")?.toString() || "";
      const date = formData.get("date")?.toString() || "";
      const result = formData.get("result")?.toString() || "";

      if (patient && date && result) {
        await onSubmit$({ patient, date, result });
        form.reset(); // Reset form after submission
      }
    });

    return (
      <div class="mb-8 p-6 bg-base-200 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Buat Laporan Baru</h2>
        <form class="space-y-4" onSubmit$={handleSubmit}>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Pilih Pasien/IBK</span>
            </label>
            <select
              name="patient"
              class="select select-bordered w-full"
              required
            >
              <option value="" disabled selected>
                Pilih dari daftar pasien
              </option>
              {patientsListForForm.map((patient) => (
                <option key={patient} value={patient}>
                  {patient}
                </option>
              ))}
            </select>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Tanggal Asesmen</span>
            </label>
            <input
              type="date"
              name="date"
              class="input input-bordered w-full"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Hasil Asesmen & Rekomendasi</span>
            </label>
            <textarea
              name="result"
              class="textarea textarea-bordered h-32 w-full"
              placeholder="Tuliskan hasil observasi, analisis, dan rekomendasi..."
              required
            ></textarea>
          </div>
          <div class="flex justify-end pt-4">
            <button type="submit" class="btn btn-primary">
              Simpan Laporan
            </button>
          </div>
        </form>
      </div>
    );
  },
);
