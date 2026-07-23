import { DEFAULT_BURNE_LABELS } from "@/theme/burneLabels";

export function inputPasswordShowAriaLabel(
  label: string = DEFAULT_BURNE_LABELS.showPassword,
): string {
  return label;
}

export function inputPasswordHideAriaLabel(
  label: string = DEFAULT_BURNE_LABELS.hidePassword,
): string {
  return label;
}

export function inputFileRemoveAriaLabel(
  label: string = DEFAULT_BURNE_LABELS.removeFile,
): string {
  return label;
}
