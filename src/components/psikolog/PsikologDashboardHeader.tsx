import { component$ } from "@builder.io/qwik";
import { LuPlus } from "~/components/icons/lucide-optimized"; // Updated import path
import { QRL } from "@builder.io/qwik";

interface PsikologDashboardHeaderProps {
  onButtonClick$: QRL<() => void>;
}

export const PsikologDashboardHeader = component$(
  (props: PsikologDashboardHeaderProps) => {
    const { onButtonClick$ } = props;
    return (
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Dashboard Psikolog</h1>
        <button class="btn btn-primary" onClick$={onButtonClick$}>
          <LuPlus class="w-4 h-4 mr-2" />
          Buat Laporan Asesmen
        </button>
      </div>
    );
  },
);
