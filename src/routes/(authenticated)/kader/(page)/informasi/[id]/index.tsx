import { component$, useSignal, useVisibleTask$, $ } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";
import type { DocumentHead } from "@qwik.dev/router";
import { useLocation, useNavigate } from "@qwik.dev/router";
import { useInformasiEdukasiKader } from "~/hooks/useInformasiEdukasiKader";
import { useAuth } from "~/hooks";
import { GenericLoadingSpinner } from "~/components/common";
import { buildInformasiEdukasiUrl } from "~/utils/url";
import { marked } from "marked";
import DOMPurify from "dompurify";
import {
  LuCalendar,
  LuFileText,
  LuClock,
  LuShare,
  LuArrowLeft,
} from "~/components/icons/lucide-optimized";

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();
  const { isLoggedIn } = useAuth();
  const { fetchDetail, fetchList, error, items } = useInformasiEdukasiKader();
  const item = useSignal<any>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(isLoggedIn);
    track(() => loc.params.id);

    const id = loc.params["id"];
    if (isLoggedIn.value && id) {
      item.value = await fetchDetail(id);
      // Fetch recent articles for sidebar
      await fetchList({ limit: 5, page: 1 });
    }
  });

  const tipeToBadge = (tipe: string) => {
    const t = (tipe || "").toString().toUpperCase();
    if (t.includes("ARTIKEL")) return "badge badge-primary";
    if (t.includes("PANDUAN")) return "badge badge-success";

    return "badge badge-ghost";
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Tanggal tidak tersedia";
    }
  };

  const stripHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const recentArticles =
    items.value
      ?.filter((article) => article.id !== item.value?.id)
      .slice(0, 4) || [];

  const renderedHtml = useSignal<string>("");
  const renderedHeaderHtml = useSignal<string>("");

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    track(() => item.value?.deskripsi);
    track(() => loc.url.hash);
    const md = (item.value?.deskripsi || "").toString();
    // Render full markdown then inject heading IDs on client
    const html = marked.parse(md);
    const sanitized = DOMPurify.sanitize(html as string);
    const container = document.createElement("div");
    container.innerHTML = sanitized;
    const makeSlug = (input: string) =>
      (input || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    container.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((el) => {
      const heading = el as HTMLElement;
      if (!heading.id || heading.id.trim() === "") {
        const slug = makeSlug(heading.textContent || "");
        if (slug) heading.id = slug;
      }
    });
    renderedHtml.value = container.innerHTML;

    // Header: only paragraphs
    const tokens = marked.lexer(md);
    const paragraphTokens = tokens.filter((t) => t.type === "paragraph");
    const headerHtml = marked.parser(paragraphTokens as any);
    renderedHeaderHtml.value = DOMPurify.sanitize(headerHtml as string);

    const scrollToHash = () => {
      const rawHash = loc.url.hash; // includes leading '#'
      const hash = rawHash ? rawHash.slice(1) : "";
      if (!hash) return;
      const id = decodeURIComponent(hash);
      const findById = (candidate: string) =>
        document.getElementById(candidate);
      let target: HTMLElement | null = findById(id);
      // Try normalized single-dash variant
      if (!target) target = findById(id.replace(/--+/g, "-"));
      // Fallback: compute slugs from headings text
      if (!target) {
        const makeVariants = (txt: string) => {
          const base = makeSlug(txt);
          return [base, base.replace(/-/g, "--")];
        };
        const headings = Array.from(
          document.querySelectorAll<HTMLElement>("h1,h2,h3,h4,h5,h6"),
        );
        for (const h of headings) {
          const variants = makeVariants(h.textContent || "");
          if (variants.includes(id)) {
            target = h;
            break;
          }
        }
      }
      if (target) {
        // Ensure future jumps work with the exact hash
        target.id = id;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Scroll after content renders
    setTimeout(scrollToHash, 0);
    // No direct window event: track loc.url.hash via track above; optional listener for manual hashchange
    const onHashChange = () => scrollToHash();
    window.addEventListener("hashchange", onHashChange);
    cleanup(() => window.removeEventListener("hashchange", onHashChange));
  });

  return (
    <div class="min-h-screen">
      {error.value && <div class="alert alert-error mb-4">{error.value}</div>}
      {!item.value && !error.value && <GenericLoadingSpinner />}
      {item.value && (
        <>
          {/* Hero Section with Background Image */}
          <div class="relative bg-gradient-to-br from-primary/90 to-primary-focus/90 overflow-hidden rounded-3xl">
            {item.value.file_name && (
              <div
                class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={`background-image: url('${buildInformasiEdukasiUrl(item.value.file_name)}'); filter: brightness(0.3);`}
              />
            )}
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-8 md:pb-12">
              <div class="pt-4 pb-12">
                <button
                  class="btn btn-ghost btn-sm text-white/90 hover:text-white hover:bg-white/10 mb-6 self-start"
                  onClick$={$(() => {
                    const from = document.referrer || "";
                    if (from.includes("/kader/informasi")) {
                      history.back();
                    } else {
                      nav("/kader/informasi");
                    }
                  })}
                >
                  <LuArrowLeft class="w-4 h-4 mr-2" />
                  Kembali
                </button>
              </div>

              <div class="max-w-4xl">
                <div class="flex flex-wrap items-center gap-3 mb-6">
                  <span
                    class={`${tipeToBadge(item.value.tipe)} bg-white/20 border-white/30 text-white backdrop-blur-sm`}
                  >
                    {(item.value.tipe || "").toString().toUpperCase()}
                  </span>
                  <div class="flex items-center text-white/90 text-sm">
                    <LuCalendar class="w-4 h-4 mr-2" />
                    {formatDate(item.value.created_at || "")}
                  </div>
                  <div class="flex items-center text-white/90 text-sm">
                    <LuClock class="w-4 h-4 mr-2" />
                    {Math.ceil(
                      stripHtml(item.value.deskripsi || "").length / 200,
                    )}{" "}
                    min baca
                  </div>
                </div>

                <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  {item.value.judul}
                </h1>

                <div
                  class="prose prose-invert max-w-3xl line-clamp-3 leading-relaxed prose-p:text-white/95 prose-a:text-white/95 prose-strong:text-white prose-em:text-white/90 prose-headings:text-white"
                  dangerouslySetInnerHTML={renderedHeaderHtml.value}
                />

                {item.value.file_name && (
                  <div class="mt-8">
                    <Link
                      class="btn btn-outline btn-primary bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary"
                      href={buildInformasiEdukasiUrl(item.value.file_name)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LuShare class="w-4 h-4 mr-2" />
                      Lihat Lampiran
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div class="py-4 md:py-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Article Content */}
              <div class="lg:col-span-2">
                <article class="card bg-base-100 shadow-lg">
                  <div class="card-body">
                    {/* Article Meta */}
                    <div class="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b">
                      <div class="flex items-center gap-4">
                        <div class="avatar placeholder">
                          <div class="bg-primary text-primary-content rounded-full w-12 h-12">
                            <span class="text-lg font-bold">SI</span>
                          </div>
                        </div>
                        <div>
                          <div class="font-semibold text-base-content">
                            Si-DIFA
                          </div>
                          <div class="text-sm text-base-content/60">
                            Sistem Informasi Disabilitas
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center gap-2">
                        <button class="btn btn-ghost btn-sm">
                          <LuShare class="w-4 h-4 mr-2" />
                          Bagikan
                        </button>
                      </div>
                    </div>

                    {/* Article Body */}
                    <div
                      class="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-base-content prose-p:text-base-content/80 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
                      dangerouslySetInnerHTML={renderedHtml.value}
                    />

                    {/* Article Footer */}
                    <div class="mt-12 pt-8 border-t">
                      <div class="flex flex-wrap items-center gap-2">
                        <LuFileText class="w-4 h-4 text-base-content/60" />
                        <span class="text-sm text-base-content/60 mr-2">
                          Tags:
                        </span>
                        <span
                          class={`${tipeToBadge(item.value.tipe)} badge-sm`}
                        >
                          {(item.value.tipe || "").toString()}
                        </span>
                        <div class="badge badge-outline badge-sm">
                          Informasi
                        </div>
                        <div class="badge badge-outline badge-sm">Edukasi</div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              {/* Sidebar */}
              <div class="lg:col-span-1">
                <div class="sticky top-20 z-10 space-y-6">
                  {/* Recent Articles */}
                  <div class="card bg-base-100 shadow-lg">
                    <div class="card-body">
                      <h3 class="card-title text-xl font-bold mb-4">
                        Artikel Terbaru
                      </h3>
                      <div class="space-y-4">
                        {recentArticles.length > 0 ? (
                          recentArticles.map((article) => (
                            <Link
                              key={article.id}
                              href={`/kader/informasi/${article.id}`}
                              class="block group"
                            >
                              <div class="flex gap-3">
                                {article.file_name ? (
                                  <div class="flex-shrink-0 w-16 h-16 bg-base-200 rounded-lg overflow-hidden">
                                    <img
                                      src={buildInformasiEdukasiUrl(
                                        article.file_name,
                                      )}
                                      alt={article.judul}
                                      width={64}
                                      height={64}
                                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                      loading="lazy"
                                    />
                                  </div>
                                ) : (
                                  <div class="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <LuFileText class="w-6 h-6 text-primary" />
                                  </div>
                                )}
                                <div class="flex-1 min-w-0">
                                  <h4 class="font-medium text-sm text-base-content group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                    {article.judul}
                                  </h4>
                                  <p class="text-xs text-base-content/60 mt-1">
                                    {formatDate(article.created_at || "")}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <p class="text-sm text-base-content/60">
                            Tidak ada artikel lain.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Newsletter/Info Box */}
                  <div class="card bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                    <div class="card-body text-center">
                      <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <LuFileText class="w-6 h-6 text-primary" />
                      </div>
                      <h3 class="font-bold text-base-content mb-2">
                        Tetap Terhubung
                      </h3>
                      <p class="text-sm text-base-content/70 mb-4">
                        Dapatkan informasi terbaru seputar disabilitas dan
                        layanan posyandu.
                      </p>
                      <Link
                        href="/kader/informasi"
                        class="btn btn-primary btn-sm btn-block"
                      >
                        Lihat Semua Artikel
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Detail Informasi & Edukasi - Si-DIFA",
};
