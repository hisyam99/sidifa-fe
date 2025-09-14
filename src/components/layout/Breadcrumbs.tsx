import { component$ } from "@qwik.dev/core";
import { useLocation, Link } from "@qwik.dev/router";
import { getPrettyBreadcrumbName } from "~/utils/breadcrumb-utils";
import { useAuth } from "~/hooks";

export const Breadcrumbs = component$(() => {
  const location = useLocation();
  const { user } = useAuth();
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
            // Jangan link untuk segmen 'detail' dan segmen setelahnya (biasanya ID)
            const isDetailOrAfter =
              segments[idx - 1] === "detail" || seg === "detail";
            if (isLast) {
              return (
                <li key={seg} class="font-semibold text-primary">
                  {getPrettyBreadcrumbName(seg)}
                </li>
              );
            }
            if (isDetailOrAfter) {
              return <li key={seg}>{getPrettyBreadcrumbName(seg)}</li>;
            }
            return (
              <li key={seg}>
                <Link href={href}>{getPrettyBreadcrumbName(seg)}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});
