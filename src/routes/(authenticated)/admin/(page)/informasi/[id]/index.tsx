import { component$, useVisibleTask$, useSignal, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { useInformasiEdukasiAdmin } from "~/hooks/useInformasiEdukasiAdmin";
import Alert from "~/components/ui/Alert";
import { useNavigate, useLocation } from "@builder.io/qwik-city";
import { GenericLoadingSpinner, ConfirmationModal } from "~/components/common";
import type { InformasiItem } from "~/types/informasi";
import { buildInformasiEdukasiUrl } from "~/utils/url";
import { marked } from "marked";
import DOMPurify from "dompurify";
import {
  LuCalendar,
  LuFileText,
  LuClock,
  LuShare,
  LuArrowLeft,
  LuPencil,
  LuTrash,
} from "~/components/icons/lucide-optimized";

export default component$(() => {
  const { fetchDetail, fetchList, deleteItem, loading, error, success, items } =
    useInformasiEdukasiAdmin();
  const nav = useNavigate();
  const loc = useLocation();
  const detail = useSignal<InformasiItem | null>(null);
  const showDeleteModal = useSignal(false);

  const { isLoggedIn } = useAuth();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(isLoggedIn);
    track(() => loc.params.id);

    if (isLoggedIn.value && loc.params.id) {
      const data = await fetchDetail(loc.params.id);
      detail.value = data || null;
      // recent articles for sidebar
      await fetchList({ limit: 5, page: 1 });
    }
  });

  const handleEdit = $((id: string) => {
    nav(`/admin/informasi/${id}/edit`);
  });

  const handleDeleteClick = $(() => {
    showDeleteModal.value = true;
  });

  const handleConfirmDelete = $(async () => {
    if (detail.value?.id) {
      await deleteItem(detail.value.id);
      showDeleteModal.value = false;
      if (!error.value) {
        nav("/admin/informasi");
      }
    }
  });

  const handleCancelDelete = $(() => {
    showDeleteModal.value = false;
  });

  const stripHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const renderedHtml = useSignal<string>("");
  const renderedHeaderHtml = useSignal<string>("");

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    track(() => detail.value?.deskripsi);
    track(() => loc.url.hash);
    const md = (detail.value?.deskripsi || "").toString();

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
      const rawHash = loc.url.hash;
      const hash = rawHash ? rawHash.slice(1) : "";
      if (!hash) return;
      const id = decodeURIComponent(hash);
      const findById = (candidate: string) =>
        document.getElementById(candidate);
      let target: HTMLElement | null = findById(id);
      if (!target) target = findById(id.replace(/--+/g, "-"));
      if (!target) {
        const headings = Array.from(
          document.querySelectorAll<HTMLElement>("h1,h2,h3,h4,h5,h6"),
        );
        for (const h of headings) {
          const base = makeSlug(h.textContent || "");
          if (base === id || base.replace(/-/g, "--") === id) {
            target = h;
            break;
          }
        }
      }
      if (target) {
        target.id = id;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    setTimeout(scrollToHash, 0);
    const onHashChange = () => scrollToHash();
    window.addEventListener("hashchange", onHashChange);
    cleanup(() => window.removeEventListener("hashchange", onHashChange));
  });

  const recentArticles = (items.value || []).filter(
    (a) => a.id !== detail.value?.id,
  );

  return (
    <div class="min-h-screen">
      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}
      {loading.value && <GenericLoadingSpinner />}
      {detail.value && (
        <>
          {/* Hero Section */}
          <div class="relative bg-gradient-to-br from-primary/90 to-primary-focus/90 overflow-hidden rounded-3xl">
            {detail.value.file_name && (
              <div
                class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={`background-image: url('${buildInformasiEdukasiUrl(detail.value.file_name)}'); filter: brightness(0.3);`}
              />
            )}
            <div class="absolute inset-0 bg-gradient-to-t from_black/70 via-black/30 to-transparent" />

            <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-8 md:pb-12">
              <div class="pt-4 pb-12">
                <button
                  class="btn btn-ghost btn-sm text_white/90 hover:text-white hover:bg-white/10 mb-6 self-start"
                  onClick$={$(() => {
                    const from = document.referrer || "";
                    if (from.includes("/admin/informasi")) {
                      history.back();
                    } else {
                      nav("/admin/informasi");
                    }
                  })}
                >
                  <LuArrowLeft class="w-4 h-4 mr-2" />
                  Kembali
                </button>
              </div>

              <div class="max-w-4xl">
                <div class="flex flex-wrap items-center gap-3 mb-6">
                  <span class="badge badge-primary bg-white/20 border-white/30 text-white backdrop-blur-sm">
                    {(detail.value.tipe || "").toString().toUpperCase()}
                  </span>
                  <div class="flex items-center text-white/90 text-sm">
                    <LuCalendar class="w-4 h-4 mr-2" />
                    {new Date(detail.value.created_at || "").toLocaleDateString(
                      "id-ID",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </div>
                  <div class="flex items-center text-white/90 text-sm">
                    <LuClock class="w-4 h-4 mr-2" />
                    {Math.ceil(
                      stripHtml(detail.value.deskripsi || "").length / 200,
                    )}{" "}
                    min baca
                  </div>
                </div>

                <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  {detail.value.judul}
                </h1>

                <div
                  class="prose prose-invert max-w-3xl line-clamp-3 leading-relaxed prose-p:text-white/95 prose-a:text-white/95 prose-strong:text-white prose-em:text-white/90 prose-headings:text-white"
                  dangerouslySetInnerHTML={renderedHeaderHtml.value}
                />

                {detail.value.file_name && (
                  <div class="mt-8">
                    <a
                      class="btn btn-outline btn-primary bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary"
                      href={buildInformasiEdukasiUrl(detail.value.file_name)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LuShare class="w-4 h-4 mr-2" />
                      Lihat Lampiran
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div class="py-4 md:py-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Article */}
              <div class="lg:col-span-2">
                <article class="card bg-base-100 shadow-lg">
                  <div class="card-body">
                    {/* Actions */}
                    <div class="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b">
                      <div class="flex items-center gap-4">
                        <div class="avatar placeholder">
                          <div class="bg-primary text-primary-content rounded-full w-12 h-12">
                            <span class="text-lg font-bold">AD</span>
                          </div>
                        </div>
                        <div>
                          <div class="font-semibold text-base-content">
                            Admin
                          </div>
                          <div class="text-sm text-base-content/60">
                            Si-DIFA
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          class="btn btn-primary btn-sm"
                          onClick$={() =>
                            detail.value?.id && handleEdit(detail.value.id)
                          }
                        >
                          <LuPencil class="w-4 h-4 mr-2" /> Edit
                        </button>
                        <button
                          class="btn btn-error btn-sm"
                          onClick$={() =>
                            detail.value?.id && handleDeleteClick()
                          }
                        >
                          <LuTrash class="w-4 h-4 mr-2" /> Hapus
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    <div
                      class="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-base-content prose-p:text-base-content/80 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
                      dangerouslySetInnerHTML={renderedHtml.value}
                    />
                  </div>
                </article>
              </div>

              {/* Sidebar */}
              <div class="lg:col-span-1">
                <div class="sticky top-20 z-10 space-y-6">
                  <div class="card bg-base-100 shadow-lg">
                    <div class="card-body">
                      <h3 class="card-title text-xl font-bold mb-4">
                        Artikel Terbaru
                      </h3>
                      <div class="space-y-4">
                        {recentArticles.length > 0 ? (
                          recentArticles.map((article) => (
                            <a
                              key={article.id}
                              href={`/admin/informasi/${article.id}`}
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
                                    {new Date(
                                      article.created_at || "",
                                    ).toLocaleDateString("id-ID", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </a>
                          ))
                        ) : (
                          <p class="text-sm text-base-content/60">
                            Tidak ada artikel lain.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Konfirmasi Hapus Data"
        message="Apakah Anda yakin ingin menghapus informasi ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm$={handleConfirmDelete}
        onCancel$={handleCancelDelete}
      />
    </div>
  );
});
