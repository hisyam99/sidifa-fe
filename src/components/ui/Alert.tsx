import { component$ } from "@builder.io/qwik";

interface AlertProps {
  type: "error" | "success" | "warning" | "info";
  message: string;
  class?: string;
}

export default component$<AlertProps>(
  ({ type, message, class: className = "" }) => {
    const alertClasses = {
      error: "alert alert-error",
      success: "alert alert-success",
      warning: "alert alert-warning",
      info: "alert alert-info",
    };

    return (
      <div class={`${alertClasses[type]} ${className}`}>
        <span>{message}</span>
      </div>
    );
  },
);
