import { component$ } from "@builder.io/qwik";
import { Spinner } from "~/components/ui/Spinner";

export default component$(() => {
  // This page will never be rendered, as the layout will redirect based on user role.
  // Optionally, you can show a loading spinner or message here.
  return <Spinner overlay={true} />;
});
