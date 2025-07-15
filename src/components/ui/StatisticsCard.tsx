// File: /sidifa-fev2/src/components/ui/StatisticsCard.tsx

import { component$, QRL, type FunctionComponent } from "@builder.io/qwik";
import {
  LuTrendingUp,
  LuTrendingDown,
  LuBarChart3,
  LuArrowUpRight,
  LuArrowDownRight,
  LuUsers,
  LuActivity,
  LuCalendar,
  LuAlertTriangle,
  LuHeart,
  LuMapPin,
  LuInfo,
  // Make sure ALL possible Lucide icons used by this component are imported here
  // Add any other icons that might be passed as a string name to this component
  // e.g., LuPlus, LuEye, LuClock, LuClipboardList, LuBrain, LuShield, LuFileText, LuDownload, LuCalendarDays, LuUserCheck
  // Include all icons that appear in posyandu/index.tsx or elsewhere that pass a string icon name to StatisticsCard
} from "@qwikest/icons/lucide";

// FIX: Define a comprehensive ICON_LOOKUP_MAP within this component file.
// This ensures the actual component functions are local to this file's closure for rendering,
// and the parent components only ever deal with string names.
const STATS_ICON_LOOKUP_MAP: { [key: string]: FunctionComponent<any> } = {
  LuTrendingUp: LuTrendingUp,
  LuTrendingDown: LuTrendingDown,
  LuBarChart3: LuBarChart3,
  LuArrowUpRight: LuArrowUpRight,
  LuArrowDownRight: LuArrowDownRight,
  LuUsers: LuUsers,
  LuActivity: LuActivity,
  LuCalendar: LuCalendar,
  LuAlertTriangle: LuAlertTriangle,
  LuHeart: LuHeart,
  LuMapPin: LuMapPin,
  LuInfo: LuInfo,
  // Add any other Lucide icons that are used by name in calls to StatisticsCard
  // For example, from posyandu/index.tsx:
  // LuPlus (not used in StatisticsCard directly), LuEye (not used in StatisticsCard directly),
  // LuClock (not used in StatisticsCard directly), LuClipboardList (not used in StatisticsCard directly),
  // LuBrain (not used in StatisticsCard directly), LuShield (not used in StatisticsCard directly),
  // LuFileText (not used in StatisticsCard directly), LuDownload (not used in StatisticsCard directly),
  // LuCalendarDays (not used in StatisticsCard directly), LuUserCheck (not used in StatisticsCard directly),
};

interface StatisticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  // FIX: Icon prop is a string name
  icon?: string;
  color?: "primary" | "secondary" | "accent" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  showChart?: boolean;
  chartData?: Array<{ label: string; value: number; color?: string }>;
  onClick$?: QRL<() => void>;
}

export default component$<StatisticsCardProps>(
  ({
    title,
    value,
    description,
    trend,
    // icon prop now takes a string name
    icon = "LuBarChart3", // Default to string name
    color = "primary",
    showChart = false,
    chartData = [],
    onClick$,
  }) => {
    // FIX: Dynamically get the icon component from the map *here*.
    const IconComponent = STATS_ICON_LOOKUP_MAP[icon] || LuBarChart3; // Fallback to default if not found

    const colorClasses = {
      primary: "bg-primary/10 text-primary border-primary/20",
      secondary: "bg-secondary/10 text-secondary border-secondary/20",
      accent: "bg-accent/10 text-accent border-accent/20",
      success: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      error: "bg-error/10 text-error border-error/20",
    };

    const iconColorClasses = {
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    };

    // Calculate total for percentage in chart
    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
      <div
        class={`card bg-base-100 shadow-lg border border-base-200/50 hover:shadow-xl transition-all duration-300 ${onClick$ ? "cursor-pointer hover:scale-[1.02]" : ""}`}
        onClick$={onClick$}
      >
        <div class="card-body">
          {/* Header */}
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center shadow-sm`}
              >
                <IconComponent class={`w-6 h-6 ${iconColorClasses[color]}`} />{" "}
                {/* Use IconComponent */}
              </div>
              <div>
                <h3 class="text-sm font-medium text-base-content/70 uppercase tracking-wide">
                  {title}
                </h3>
                <p class="text-2xl lg:text-3xl font-bold text-base-content mt-1">
                  {typeof value === "number"
                    ? value.toLocaleString("id-ID")
                    : value}
                </p>
              </div>
            </div>

            {trend && (
              <div
                class={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                  trend.isPositive
                    ? "bg-success/10 text-success"
                    : "bg-error/10 text-error"
                }`}
              >
                {trend.isPositive ? (
                  <LuArrowUpRight class="w-3 h-3" />
                ) : (
                  <LuArrowDownRight class="w-3 h-3" />
                )}
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <p class="text-sm text-base-content/70 mb-4">{description}</p>
          )}

          {/* Trend Detail */}
          {trend && (
            <div class="flex items-center gap-2 text-xs text-base-content/60">
              {trend.isPositive ? (
                <LuTrendingUp class="w-4 h-4 text-success" />
              ) : (
                <LuTrendingDown class="w-4 h-4 text-error" />
              )}
              <span>{trend.label}</span>
            </div>
          )}

          {/* Simple Chart Visualization */}
          {showChart && chartData.length > 0 && (
            <div class="mt-4">
              <div class="space-y-2">
                {chartData.slice(0, 4).map((item, index) => {
                  const percentage = total > 0 ? (item.value / total) * 100 : 0;
                  return (
                    <div
                      key={index}
                      class="flex items-center justify-between text-xs"
                    >
                      <div class="flex items-center gap-2">
                        <div
                          class={`w-3 h-3 rounded-full ${item.color || "bg-primary"}`}
                        ></div>
                        <span class="text-base-content/70">{item.label}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="font-semibold text-base-content">
                          {item.value}
                        </span>
                        <span class="text-base-content/50">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress bars */}
              <div class="space-y-1 mt-3">
                {chartData.slice(0, 4).map((item, index) => {
                  const percentage = total > 0 ? (item.value / total) * 100 : 0;
                  return (
                    <div
                      key={index}
                      class="w-full bg-base-200 rounded-full h-1.5"
                    >
                      <div
                        class={`h-1.5 rounded-full transition-all duration-500 ${item.color || "bg-primary"}`}
                        style={`width: ${percentage}%`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);
