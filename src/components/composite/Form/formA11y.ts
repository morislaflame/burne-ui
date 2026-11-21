import { focusElement } from "@/components/core/utils/focusElement";
import { DEFAULT_BURNE_LABELS, formatBurneLabel, type BurneLabels } from "@/theme/burneLabels";
 
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
 
export function buildFormErrorSummaryMessage(
  errorCount: number,
  labels: Pick<BurneLabels, "formErrorOne" | "formErrorMany"> = DEFAULT_BURNE_LABELS,
): string {
  if (errorCount <= 0) return "";
  if (errorCount === 1) return labels.formErrorOne;
  return formatBurneLabel(labels.formErrorMany, { count: errorCount });
}

export function buildFormSuccessAnnounceMessage(
  labels: Pick<BurneLabels, "formSubmitted"> = DEFAULT_BURNE_LABELS,
): string {
  return labels.formSubmitted;
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
 