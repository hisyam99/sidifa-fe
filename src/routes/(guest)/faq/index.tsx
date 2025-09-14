import { component$, useSignal, $, useComputed$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { LuHelpCircle } from "~/components/icons/lucide-optimized"; // Updated import path
import { SearchBox } from "~/components/common";
import { FAQCategory } from "~/components/faq";
import { faqCategories as allFaqCategories } from "~/data/faqs";
import type { FAQCategory as FAQCategoryType } from "~/data/faqs"; // Import FAQCategoryType

export default component$(() => {
  const searchTerm = useSignal("");

  // Use useComputed$ instead of useTask$ to avoid lexical scope issues
  const displayedFaqCategories = useComputed$(() => {
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
    if (!lowerCaseSearchTerm) {
      return allFaqCategories;
    }

    return allFaqCategories
      .map((category: FAQCategoryType) => ({
        // Explicitly type category
        ...category,
        qa: category.qa.filter(
          (item) =>
            item.pertanyaan.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.jawaban.toLowerCase().includes(lowerCaseSearchTerm),
        ),
      }))
      .filter((category) => category.qa.length > 0);
  });

  return (
    <main class="bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      {/* Hero Section */}
      <section class="relative py-16 lg:py-20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12 animate-fade-in-up">
            <div class="bg-gradient-primary rounded-full w-20 h-20 lg:w-24 lg:h-24 shadow-xl mx-auto mb-6 flex items-center justify-center">
              <LuHelpCircle class="w-10 h-10 lg:w-12 lg:h-12" />
            </div>
            <h1 class="text-4xl lg:text-5xl font-bold text-gradient-primary mb-4">
              Tanya Jawab (FAQ)
            </h1>
            <p class="text-lg lg:text-xl text-base-content/70 max-w-3xl mx-auto">
              Temukan jawaban untuk pertanyaan umum seputar disabilitas, peran
              kader, dan penggunaan aplikasi SIDIFA
            </p>
          </div>

          {/* Search Box */}
          <div class="max-w-2xl mx-auto mb-10">
            <SearchBox
              placeholder="Cari pertanyaan yang ingin dijawab..."
              value={searchTerm.value}
              onInput$={$(
                (e: Event) =>
                  (searchTerm.value = (e.target as HTMLInputElement).value),
              )}
              onEnter$={$(() => {})}
            />
          </div>

          {/* FAQ Categories */}
          <div class="max-w-5xl mx-auto space-y-8">
            {displayedFaqCategories.value.map(
              (
                category: FAQCategoryType,
                categoryIndex: number, // Call as function and explicitly type parameters
              ) => (
                <FAQCategory
                  key={category.judul}
                  category={category}
                  categoryIndex={categoryIndex}
                />
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Tanya Jawab (FAQ) - SIDIFA",
  meta: [
    {
      name: "description",
      content:
        "Temukan jawaban atas pertanyaan umum tentang SIDIFA, disabilitas, peran kader, dan teknis aplikasi.",
    },
  ],
};
