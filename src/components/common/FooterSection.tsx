import { component$, Slot } from "@builder.io/qwik";

interface FooterSectionProps {
  title: string;
  gradientClass: string; // Tailwind gradient class, e.g., "text-gradient-secondary"
  textAlign?: "center" | "left";
}

export const FooterSection = component$((props: FooterSectionProps) => {
  const { title, gradientClass, textAlign = "left" } = props;

  return (
    <div class={`text-${textAlign} lg:text-left`}>
      <h3 class={`font-bold text-lg mb-4 ${gradientClass}`}>{title}</h3>
      <Slot />
    </div>
  );
});
