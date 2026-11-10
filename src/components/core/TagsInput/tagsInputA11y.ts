import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";

export function tagsInputLabelId(inputId: string): string {
  return `${inputId}-label`;
}

export function tagsInputFieldIds(inputId: string) {
  return {
    hintId: fieldHintId(inputId),
    errorId: fieldErrorId(inputId),
    labelId: tagsInputLabelId(inputId),
  };
}

export function tagsInputDescribedBy({
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

export function tagsInputRemoveLabel(value: string): string {
  return `Remove ${value}`;
}
