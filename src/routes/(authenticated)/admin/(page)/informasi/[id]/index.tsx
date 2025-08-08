import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

export const useRedirect = routeLoader$(({ params, redirect }) => {
  throw redirect(301, `/admin/informasi/detail/${params.id}`);
});

export default component$(() => {
  return null;
}); 