import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
 
import { burneRadiusScale, burneSpacingScale, burneTextScale } from "@/tokens/config";
 
const twMerge = extendTailwindMerge<
  "avatar-size" | "selection-indicator" | "focus-ring" | "icon-slot"
>({
  extend: {
    theme: {
      spacing: [...burneSpacingScale],
      radius: [...burneRadiusScale],
      text: [...burneTextScale],
    },
    classGroups: {
      "border-w": [
        "border-token",
        "border-token-outline",
        "border-token-primary",
        "border-token-danger",
        "border-token-success",
        "border-token-info",
        "border-token-warning",
      ],
      shadow: [
        "shadow-token-small",
        "shadow-token-base",
        "shadow-token-mid",
        "shadow-token-large",
        "shadow-token-xlarge",
      ],
      "min-h": [
        "min-h-control-xsmall",
        "min-h-control-small",
        "min-h-control-base",
        "min-h-control-mid",
        "min-h-control-large",
      ],
      z: [
        "z-dialog",
        "z-dropdown",
        "z-dropdown-sub",
        "z-popover",
        "z-toast",
        "z-tooltip",
      ],
      "avatar-size": [
        "avatar-size-small",
        "avatar-size-base",
        "avatar-size-mid",
        "avatar-size-large",
      ],
      "selection-indicator": [
        "selection-indicator-xsmall",
        "selection-indicator-small",
        "selection-indicator-base",
        "selection-indicator-mid",
        "selection-indicator-large",
      ],
      "focus-ring": ["focus-ring", "focus-ring-inset"],
      "icon-slot": [
        "icon-slot-xsmall",
        "icon-slot-small",
        "icon-slot-base",
        "icon-slot-mid",
        "icon-slot-large",
        "icon-slot-xlarge",
        "icon-slot-2xlarge",
        "icon-slot-3xlarge",
        "icon-slot-16",
        "icon-slot-24",
      ],
    },
  },
});
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
 