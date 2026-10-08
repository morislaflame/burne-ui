import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";

import type { PinInputType } from "./pinInputTypes";

export function pinInputLabelId(inputId: string): string {
  return `${inputId}-label`;
}

export function pinInputFieldIds(inputId: string) {
  return {
    hintId: fieldHintId(inputId),
    errorId: fieldErrorId(inputId),
    labelId: pinInputLabelId(inputId),
  };
}

export function pinInputDescribedBy({
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

export function pinInputCellLabel(index: number, length: number, type: PinInputType): string {
  const kind = type === "number" ? "Digit" : "Character";
  return `${kind} ${index + 1} of ${length}`;
}
