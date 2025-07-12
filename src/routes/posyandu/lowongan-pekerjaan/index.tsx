import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LuMapPin, LuBuilding2, LuShare2 } from "@qwikest/icons/lucide";

export default component$(() => {
  const jobs = [
    {
      title: "Admin Entry Data",
      company: "PT Maju Terus",
      location: "Jakarta",
      type: "Remote",
      tags: ["Disabilitas Fisik", "Tuna Daksa"],
    },
    {
      title: "Desainer Grafis",
      company: "Creative Studio",
      location: "Bandung",
      type: "Full-time",
      tags: ["Tuna Rungu", "Tuna Wicara"],
    },
    {
      title: "Operator Jahit",
      company: "Garment Sejahtera",
      location: "Surabaya",
      type: "Full-time",
      tags: ["Semua Disabilitas"],
    },
  ];

  return (
    <div>
      <h1 class="text-3xl font-bold mb-2">
        Lowongan Pekerjaan Ramah Disabilitas
      </h1>
      <p class="mb-6">
        Temukan dan bagikan informasi lowongan kerja yang inklusif.
      </p>

      <div class="space-y-6">
        {jobs.map((job) => (
          <div key={job.title} class="card lg:card-side bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">{job.title}</h2>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <LuBuilding2 /> {job.company}
                </span>
                <span class="flex items-center gap-1">
                  <LuMapPin /> {job.location}
                </span>
              </div>
              <p>
                Tipe Pekerjaan: <span class="badge badge-info">{job.type}</span>
              </p>
              <div class="mt-2">
                {job.tags.map((tag) => (
                  <div key={tag} class="badge badge-outline mr-2">
                    {tag}
                  </div>
                ))}
              </div>
              <div class="card-actions justify-end">
                <button class="btn btn-ghost btn-sm">
                  <LuShare2 class="w-4 h-4 mr-1" />
                  Bagikan
                </button>
                <button class="btn btn-primary">Lihat Detail</button>
              </div>
            </div>
          </div>
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
