import { DEFAULT_BURNE_LABELS, type BurneLabels } from "@/theme/burneLabels";

import type { DrawerPlacement } from "./drawerTypes";

export function drawerHandleAriaLabel(
  placement: DrawerPlacement,
  labels: Pick<
    BurneLabels,
    | "drawerDragDownToClose"
    | "drawerDragUpToClose"
    | "drawerDragLeftToClose"
    | "drawerDragRightToClose"
  > = DEFAULT_BURNE_LABELS,
): string {
  switch (placement) {
    case "bottom":
      return labels.drawerDragDownToClose;
    case "top":
      return labels.drawerDragUpToClose;
    case "left":
      return labels.drawerDragLeftToClose;
    case "right":
      return labels.drawerDragRightToClose;
  }
}

/** Enter / Space on Handle = close (least destructive dismiss). */
export function isDrawerHandleActivateKey(key: string): boolean {
  return key === "Enter" || key === " ";
}
