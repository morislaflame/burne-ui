import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";

export function datePickerLabelId(triggerId: string): string {
  return `${triggerId}-label`;
}

export function datePickerPanelId(triggerId: string): string {
  return `${triggerId}-calendar`;
}

export function datePickerFieldIds(triggerId: string) {
  return {
    hintId: fieldHintId(triggerId),
    errorId: fieldErrorId(triggerId),
    labelId: datePickerLabelId(triggerId),
    panelId: datePickerPanelId(triggerId),
  };
}

export function datePickerDescribedBy({
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
