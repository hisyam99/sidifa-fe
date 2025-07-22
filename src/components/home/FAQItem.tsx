import { component$ } from "@qwik.dev/core";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

export const FAQItem = component$((props: FAQItemProps) => {
  const { question, answer, index } = props;
  const checkboxId = `faq-${index}`;

  return (
    <div
      tabIndex={index}
      class="collapse collapse-plus bg-base-100 shadow-md border border-base-200/50 rounded-box mb-4"
    >
      <input type="checkbox" id={checkboxId} class="peer" />
      <div class="collapse-title text-xl font-medium text-primary peer-checked:text-primary-focus">
        <label for={checkboxId} class="cursor-pointer w-full block">
          {question}
        </label>
      </div>
      <div class="collapse-content text-base-content/70">
        <p class="py-4 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
});
