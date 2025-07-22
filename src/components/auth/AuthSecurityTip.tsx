import { component$ } from "@qwik.dev/core";
import { LuCheckCircle } from "~/components/icons/lucide-optimized"; // Updated import path

interface AuthSecurityTipProps {
  tip: string;
}

export const AuthSecurityTip = component$((props: AuthSecurityTipProps) => {
  const { tip } = props;
  return (
    <div class="flex items-center gap-3 text-sm">
      <LuCheckCircle class="w-4 h-4 text-success" />
      <span>{tip}</span>
    </div>
  );
});
