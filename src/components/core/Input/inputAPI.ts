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
 
const IMAGE_FILE_EXTENSIONS = new Set([
  "avif",
  "bmp",
  "gif",
  "ico",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "webp",
]);
 
/**
 * Last path segment after `.`. `"my photo.jpg"` → `"jpg"`.
 * Empty when there is no real extension (no dot, trailing dot, or only a leading dot).
 * Do not use `name.split(".").pop()` — a name without `.` returns the whole name.
 */
export function fileNameExtension(fileName: string): string {
  const base = fileName.trim().split(/[/\\]/).pop() ?? "";
  const lastDot = base.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === base.length - 1) return "";
  return base.slice(lastDot + 1).toLowerCase();
}
 
/** MIME `image/*`, or extension fallback when `file.type` is empty. */
export function isImageFile(file: Pick<File, "name" | "type">): boolean {
  if (file.type.startsWith("image/")) return true;
  if (file.type) return false;
  return IMAGE_FILE_EXTENSIONS.has(fileNameExtension(file.name));
}
 