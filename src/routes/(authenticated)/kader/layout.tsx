import { component$, Slot } from "@builder.io/qwik";
import { Breadcrumbs, NavigationKader } from "~/components/layout";
import { RoleProtectedContent } from "~/components/common/RoleProtectedContent";
import { AnimatedPageContainer } from "~/components/layout/AnimatedPageContainer";

export default component$(() => {
  // Track navigation for global loading overlay
  // const location = useLocation();
  // const isNavigating = useSignal(false);
  // const prevPath = useSignal(location.url.pathname);

  // useTask$(({ track }) => {
  //   const currentPath = track(() => location.url.pathname);
  //   if (prevPath.value !== currentPath) {
  //     isNavigating.value = true;
  //     setTimeout(() => {
  //       isNavigating.value = false;
  //       prevPath.value = currentPath;
  //     }, 350);
  //   }
  // });

  return (
    <>
      <NavigationKader />
      <div class="min-h-screen">
        <RoleProtectedContent allowedRoles={["kader", "admin"]}>
          <div class="relative">
            {/* {isNavigating.value && <Spinner overlay class="fixed" />} */}
            <main class="container mx-auto p-4 md:py-8 transition-all duration-300">
              <Breadcrumbs />
              <AnimatedPageContainer>
                <Slot />
              </AnimatedPageContainer>
            </main>
          </div>
        </RoleProtectedContent>
      </div>
    </>
  );
});
