import { component$ } from "@builder.io/qwik";

interface ContactItemProps {
  icon: any; // Using 'any' for the Lucide icon component, can be more specific with actual icon type if needed
  text: string;
}

export const ContactItem = component$((props: ContactItemProps) => {
  const { icon: Icon, text } = props;
  return (
    <div class="flex items-center justify-start gap-3">
      <Icon class="w-5 h-5 text-primary" aria-hidden="true" />
      <span class="text-sm text-base-content/70">{text}</span>
    </div>
  );
});
