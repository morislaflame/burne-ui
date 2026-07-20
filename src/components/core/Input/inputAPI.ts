import type { ButtonSize } from "@/components/core/Button";
import type { InputSize } from "./inputTypes";

export function inputSizeFromButtonSize(buttonSize: ButtonSize): InputSize {
  return buttonSize;
}

export function assignInputFiles(input: HTMLInputElement, files: File[]) {
  const dt = new DataTransfer();
  files.forEach((f) => dt.items.add(f));
  input.files = dt.files;
}
