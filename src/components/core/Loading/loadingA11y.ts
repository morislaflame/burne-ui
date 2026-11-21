import { DEFAULT_BURNE_LABELS } from "@/theme/burneLabels";

export const LOADING_DEFAULT_LABEL = DEFAULT_BURNE_LABELS.loading;
 
export function loadingStatusProps(label: string = LOADING_DEFAULT_LABEL) {
  return {
    role: "status" as const,
    "aria-live": "polite" as const,
    "aria-label": label,
  };
}
 
/** Visual spinner / dots — announce via root `aria-label` only. */
export function loadingVisualA11yProps() {
  return { "aria-hidden": true as const };
}
 