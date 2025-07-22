import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { jobsData } from "~/data/job-data";
import { JobCard } from "~/components/jobs";

export default component$(() => {
  return (
    <div>
      <h1 class="text-3xl font-bold mb-2">
        Lowongan Pekerjaan Ramah Disabilitas
      </h1>
      <p class="mb-6">
        Temukan dan bagikan informasi lowongan kerja yang inklusif.
      </p>

      <div class="space-y-6">
        {jobsData.map((job) => (
          <JobCard
            key={job.title}
            title={job.title}
            company={job.company}
            location={job.location}
            type={job.type}
            tags={job.tags}
            // You can add onShare$ and onViewDetail$ props here if needed
          />
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Lowongan Pekerjaan - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Lowongan Pekerjaan Ramah Disabilitas - Si-DIFA",
    },
  ],
};
