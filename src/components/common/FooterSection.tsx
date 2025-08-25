import { component$, Slot } from "@builder.io/qwik";

interface FooterSectionProps {
  title: string;
  gradientClass: string; // Tailwind gradient class, e.g., "text-gradient-secondary"
  textAlign?: "center" | "left";
}

export const FooterSection = component$((props: FooterSectionProps) => {
  const { title, gradientClass, textAlign = "left" } = props;
  const alignClass = textAlign === "center" ? "text-center" : "text-left";

  return (
    <div class={`${alignClass} lg:text-left`}>
      <h2 class={`footer-title mb-4 ${gradientClass}`}>{title}</h2>
      <Slot />
    </div>
  );
});
