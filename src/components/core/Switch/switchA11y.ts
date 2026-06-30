import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";

export function switchInputId(idProp: string | undefined, autoId: string, fieldId?: string): string {
  return idProp ?? fieldId ?? `switch-${autoId}`;
}

export function switchHintId(switchId: string): string {
  return fieldHintId(switchId);
}

export function switchErrorId(switchId: string): string {
  return fieldErrorId(switchId);
}

export function switchFallbackAriaLabel(hasTextColumn: boolean): string | undefined {
  return hasTextColumn ? undefined : "Switch";
}
