import { component$ } from "@builder.io/qwik";

interface SectionHeaderProps {
  title: string;
  description: string;
  gradientClass?: string;
}

export const SectionHeader = component$((props: SectionHeaderProps) => {
  const { title, description, gradientClass = "text-gradient-primary" } = props;
  return (
    <div class="text-center mb-16">
      <h2 class={`text-3xl lg:text-4xl font-bold ${gradientClass} mb-4`}>
        {title}
      </h2>
      <p class="text-lg text-base-content/70 mx-auto max-w-2xl">
        {description}
      </p>
    </div>
  );
});
