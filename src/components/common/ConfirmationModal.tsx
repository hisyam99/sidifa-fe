import { component$, Signal, QRL, Slot } from "@qwik.dev/core";

interface ConfirmationModalProps {
  isOpen: Signal<boolean>;
  title: string;
  message: string;
  onConfirm$: QRL<() => void>;
  onCancel$: QRL<() => void>;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
}

export const ConfirmationModal = component$((props: ConfirmationModalProps) => {
  const {
    isOpen,
    title,
    message,
    onConfirm$,
    onCancel$,
    confirmButtonText = "Konfirmasi",
    cancelButtonText = "Batal",
    confirmButtonClass = "btn-error",
    cancelButtonClass = "btn-ghost",
  } = props;

  if (!isOpen.value) {
    return null;
  }

  return (
    <div class="modal modal-open modal-bottom sm:modal-middle">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-2">{title}</h3>
        {message && <p class="py-4 text-base-content/70">{message}</p>}

        {/* Slot untuk children content seperti form */}
        <div class="py-4">
          <Slot />
        </div>

        <div class="modal-action">
          <button class={`btn ${cancelButtonClass}`} onClick$={onCancel$}>
            {cancelButtonText}
          </button>
          {confirmButtonText && (
            <button class={`btn ${confirmButtonClass}`} onClick$={onConfirm$}>
              {confirmButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
