import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import {
  burneRadiusScale,
  burneSpacingScale,
  burneTextScale,
} from "@/tokens/config";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [...burneSpacingScale],
      radius: [...burneRadiusScale],
      text: [...burneTextScale],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
