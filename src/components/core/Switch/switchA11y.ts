import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { DEFAULT_BURNE_LABELS } from "@/theme/burneLabels";
 
export function switchInputId(idProp: string | undefined, autoId: string, fieldId?: string): string {
  return idProp ?? fieldId ?? `switch-${autoId}`;
}
 
export function switchHintId(switchId: string): string {
  return fieldHintId(switchId);
}
 
export function switchErrorId(switchId: string): string {
  return fieldErrorId(switchId);
}
 
export function switchLabelId(switchId: string): string {
  return `${switchId}-label`;
}
 
export function switchFallbackAriaLabel(
  hasTextColumn: boolean,
  unnamed: string = DEFAULT_BURNE_LABELS.switch,
): string | undefined {
  return hasTextColumn ? undefined : unnamed;
}
 