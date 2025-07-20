import { component$ } from "@builder.io/qwik";
import { LuStar } from "~/components/icons/lucide-optimized"; // Updated import path

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  stars: number; // Number of stars to display
}

export const TestimonialCard = component$((props: TestimonialCardProps) => {
  const { quote, name, role, stars } = props;

  return (
    <div class="card bg-base-100 shadow-md p-6 lg:p-8 rounded-lg border border-base-200/50">
      <div class="flex items-center mb-4">
        {Array.from({ length: stars }).map((_, i) => (
          <LuStar key={`star-${i}`} class="w-5 h-5 text-warning fill-warning" />
        ))}
      </div>
      <p class="text-base-content/70 text-lg italic mb-6 leading-relaxed">
        "{quote}"
      </p>
      <div class="font-semibold text-base-content">
        <p class="text-primary">{name}</p>
        <p class="text-sm text-base-content/60">{role}</p>
      </div>
    </div>
  );
});
