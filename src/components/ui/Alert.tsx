import { component$ } from "@builder.io/qwik";
import {
  LuXCircle,
  LuCheckCircle,
  LuAlertTriangle,
  LuInfo,
} from "@qwikest/icons/lucide";

interface AlertProps {
  type: "error" | "success" | "warning" | "info";
  message: string;
  class?: string;
  showIcon?: boolean;
}

export default component$<AlertProps>(
  ({ type, message, class: className = "", showIcon = true }) => {
    const alertConfig = {
      error: {
        class: "alert alert-error",
        icon: <LuXCircle class="stroke-current shrink-0 h-6 w-6" />,
      },
      success: {
        class: "alert alert-success",
        icon: <LuCheckCircle class="stroke-current shrink-0 h-6 w-6" />,
      },
      warning: {
        class: "alert alert-warning",
        icon: <LuAlertTriangle class="stroke-current shrink-0 h-6 w-6" />,
      },
      info: {
        class: "alert alert-info",
        icon: <LuInfo class="stroke-current shrink-0 w-6 h-6" />,
      },
    };

    const config = alertConfig[type];

    return (
      <div class={`${config.class} ${className}`}>
        {showIcon && config.icon}
        <span>{message}</span>
      </div>
    );
  },
);
