import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { DEFAULT_BURNE_LABELS } from "@/theme/burneLabels";

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

export function selectTriggerAriaLabel(
  open: boolean,
  labels: { openList: string; closeList: string } = {
    openList: DEFAULT_BURNE_LABELS.openList,
    closeList: DEFAULT_BURNE_LABELS.closeList,
  },
): string {
  return open ? labels.closeList : labels.openList;
}
