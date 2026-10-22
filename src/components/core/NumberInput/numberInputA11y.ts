import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";

export function numberInputLabelId(inputId: string): string {
  return `${inputId}-label`;
}

export function numberInputFieldIds(inputId: string) {
  return {
    hintId: fieldHintId(inputId),
    errorId: fieldErrorId(inputId),
    labelId: numberInputLabelId(inputId),
  };
}

export function numberInputDescribedBy({
  hintConnected,
  errorConnected,
  hintId,
  errorId,
}: {
  hintConnected: boolean;
  errorConnected: boolean;
  hintId: string;
  errorId: string;
}): string | undefined {
  return joinFieldDescribedBy(
    hintConnected ? hintId : undefined,
    errorConnected ? errorId : undefined,
  );
}
