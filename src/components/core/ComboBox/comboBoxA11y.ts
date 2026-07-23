import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import type { InputStatus } from "@/components/core/Input";
import { DEFAULT_BURNE_LABELS } from "@/theme/burneLabels";

export function comboBoxLabelId(comboBoxId: string): string {
  return `${comboBoxId}-label`;
}

export function comboBoxListId(comboBoxId: string): string {
  return `${comboBoxId}-listbox`;
}

export function comboBoxFieldIds(comboBoxId: string) {
  return {
    hintId: fieldHintId(comboBoxId),
    errorId: fieldErrorId(comboBoxId),
    labelId: comboBoxLabelId(comboBoxId),
    listId: comboBoxListId(comboBoxId),
  };
}

export function comboBoxActiveOptionId(
  listId: string,
  open: boolean,
  activeValue: string | null,
): string | undefined {
  return open && activeValue ? `${listId}-opt-${activeValue}` : undefined;
}

export function comboBoxTriggerAriaLabel(
  open: boolean,
  labels: { openList: string; closeList: string } = {
    openList: DEFAULT_BURNE_LABELS.openList,
    closeList: DEFAULT_BURNE_LABELS.closeList,
  },
): string {
  return open ? labels.closeList : labels.openList;
}

export function comboBoxResolveHintStatus(
  status: Exclude<InputStatus, "danger"> | "default" | undefined,
  fieldStatus: InputStatus,
): Exclude<InputStatus, "danger"> | "default" {
  if (status) return status;
  if (fieldStatus === "danger") return "default";
  if (fieldStatus === "default") return "default";
  return fieldStatus;
}
