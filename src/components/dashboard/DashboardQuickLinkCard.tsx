import { component$, type Component, type SVGProps, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

interface DashboardQuickLinkCardProps {
  href: string;
  label: string;
  icon: Component<SVGProps<SVGSVGElement>>;
  description: string;
}

export const DashboardQuickLinkCard = component$<DashboardQuickLinkCardProps>(
  (props) => {
    const { href, label, icon: Icon, description } = props;
    const nav = useNavigate();

    // Handle navigation with Qwik best practices
    const handleNavigation = $(async () => {
      await nav(href);
    });

    return (
      <button
        onClick$={handleNavigation}
        class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 border border-base-200 hover:border-primary group w-full text-left"
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
      </button>
    );
  },
);
