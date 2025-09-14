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
  }) => {
    // --- Helper functions for rendering different input types ---

    function getInputClass(
      type: string,
      error: boolean,
      className: string = "",
    ): string {
      let base = "";
      if (type === "select") {
        base = "select select-bordered w-full focus-ring";
      } else if (type === "textarea") {
        base = "textarea textarea-bordered w-full focus-ring";
      } else if (type === "file") {
        base = "input input-bordered w-full focus-ring";
      } else {
        base = "input input-bordered w-full focus-ring";
      }

      let errorClass = "";
      if (type === "select") {
        if (error) errorClass = "select-error";
      } else if (type === "textarea") {
        if (error) errorClass = "textarea-error";
      } else if (error) errorClass = "input-error";

      return `${base} ${errorClass} ${className || ""}`.trim();
    }

    function renderSelect(
      props: any,
      field: any,
      options: Option[],
      className: string = "",
    ) {
      return (
        <select
          {...props}
          value={field.value ?? ""}
          class={getInputClass("select", field.error, className)}
          aria-invalid={field.error ? "true" : "false"}
          aria-describedby={field.error ? `${props.name}-error` : undefined}
          onInput$={props.onInput$}
          onBlur$={props.onBlur$}
        >
          {options.map((opt: Option) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    function renderTextarea(
      props: any,
      field: any,
      placeholder: string,
      rows: number,
      className: string = "",
      maxLength?: number,
    ) {
      return (
        <textarea
          {...props}
          value={field.value ?? ""}
          class={getInputClass("textarea", field.error, className)}
          placeholder={placeholder}
          rows={rows}
          aria-invalid={field.error ? "true" : "false"}
          aria-describedby={field.error ? `${props.name}-error` : undefined}
          maxLength={maxLength}
          onInput$={props.onInput$}
          onBlur$={props.onBlur$}
        />
      );
    }

    function renderFileInput(
      props: any,
      field: any,
      placeholder: string,
      className: string = "",
      accept?: string,
    ) {
      return (
        <input
          {...props}
          type="file"
          placeholder={placeholder}
          class={getInputClass("file", field.error, className)}
          aria-invalid={field.error ? "true" : "false"}
          aria-describedby={field.error ? `${props.name}-error` : undefined}
          accept={accept}
          onInput$={props.onInput$}
          onBlur$={props.onBlur$}
          autoFocus={field.error ? true : undefined}
        />
      );
    }

    // Use an options object to reduce parameter count and improve clarity
    interface DefaultInputOptions {
      props: any;
      field: any;
      type: string;
      placeholder: string;
      className?: string;
      min?: number;
      max?: number;
      inputMode?: string;
      pattern?: string;
      accept?: string;
      maxLength?: number;
    }

    function renderDefaultInput(opts: DefaultInputOptions) {
      const {
        props,
        field,
        type,
        placeholder,
        className = "",
        min,
        max,
        inputMode,
        pattern,
        accept,
        maxLength,
      } = opts;
      return (
        <input
          {...props}
          type={type}
          value={field.value ?? ""}
          placeholder={placeholder}
          class={getInputClass("input", field.error, className)}
          aria-invalid={field.error ? "true" : "false"}
          aria-describedby={field.error ? `${props.name}-error` : undefined}
          min={min}
          max={max}
          inputMode={inputMode}
          pattern={pattern}
          accept={accept}
          maxLength={maxLength}
          onInput$={props.onInput$}
          onBlur$={props.onBlur$}
          autoFocus={field.error ? true : undefined}
        />
      );
    }

    // --- Main render logic ---
    // Always ensure className is a string
    const safeClassName = typeof className === "string" ? className : "";

    let inputElement = null;
    if (type === "select" && options) {
      inputElement = renderSelect(props, field, options, safeClassName);
    } else if (type === "textarea") {
      inputElement = renderTextarea(
        props,
        field,
        placeholder ?? "",
        rows,
        safeClassName ?? "",
        maxLength,
      );
    } else if (type === "file") {
      inputElement = renderFileInput(
        props,
        field,
        placeholder ?? "",
        safeClassName ?? "",
        accept,
      );
    } else {
      inputElement = renderDefaultInput({
        props,
        field,
        type,
        placeholder: placeholder ?? "",
        className: safeClassName ?? "",
        min,
        max,
        inputMode,
        pattern,
        accept,
        maxLength,
      });
    }

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
        {inputElement}
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
