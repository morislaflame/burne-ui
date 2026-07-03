import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";

export function selectLabelId(selectId: string): string {
  return `${selectId}-label`;
}

export function selectListId(selectId: string): string {
  return `${selectId}-listbox`;
}

export function selectFieldIds(selectId: string) {
  return {
    hintId: fieldHintId(selectId),
    errorId: fieldErrorId(selectId),
    labelId: selectLabelId(selectId),
    listId: selectListId(selectId),
  };
}

export function selectActiveOptionId(
  listId: string,
  open: boolean,
  activeValue: string | null,
): string | undefined {
  return open && activeValue ? `${listId}-opt-${activeValue}` : undefined;
}

export function selectTriggerAriaLabel(open: boolean): string {
  return open ? "Close list" : "Open list";
}
