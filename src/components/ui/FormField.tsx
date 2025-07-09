import { component$ } from "@builder.io/qwik";

interface FormFieldProps {
  field: any;
  props: any;
  type?: string;
  placeholder?: string;
  label?: string;
  class?: string;
  required?: boolean;
}

export default component$<FormFieldProps>(
  ({
    field,
    props,
    type = "text",
    placeholder,
    label,
    class: className = "",
    required = false,
  }) => {
    return (
      <div class="form-control w-full">
        {label && (
          <label class="label">
            <span class="label-text font-medium">
              {label}
              {required && <span class="text-error ml-1">*</span>}
            </span>
          </label>
        )}
        <input
          {...props}
          type={type}
          placeholder={placeholder}
          class={`input input-bordered w-full ${field.error ? "input-error" : ""} ${className}`}
        />
        {field.error && (
          <label class="label">
            <span class="label-text-alt text-error">{field.error}</span>
          </label>
        )}
      </div>
    );
  },
);
