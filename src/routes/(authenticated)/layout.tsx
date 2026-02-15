import {
  component$,
  Slot,
  useSignal,
  useContextProvider,
} from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import {
  BreadcrumbContext,
  type BreadcrumbOverrides,
} from "~/contexts/breadcrumb.context";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    public: false,
    maxAge: 0,
    sMaxAge: 0,
    staleWhileRevalidate: 0,
  });
};

export default component$(() => {
  const breadcrumbOverrides = useSignal<BreadcrumbOverrides>({});
  useContextProvider(BreadcrumbContext, breadcrumbOverrides);
  return <Slot />;
});
