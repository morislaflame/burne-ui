import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";

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

export function comboBoxTriggerAriaLabel(open: boolean): string {
  return open ? "Close list" : "Open list";
}
