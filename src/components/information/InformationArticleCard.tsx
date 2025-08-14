import { component$ } from "@builder.io/qwik";
import {
  LuCalendar,
  LuClock,
  LuArrowRight,
} from "~/components/icons/lucide-optimized";

interface InformationArticleCardProps {
  title: string;
  category: string;
  image?: string;
  excerpt: string;
  date?: string;
  readTime?: number;
  href?: string; // Optional link to the full article
}

export const InformationArticleCard = component$(
  (props: InformationArticleCardProps) => {
    const { title, category, image, excerpt, href, date, readTime = 3 } = props;

    const stripHtml = (html: string) => {
      if (typeof document === "undefined") return html;
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    const formatDate = (dateString?: string) => {
      if (!dateString) return null;
      try {
        return new Date(dateString).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch {
        return null;
      }
    };

    return (
      <a href={href} class="group block">
        <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
          {/* Image Header */}
          {image ? (
            <div class="relative h-48 overflow-hidden rounded-t-3xl">
              <img
                src={image}
                alt={title}
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div class="absolute top-3 left-3">
                <span class="badge badge-primary">{category}</span>
              </div>
            </div>
          ) : (
            <div class="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-3xl">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg
                      class="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-primary">
                    {category}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div class="card-body">
            {/* Meta Information */}
            <div class="flex items-center gap-4 text-xs text-base-content/60 mb-3">
              {date && (
                <div class="flex items-center gap-1">
                  <LuCalendar class="w-3 h-3" />
                  {formatDate(date)}
                </div>
              )}
              <div class="flex items-center gap-1">
                <LuClock class="w-3 h-3" />
                {readTime} min baca
              </div>
            </div>

            {/* Title */}
            <h3 class="card-title text-base-content group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-3">
              {title}
            </h3>

            {/* Excerpt */}
            <p class="text-sm text-base-content/70 line-clamp-3 leading-relaxed mb-4">
              {stripHtml(excerpt).substring(0, 120)}...
            </p>

            {/* Read More */}
            <div class="card-actions justify-between">
              <div class="badge badge-outline badge-sm">{category}</div>
              <div class="flex items-center text-primary text-sm font-medium group-hover:text-primary-focus transition-colors">
                Baca selengkapnya
                <LuArrowRight class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </a>
    );
  },
);

export const InformationArticleCardSkeleton = component$(() => {
  return (
    <div class="card bg-base-100 shadow-lg animate-pulse">
      <div class="h-48 bg-base-300" />
      <div class="card-body">
        <div class="flex gap-4 mb-3">
          <div class="h-3 bg-base-300 rounded w-16" />
          <div class="h-3 bg-base-300 rounded w-20" />
        </div>
        <div class="h-5 bg-base-300 rounded mb-2" />
        <div class="h-5 bg-base-300 rounded w-3/4 mb-3" />
        <div class="space-y-2 mb-4">
          <div class="h-3 bg-base-300 rounded" />
          <div class="h-3 bg-base-300 rounded" />
          <div class="h-3 bg-base-300 rounded w-2/3" />
        </div>
        <div class="flex justify-between">
          <div class="h-6 bg-base-300 rounded w-16" />
          <div class="h-4 bg-base-300 rounded w-24" />
        </div>
      </div>
    </div>
  );
});
