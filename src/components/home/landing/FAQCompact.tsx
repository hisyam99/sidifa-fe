import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { FAQItem } from "~/components/home";
import { faqCategories } from "~/data/faqs";

export const FAQCompact = component$(() => {
  const umum = faqCategories.find((c) => c.judul.toLowerCase() === "umum");
  const qa = (umum?.qa || faqCategories[0]?.qa || []).slice(0, 5);
  return (
    <section
      id="faq"
      class="py-14 lg:py-20 bg-base-200/60"
      data-animate="section"
    >
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-10">
          <h3 class="text-3xl font-bold mb-3">
            Pertanyaan yang Sering Diajukan
          </h3>
          <p class="text-base-content/70">
            Ringkasan dari FAQ lengkap. Lihat semua di halaman FAQ.
          </p>
        </div>
        <div class="max-w-3xl mx-auto">
          {qa.map((item, idx) => (
            <FAQItem
              key={`${item.pertanyaan}-${idx}`}
              question={item.pertanyaan}
              answer={item.jawaban}
              index={idx}
            />
          ))}
          <div class="text-center mt-6">
            <Link href="/faq" class="btn btn-primary">
              Lihat Semua FAQ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});
