import { component$, useContext } from "@builder.io/qwik";
import { useLocation, Link } from "@builder.io/qwik-city";
import { getPrettyBreadcrumbName, isIdSegment } from "~/utils/breadcrumb-utils";
import { useAuth } from "~/hooks";
import { BreadcrumbContext } from "~/contexts/breadcrumb.context";

export const Breadcrumbs = component$(() => {
  const location = useLocation();
  const { user } = useAuth();
  const overrides = useContext(BreadcrumbContext);
  const path = location.url.pathname;
  const segments = path.split("/").filter(Boolean);

  let href = "";

  // Tentukan link "Home" sesuai role user
  let homeHref = "/dashboard";
  const role = user.value?.role;
  if (role === "admin") {
    homeHref = "/admin";
  } else if (role === "kader" || role === "posyandu") {
    homeHref = "/kader";
  } else if (role === "psikolog") {
    homeHref = "/psikolog";
  }

  return (
    <div class="mb-4">
      <div class="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href={homeHref}>Home</Link>
          </li>
          {segments.map((seg, idx) => {
            href += "/" + seg;
            const isLast = idx === segments.length - 1;

            // Check if this segment has a name override (e.g. UUID → "Posyandu Melati")
            const resolvedName = overrides.value[seg];

            // If it's a UUID/ID with no override, skip rendering it in breadcrumbs
            if (isIdSegment(seg) && !resolvedName) {
              return null;
            }

            const displayName = resolvedName || getPrettyBreadcrumbName(seg);

            // Jangan link untuk segmen 'detail' dan segmen setelahnya (biasanya ID)
            const isDetailOrAfter =
              segments[idx - 1] === "detail" || seg === "detail";
            if (isLast) {
              return (
                <li key={href} class="font-semibold text-primary">
                  {displayName}
                </li>
              );
            }
            if (isDetailOrAfter) {
              return <li key={href}>{displayName}</li>;
            }
            return (
              <li key={href}>
                <Link href={href}>{displayName}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});
