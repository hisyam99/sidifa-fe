import { component$, useSignal, $, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { articlesData, ArticleItem } from "~/data/information-data"; // Import ArticleItem
import { SearchBox } from "~/components/common";
import { InformationArticleCard } from "~/components/information";

export default component$(() => {
  const searchTerm = useSignal("");
  const displayedArticles = useSignal<ArticleItem[]>([]);

  const filterArticles = $(() => {
    const searchLower = searchTerm.value.toLowerCase();
    return articlesData.filter((article: ArticleItem) => {
      return (
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.category.toLowerCase().includes(searchLower)
      );
    });
  });

  useTask$(async ({ track }) => {
    track(() => searchTerm.value);
    displayedArticles.value = await filterArticles();
  });

  return (
    <div>
      <h1 class="text-3xl font-bold mb-2">Informasi & Edukasi</h1>
      <p class="mb-6">
        Kumpulan artikel, panduan, dan materi edukasi untuk Anda.
      </p>

      <div class="mb-6">
        <SearchBox
          placeholder="Cari artikel atau panduan..."
          value={searchTerm.value}
          onInput$={(e) =>
            (searchTerm.value = (e.target as HTMLInputElement).value)
          }
          onEnter$={$(() => {})}
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedArticles.value.length > 0 ? (
          displayedArticles.value.map((article: ArticleItem) => ( // Use displayedArticles.value
            <InformationArticleCard
              key={article.title}
              title={article.title}
              category={article.category}
              image={article.image}
              excerpt={article.excerpt}
              href={`/kader/informasi/${article.title.toLowerCase().replace(/\s/g, "-")}`}
            />
          ))
        ) : (
          <p class="col-span-full text-center text-base-content/70">
            Tidak ada artikel yang cocok dengan pencarian Anda.
          </p>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Informasi & Edukasi - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Informasi dan Edukasi untuk Kader Posyandu Si-DIFA",
    },
  ],
};
