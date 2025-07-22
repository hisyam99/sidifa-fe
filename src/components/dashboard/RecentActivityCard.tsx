import { component$ } from "@qwik.dev/core";
import { getActivityTypeClass } from "~/utils/dashboard-utils";
import {
  LuCheckCircle,
  LuClock,
  LuBell,
  LuFileText,
} from "@qwikest/icons/lucide";

interface RecentActivityCardProps {
  title: string;
  description: string;
  time: string;
  type: "success" | "warning" | "info" | "danger";
}

export const RecentActivityCard = component$(
  (props: RecentActivityCardProps) => {
    const { title, description, time, type } = props;
    const activityClass = getActivityTypeClass(type);

    const getIconForActivity = (activityType: string) => {
      switch (activityType) {
        case "success":
          return <LuCheckCircle class="w-5 h-5" />;
        case "info":
          return <LuBell class="w-5 h-5" />;
        case "warning":
          return <LuFileText class="w-5 h-5" />;
        case "danger":
          return <LuFileText class="w-5 h-5" />;
        default:
          return <LuBell class="w-5 h-5" />;
      }
    };

    return (
      <div class="flex items-start gap-4 p-4 rounded-lg shadow-sm border border-base-200/50 hover:shadow-md transition-shadow duration-200">
        <div
          class={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activityClass}`}
        >
          {getIconForActivity(type)}
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-base-content mb-1">{title}</h3>
          <p class="text-sm text-base-content/70 mb-1 leading-snug">
            {description}
          </p>
          <div class="flex items-center text-xs text-base-content/50">
            <LuClock class="w-3 h-3 mr-1" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    );
  },
);
