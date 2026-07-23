import { DEFAULT_BURNE_LABELS } from "@/theme/burneLabels";

export function closeButtonAriaLabel(
  ariaLabel?: string,
  closeLabel: string = DEFAULT_BURNE_LABELS.close,
): string {
  return ariaLabel ?? closeLabel;
}
