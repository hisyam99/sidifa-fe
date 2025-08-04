import { component$, type Component, type SVGProps } from "@builder.io/qwik";

interface DashboardQuickLinkCardProps {
  href: string;
  label: string;
  icon: Component<SVGProps<SVGSVGElement>>;
  description: string;
}

export const DashboardQuickLinkCard = component$(
  (props: DashboardQuickLinkCardProps) => {
    const { href, label, icon: Icon, description } = props;
    return (
      <a
        href={href}
        class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 border border-base-200 hover:border-primary group"
      >
        <div class="card-body flex flex-col items-center text-center">
          <div class="mb-4">
            {Icon && <Icon class="w-6 h-6 text-primary" />}
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
