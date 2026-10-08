import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";

export const NUMBER_INPUT_DECREASE_LABEL = "Decrease";
export const NUMBER_INPUT_INCREASE_LABEL = "Increase";

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
