import { component$ } from "@qwik.dev/core";
import { LuCheckCircle } from "~/components/icons/lucide-optimized"; // Updated import path

interface AuthRequirementsListProps {
  requirements: string[];
}

export const AuthRequirementsList = component$(
  (props: AuthRequirementsListProps) => {
    const { requirements } = props;
    return (
      <div class="mt-8">
        <h3 class="font-semibold text-base-content mb-3">
          Persyaratan Pendaftaran
        </h3>
        <div class="space-y-2">
          {requirements.map((req, index) => (
            <div key={index} class="flex items-center gap-3 text-sm">
              <LuCheckCircle class="w-4 h-4 text-success" />
              <span>{req}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
