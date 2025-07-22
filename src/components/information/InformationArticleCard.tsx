import { component$ } from "@qwik.dev/core";

interface InformationArticleCardProps {
  title: string;
  category: string;
  image: string;
  excerpt: string;
  href?: string; // Optional link to the full article
}

export const InformationArticleCard = component$(
  (props: InformationArticleCardProps) => {
    const { title, category, image, excerpt, href } = props;
    return (
      <a href={href} class="card bg-base-100 shadow-xl image-full group">
        <figure>
          <img
            src={image}
            alt={title}
            width="400"
            height="250"
            class="transition-transform duration-300 group-hover:scale-105"
          />
        </figure>
        <div class="card-body bg-black bg-opacity-60 text-white rounded-xl">
          <h2 class="card-title text-xl font-bold group-hover:underline">
            {title}
          </h2>
          <p class="text-sm mb-2">{excerpt}</p>
          <div class="card-actions justify-end">
            <div class="badge badge-outline text-white border-white">
              {category}
            </div>
            {href && (
              <button class="btn btn-primary btn-sm">Baca Selengkapnya</button>
            )}
          </div>
        </div>
      </a>
    );
  },
);
