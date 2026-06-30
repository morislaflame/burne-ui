import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

export function mergeTextAreaSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}
