import { component$, type InputHTMLAttributes } from "@builder.io/qwik";

interface FieldState {
  value: string | undefined;
  error: string | undefined;
  dirty: boolean;
  touched: boolean;
}

interface FormFieldProps {
  field: FieldState;
  props: InputHTMLAttributes<HTMLInputElement>;
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
          class={`input input-bordered w-full focus-ring ${field.error ? "input-error" : ""} ${className}`}
          aria-invalid={field.error ? "true" : "false"}
          aria-describedby={field.error ? `${props.name}-error` : undefined}
          // Auto-focus pada field yang error
          autoFocus={field.error ? true : undefined}
        />
        {field.error && (
          <label class="label">
            <span class="label-text-alt text-error" id={`${props.name}-error`}>
              {field.error}
            </span>
          </label>
        )}
      </div>
    );
  },
);
