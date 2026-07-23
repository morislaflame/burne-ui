import type { DrawerPlacement } from "./drawerTypes";

export const DRAWER_CLOSE_DEFAULT_ARIA_LABEL = "Close";

export function drawerHandleAriaLabel(placement: DrawerPlacement): string {
  switch (placement) {
    case "bottom":
      return "Drag down to close";
    case "top":
      return "Drag up to close";
    case "left":
      return "Drag left to close";
    case "right":
      return "Drag right to close";
  }
}

/** Enter / Space on Handle = close (least destructive dismiss). */
export function isDrawerHandleActivateKey(key: string): boolean {
  return key === "Enter" || key === " ";
}
