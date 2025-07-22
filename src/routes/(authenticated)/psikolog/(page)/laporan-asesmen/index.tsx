import { component$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { assessmentReportsData } from "~/data/assessment-report-data";
import {
  AssessmentReportForm,
  AssessmentReportHistoryTable,
} from "~/components/psikolog";

export default component$(() => {
  const handleFormSubmit = $(
    (data: { patient: string; date: string; result: string }) => {
      console.log("New Assessment Report Data:", data);
      // Implement actual API call to save the report
      alert("Laporan berhasil disimpan (simulasi)!");
      // You might want to refresh the history table here after a real API call
    },
  );

  const handleViewDetail = $((id: string) => {
    console.log(`Navigating to report detail for ID: ${id}`);
    // Implement actual navigation to report detail page
    alert(`Melihat detail laporan ${id} (simulasi)!`);
  });

  return (
    <div>
      <h1 class="text-3xl font-bold mb-6">Laporan Asesmen Psikologis</h1>

      <AssessmentReportForm onSubmit$={handleFormSubmit} />

      <AssessmentReportHistoryTable
        history={assessmentReportsData}
        onViewDetail$={handleViewDetail}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Laporan Asesmen - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Laporan Asesmen Psikologis - Si-DIFA",
    },
  ],
};
