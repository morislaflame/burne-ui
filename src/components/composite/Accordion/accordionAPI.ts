import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

export function mergeAccordionSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function accordionDefaultOpenId(
  defaultOpenId: string | null | undefined,
  defaultOpenIndex: number | null | undefined,
): string | null {
  if (defaultOpenId != null) return defaultOpenId;
  if (defaultOpenIndex != null) return String(defaultOpenIndex);
  return null;
}
