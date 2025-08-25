import { component$ } from "@builder.io/qwik";
import { FAQItem } from "~/components/home"; // Assuming FAQItem is in home for now
import type { FAQCategory as FAQCategoryType } from "~/data/faqs";

interface FAQCategoryProps {
  category: FAQCategoryType;
  categoryIndex: number;
}

export const FAQCategory = component$((props: FAQCategoryProps) => {
  const { category, categoryIndex } = props;

  return (
    <div
      class={`card ${category.bgColor} shadow-lg border border-base-200/50 animate-fade-in-up`}
      style={`animation-delay: ${categoryIndex * 200}ms`}
    >
      <div class="card-body p-6">
        {/* Category Header */}
        <div class="flex items-center gap-4 mb-6">
          <div
            class={`w-12 h-12 rounded-xl ${category.bgColor} border border-current/20 flex items-center justify-center`}
          >
            <category.icon class={`w-6 h-6 ${category.iconColor}`} />
          </div>
          <h2 class="text-2xl font-bold text-base-content">{category.judul}</h2>
        </div>

        {/* Questions & Answers */}
        <div class="space-y-4">
          {category.qa.map((item, qaIndex) => (
            <FAQItem
              key={`${category.judul}-${item.pertanyaan}`}
              question={item.pertanyaan}
              answer={item.jawaban}
              index={qaIndex} // Use qaIndex for unique id
            />
          ))}
        </div>
      </div>
    </div>
  );
});
