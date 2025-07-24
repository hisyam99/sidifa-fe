import { component$, Slot, useSignal, $, QRL } from "@qwik.dev/core";
import {
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuCircle,
  LuAlertCircle,
} from "@qwikest/icons/lucide";
import { Spinner } from "./Spinner";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  isValid?: boolean;
  isCompleted?: boolean;
  isRequired?: boolean;
}

interface FormWizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange$?: QRL<(stepIndex: number) => void>; // FIX: Changed to QRL
  onNext$?: QRL<() => void>; // FIX: Changed to QRL
  onPrevious$?: QRL<() => void>; // FIX: Changed to QRL
  onSubmit$?: QRL<() => void>; // FIX: Changed to QRL
  nextLabel?: string;
  previousLabel?: string;
  submitLabel?: string;
  showProgressBar?: boolean;
  allowSkipSteps?: boolean;
  className?: string;
}

export default component$<FormWizardProps>(
  ({
    steps,
    currentStep,
    onNext$,
    onPrevious$,
    onSubmit$,
    nextLabel = "Selanjutnya",
    previousLabel = "Sebelumnya",
    submitLabel = "Simpan",
    showProgressBar = true,
    allowSkipSteps = false,
    className = "",
  }) => {
    const isLoading = useSignal(false);

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;
    const currentStepData = steps[currentStep];
    const progressPercentage = ((currentStep + 1) / steps.length) * 100;

    // Extract button icon for submit and next
    let submitButtonIcon = null;
    if (isLoading.value) {
      submitButtonIcon = <Spinner size="w-5 h-5" />;
    }
    let nextButtonIcon = null;
    if (isLoading.value) {
      nextButtonIcon = <Spinner size="w-5 h-5" />;
    } else {
      nextButtonIcon = <LuChevronRight class="w-4 h-4" />;
    }

    return (
      <div class={`w-full ${className}`}>
        {/* Progress Bar */}
        {showProgressBar && (
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-base-content">
                Langkah {currentStep + 1} dari {steps.length}
              </h2>
              <div class="text-sm text-base-content/70">
                {Math.round(progressPercentage)}% selesai
              </div>
            </div>

            <div class="w-full bg-base-200 rounded-full h-2 mb-6">
              <div
                class="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500 ease-out"
                style={`width: ${progressPercentage}%`}
              ></div>
            </div>
          </div>
        )}

        {/* Step Navigation */}
        <div class="mb-8">
          <div class="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCurrent = index === currentStep;
              const isCompleted = step.isCompleted || index < currentStep;
              const isClickable = allowSkipSteps || index <= currentStep;

              let stepCircleContent;
              if (isCompleted && !isCurrent) {
                stepCircleContent = <LuCheck class="w-6 h-6" />;
              } else if (
                step.isRequired &&
                !step.isValid &&
                index < currentStep
              ) {
                stepCircleContent = (
                  <LuAlertCircle class="w-6 h-6 text-warning" />
                );
              } else {
                stepCircleContent = (
                  <span class="text-sm font-semibold">{index + 1}</span>
                );
              }

              let stepCircleClass =
                "relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ";
              if (isCurrent) {
                stepCircleClass +=
                  "border-primary bg-primary text-white scale-110 shadow-lg ";
              } else if (isCompleted) {
                stepCircleClass += "border-primary bg-primary text-white ";
              } else {
                stepCircleClass +=
                  "border-base-300 bg-base-100 text-base-content/50 hover:border-primary/50 ";
              }
              if (!isClickable) {
                stepCircleClass += "cursor-not-allowed opacity-50 ";
              }

              return (
                <div
                  key={step.id}
                  class="flex flex-col items-center flex-1 relative"
                >
                  {/* Step Connector Line */}
                  {index < steps.length - 1 && (
                    <div class="absolute top-6 left-1/2 transform translate-x-1/2 w-full h-0.5 bg-base-200 z-0">
                      <div
                        class={`h-0.5 transition-all duration-500 ${
                          index < currentStep ? "bg-primary" : "bg-base-200"
                        }`}
                        style={`width: ${index < currentStep ? "100%" : "0%"}`}
                      ></div>
                    </div>
                  )}

                  {/* Step Circle */}
                  <div
                    class={stepCircleClass}
                    onClick$={$(() => {
                      // Step navigation disabled for now to avoid serialization issues
                      // If you want to enable step navigation:
                      // if (isClickable && onStepChange$) {
                      //   onStepChange$(index);
                      // }
                    })}
                  >
                    {stepCircleContent}
                  </div>

                  {/* Step Label */}
                  <div class="mt-3 text-center max-w-20">
                    <p
                      class={`text-xs font-medium ${
                        isCurrent ? "text-primary" : "text-base-content/70"
                      }`}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p class="text-xs text-base-content/50 mt-1 leading-tight">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Content */}
        <div class="mb-8">
          <div class="bg-base-100 rounded-lg shadow-sm border border-base-200/50 p-6">
            <div class="mb-6">
              <h3 class="text-xl font-bold text-base-content mb-2">
                {currentStepData?.title}
              </h3>
              {currentStepData?.description && (
                <p class="text-base-content/70">
                  {currentStepData.description}
                </p>
              )}
            </div>

            {/* Form Content Slot */}
            <div class="min-h-[200px]">
              <Slot />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div class="flex items-center justify-between">
          <div>
            {!isFirstStep && (
              <button
                type="button"
                class="btn btn-ghost gap-2"
                onClick$={onPrevious$}
                disabled={isLoading.value}
              >
                <LuChevronLeft class="w-4 h-4" />
                {previousLabel}
              </button>
            )}
          </div>

          <div class="flex items-center gap-3">
            {/* Step Validation Warning */}
            {currentStepData?.isRequired && !currentStepData?.isValid && (
              <div class="flex items-center gap-2 text-warning text-sm">
                <LuAlertCircle class="w-4 h-4" />
                <span>Lengkapi data yang diperlukan</span>
              </div>
            )}

            {isLastStep ? (
              <button
                type="button"
                class="btn btn-primary gap-2"
                onClick$={onSubmit$}
                disabled={
                  isLoading.value ||
                  (currentStepData?.isRequired && !currentStepData?.isValid)
                }
              >
                {submitButtonIcon}
                {submitLabel}
              </button>
            ) : (
              <button
                type="button"
                class="btn btn-primary gap-2"
                onClick$={onNext$}
                disabled={
                  isLoading.value ||
                  (currentStepData?.isRequired && !currentStepData?.isValid)
                }
              >
                {nextButtonIcon}
                {nextLabel}
              </button>
            )}
          </div>
        </div>

        {/* Step Summary (for last step) */}
        {isLastStep && (
          <div class="mt-8 p-4 bg-info/10 border border-info/20 rounded-lg">
            <h4 class="font-semibold text-base-content mb-2">
              Ringkasan Langkah:
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              {steps.map((step) => (
                <div key={step.id} class="flex items-center gap-2 text-sm">
                  {step.isCompleted ? (
                    <LuCheck class="w-4 h-4 text-success" />
                  ) : (
                    <LuCircle class="w-4 h-4 text-base-content/50" />
                  )}
                  <span
                    class={
                      step.isCompleted
                        ? "text-base-content"
                        : "text-base-content/50"
                    }
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);
