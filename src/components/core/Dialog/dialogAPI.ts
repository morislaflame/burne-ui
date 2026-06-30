import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

export function mergeDialogSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}
