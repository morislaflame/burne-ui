import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      /** Иначе `text-large` попадает в группу цвета и схлопывается с `text-foreground`. */
      text: [
        "small",
        "mid",
        "tools",
        "accent-header",
        "header-1",
        "header-2",
        "large",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
