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
  if (errorCount === 1) return "Исправьте ошибку в форме";
  return `Исправьте ${errorCount} ошибки в форме`;
}

export function buildFormSuccessAnnounceMessage(): string {
  return "Форма успешно отправлена";
}

export function focusFirstFormInvalidField(
  refs: Map<string, HTMLElement>,
  errors: Record<string, string>,
): void {
  const firstName = Object.keys(errors)[0];
  if (firstName == null) return;
  const node = refs.get(firstName);
  node?.focus();
}
