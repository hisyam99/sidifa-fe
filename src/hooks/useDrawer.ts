import { $ } from "@builder.io/qwik";

/**
 * Custom hook for managing drawer state
 * Provides functions to open/close drawers programmatically
 */
export const useDrawer = () => {
  /**
   * Close a drawer by its ID
   * @param drawerId - The ID of the drawer to close
   */
  const closeDrawer = $(async (drawerId: string) => {
    if (typeof window !== "undefined") {
      const drawerInput = document.getElementById(drawerId) as HTMLInputElement;
      if (drawerInput) {
        drawerInput.checked = false;
      }
    }
  });

  /**
   * Open a drawer by its ID
   * @param drawerId - The ID of the drawer to open
   */
  const openDrawer = $(async (drawerId: string) => {
    if (typeof window !== "undefined") {
      const drawerInput = document.getElementById(drawerId) as HTMLInputElement;
      if (drawerInput) {
        drawerInput.checked = true;
      }
    }
  });

  /**
   * Toggle a drawer by its ID
   * @param drawerId - The ID of the drawer to toggle
   */
  const toggleDrawer = $(async (drawerId: string) => {
    if (typeof window !== "undefined") {
      const drawerInput = document.getElementById(drawerId) as HTMLInputElement;
      if (drawerInput) {
        drawerInput.checked = !drawerInput.checked;
      }
    }
  });

  /**
   * Check if a drawer is currently open
   * @param drawerId - The ID of the drawer to check
   * @returns boolean indicating if drawer is open
   */
  const isDrawerOpen = $(async (drawerId: string): Promise<boolean> => {
    if (typeof window !== "undefined") {
      const drawerInput = document.getElementById(drawerId) as HTMLInputElement;
      return drawerInput ? drawerInput.checked : false;
    }
    return false;
  });

  return {
    closeDrawer,
    openDrawer,
    toggleDrawer,
    isDrawerOpen,
  };
};
