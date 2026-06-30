import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

export function mergeCloseButtonSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}
