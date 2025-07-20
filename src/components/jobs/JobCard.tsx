import { component$, QRL } from "@builder.io/qwik";
import {
  LuMapPin,
  LuBuilding,
  LuShare,
} from "~/components/icons/lucide-optimized"; // Updated import path

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  tags: string[];
  onShare$?: QRL<() => void>; // Optional share functionality
  onViewDetail$?: QRL<() => void>; // Optional view detail functionality
}

export const JobCard = component$((props: JobCardProps) => {
  const { title, company, location, type, tags, onShare$, onViewDetail$ } =
    props;

  return (
    <div class="card lg:card-side bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-shadow duration-200">
      <div class="card-body p-6">
        <h2 class="card-title text-2xl font-bold mb-2">{title}</h2>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-base-content/70 mb-4">
          <span class="flex items-center gap-1">
            <LuBuilding class="w-4 h-4" /> {company}
          </span>
          <span class="flex items-center gap-1">
            <LuMapPin class="w-4 h-4" /> {location}
          </span>
          <span class="badge badge-info text-info-content">{type}</span>
        </div>
        <div class="mt-2 mb-4">
          {tags.map((tag) => (
            <div key={tag} class="badge badge-outline badge-primary mr-2 mb-2">
              {tag}
            </div>
          ))}
        </div>
        <div class="card-actions justify-end mt-auto pt-4 border-t border-base-200/50">
          {onShare$ && (
            <button class="btn btn-ghost btn-sm" onClick$={onShare$}>
              <LuShare class="w-4 h-4 mr-1" />
              Bagikan
            </button>
          )}
          {onViewDetail$ && (
            <button class="btn btn-primary btn-sm" onClick$={onViewDetail$}>
              Lihat Detail
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
