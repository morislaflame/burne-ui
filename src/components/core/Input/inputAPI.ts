import type { ClassValue } from "clsx";

import type { ButtonSize } from "@/components/core/Button";
import { cn } from "@/utils/cn";

import type { InputSize } from "./inputTypes";

export function mergeInputSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function inputSizeFromButtonSize(buttonSize: ButtonSize): InputSize {
  return buttonSize;
}

export function assignInputFiles(input: HTMLInputElement, files: File[]) {
  const dt = new DataTransfer();
  files.forEach((f) => dt.items.add(f));
  input.files = dt.files;
}
