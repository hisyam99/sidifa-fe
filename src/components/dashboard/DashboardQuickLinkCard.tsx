import { component$ } from "@qwik.dev/core";
import type { QRL, SVGProps } from "@qwik.dev/core";

interface DashboardQuickLinkCardProps {
  href: string;
  label: string;
  icon: QRL<(props: SVGProps<SVGSVGElement>) => any>;
  description: string;
}

export const DashboardQuickLinkCard = component$(
  (props: DashboardQuickLinkCardProps) => {
    const { href, label, icon, description } = props;
    return (
      <a
        href={href}
        class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 border border-base-200 hover:border-primary group"
      >
        <div class="card-body flex flex-col items-center text-center">
          <div class="mb-4">
            {icon && icon({ class: "w-6 h-6 text-primary" })}
          </div>
          <h2 class="card-title text-lg font-semibold group-hover:text-primary">
            {label}
          </h2>
          <p class="text-base-content/70 text-sm">{description}</p>
        </div>
      </a>
    );
  },
);
