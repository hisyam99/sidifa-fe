import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import * as LucideIcons from "~/components/icons/lucide-optimized";

const ICON_LOOKUP_MAP: Record<string, any> = LucideIcons;

interface SidebarMenuItemProps {
  href: string;
  label: string;
  icon?: any; // accept component reference or string key
  exact?: boolean; // when true, only highlight on exact path match (ignoring trailing slash)
  hasDropdown?: boolean; // indicates this item has dropdown
  submenuItems?: Array<{
    href: string;
    label: string;
    icon?: any;
    description?: string;
  }>;
}

export const SidebarMenuItem = component$((props: SidebarMenuItemProps) => {
  const { href, label, icon, exact, hasDropdown, submenuItems } = props;
  const location = useLocation();

  const current = location.url.pathname;
  const normalize = (p: string) => (p !== "/" ? p.replace(/\/+$/, "") : "/");
  const isActive = exact
    ? normalize(current) === normalize(href)
    : current === href || current.startsWith(href + "/");
  const IconComp = typeof icon === "string" ? ICON_LOOKUP_MAP[icon] : icon;

  // Check if any submenu item is active
  const isSubmenuActive =
    submenuItems?.some(
      (item) => current === item.href || current.startsWith(item.href + "/"),
    ) || false;

  if (hasDropdown && submenuItems) {
    return (
      <li class="dropdown dropdown-hover dropdown-right sidebar-dropdown">
        <div
          tabIndex={0}
          class={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-primary/10 hover:text-primary cursor-pointer ${
            isActive || isSubmenuActive
              ? "bg-primary/10 text-primary font-semibold"
              : ""
          }`}
        >
          {IconComp && (
            <span
              class={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${
                isActive || isSubmenuActive ? "bg-primary/15" : "bg-base-200"
              }`}
            >
              <IconComp class="w-4 h-4" />
            </span>
          )}
          <span class="truncate flex-1">{label}</span>
          <svg
            class="w-3 h-3 text-base-content/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
        <div class="dropdown-content z-[1000] ml-2">
          <div class="bg-base-100/90 backdrop-blur-lg border border-base-200/60 rounded-xl shadow-2xl p-1 w-[320px]">
            <div class="p-3">
              <div class="mb-3">
                <h3 class="font-semibold text-sm text-primary flex items-center gap-2">
                  {IconComp && <IconComp class="w-4 h-4" />}
                  {label}
                </h3>
                <p class="text-xs text-base-content/60 mt-1">
                  Akses cepat menu kader
                </p>
              </div>
              <div class="space-y-1">
                {submenuItems.map((subItem) => {
                  const SubIcon =
                    typeof subItem.icon === "string"
                      ? ICON_LOOKUP_MAP[subItem.icon]
                      : subItem.icon;
                  const isSubActive =
                    current === subItem.href ||
                    current.startsWith(subItem.href + "/");

                  return (
                    <a
                      key={subItem.href}
                      href={subItem.href}
                      class={`flex items-start gap-3 p-2 rounded-lg hover:bg-primary/10 transition-all duration-200 group ${
                        isSubActive
                          ? "bg-primary/15 text-primary border border-primary/20"
                          : "text-base-content/80 hover:text-primary"
                      }`}
                    >
                      <div class="flex-shrink-0 mt-0.5">
                        {SubIcon && (
                          <SubIcon class="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-sm group-hover:text-primary transition-colors truncate">
                          {subItem.label}
                        </div>
                        {subItem.description && (
                          <div class="text-xs text-base-content/60 mt-0.5 leading-relaxed">
                            {subItem.description}
                          </div>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li>
      <a
        href={href}
        class={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-primary/10 hover:text-primary ${
          isActive ? "bg-primary/10 text-primary font-semibold" : ""
        }`}
      >
        {IconComp && (
          <span
            class={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${isActive ? "bg-primary/15" : "bg-base-200"}`}
          >
            <IconComp class="w-4 h-4" />
          </span>
        )}
        <span class="truncate">{label}</span>
      </a>
    </li>
  );
});
