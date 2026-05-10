import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Сборка `className` с разрешением конфликтов Tailwind (последний выигрывает). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
