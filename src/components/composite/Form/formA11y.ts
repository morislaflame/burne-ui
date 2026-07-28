import { focusElement } from "@/components/core/utils/focusElement";

export function formFieldAriaInvalid(error?: string): boolean | undefined {
  return error ? true : undefined;
}

export function formRootDescribedBy({
  descriptionId,
  errorSummaryId,
  hasErrors,
}: {
  descriptionId?: string;
  errorSummaryId?: string;
  hasErrors: boolean;
}): string | undefined {
  const ids = [descriptionId, hasErrors ? errorSummaryId : undefined].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function formRootLabelledBy(titleId?: string): string | undefined {
  return titleId;
}

export function buildFormErrorSummaryMessage(errorCount: number): string {
  if (errorCount <= 0) return "";
  if (errorCount === 1) return "Fix the error in the form";
  return `Fix ${errorCount} errors in the form`;
}

export function buildFormSuccessAnnounceMessage(): string {
  return "Form submitted successfully";
}

export function focusFirstFormInvalidField(
  refs: Map<string, HTMLElement>,
  errors: Record<string, string>,
): void {
  const firstName = Object.keys(errors)[0];
  if (firstName == null) return;
  const node = refs.get(firstName);
  focusElement(node);
}
