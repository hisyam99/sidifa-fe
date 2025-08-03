import { component$ } from "@builder.io/qwik";
import { LuCheckCircle } from "~/components/icons/lucide-optimized"; // Updated import path

interface HomeFeatureCardProps {
  icon: any; // Lucide icon component
  title: string;
  description: string;
  iconBgGradientClass: string; // e.g., "bg-gradient-primary"
  titleTextColorClass: string; // e.g., "text-gradient-primary"
  badgeText: string;
}

export const HomeFeatureCard = component$((props: HomeFeatureCardProps) => {
  const {
    icon: Icon,
    title,
    description,
    iconBgGradientClass,
    titleTextColorClass,
    badgeText,
  } = props;
  return (
    <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div class="card-body text-center p-8">
        <div
          class={`${iconBgGradientClass} rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon class="w-10 h-10" />
        </div>
        <h3
          class={`card-title text-xl mb-4 justify-center ${titleTextColorClass}`}
        >
          {title}
        </h3>
        <p class="text-base-content/70 leading-relaxed">{description}</p>
        <div class="card-actions justify-center mt-6">
          <div class="badge badge-primary badge-lg gap-2">
            <LuCheckCircle class="w-4 h-4" />
            {badgeText}
          </div>
        </div>
      </div>
    </div>
  );
});
