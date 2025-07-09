import { component$ } from "@builder.io/qwik";

interface FormFieldProps {
  field: any;
  props: any;
  type?: string;
  placeholder?: string;
  label?: string;
  class?: string;
}

export default component$<FormFieldProps>(
  ({
    field,
    props,
    type = "text",
    placeholder,
    label,
    class: className = "input input-bordered w-full",
  }) => {
    return (
      <div>
        {label && (
          <label class="label">
            <span class="label-text font-semibold">{label}</span>
          </label>
        )}
        <input
          {...props}
          type={type}
          placeholder={placeholder}
          class={className}
        />
        {field.error && (
          <div class="text-red-500 text-sm mt-1">{field.error}</div>
        )}
      </div>
    );
  },
);
