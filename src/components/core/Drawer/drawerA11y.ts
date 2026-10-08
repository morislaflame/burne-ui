import { DEFAULT_BURNE_LABELS, type BurneLabels } from "@/theme/burneLabels";
 
import type { DrawerPlacement } from "./drawerTypes";
 
export function drawerHandleAriaLabel(
  _placement: DrawerPlacement,
  labels: Pick<BurneLabels, "close"> = DEFAULT_BURNE_LABELS,
): string {
  return labels.close;
}
 
/** Enter / Space on Handle = close (least destructive dismiss). */
export function isDrawerHandleActivateKey(key: string): boolean {
  return key === "Enter" || key === " ";
}
 