import { component$ } from "@qwik.dev/core";

interface Option {
  value: string;
  label: string;
}

interface FormFieldModularProps {
  field: any;
  props: any;
  type?: string;
  placeholder?: string;
  label?: string;
  class?: string;
  required?: boolean;
  options?: Option[];
  helper?: string;
  min?: number;
  max?: number;
  rows?: number;
  inputMode?: string;
  pattern?: string;
  accept?: string;
  maxLength?: number;
  onInput$?: any;
}

export default component$<FormFieldModularProps>(
  ({
    field,
    props,
    type = "text",
    placeholder,
    label,
    class: className = "",
    required = false,
    options,
    helper,
    min,
    max,
    rows = 3,
    inputMode,
    pattern,
    accept,
    maxLength,
    onInput$,
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
        {type === "select" && options ? (
          <select
            {...props}
            class={`select select-bordered w-full focus-ring ${field.error ? "select-error" : ""} ${className}`}
            aria-invalid={field.error ? "true" : "false"}
            aria-describedby={field.error ? `${props.name}-error` : undefined}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            {...props}
            class={`textarea textarea-bordered w-full focus-ring ${field.error ? "textarea-error" : ""} ${className}`}
            placeholder={placeholder}
            rows={rows}
            aria-invalid={field.error ? "true" : "false"}
            aria-describedby={field.error ? `${props.name}-error` : undefined}
            maxLength={maxLength}
            onInput$={onInput$}
          />
        ) : (
          <input
            {...props}
            type={type}
            placeholder={placeholder}
            class={`input input-bordered w-full focus-ring ${field.error ? "input-error" : ""} ${className}`}
            aria-invalid={field.error ? "true" : "false"}
            aria-describedby={field.error ? `${props.name}-error` : undefined}
            min={min}
            max={max}
            inputMode={inputMode}
            pattern={pattern}
            accept={accept}
            maxLength={maxLength}
            onInput$={onInput$}
            autoFocus={field.error ? true : undefined}
          />
        )}
        {helper && (
          <label class="label">
            <span class="label-text-alt text-base-content/60">{helper}</span>
          </label>
        )}
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
