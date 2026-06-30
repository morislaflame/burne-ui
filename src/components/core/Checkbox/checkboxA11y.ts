import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";

export function checkboxInputId(idProp: string | undefined, autoId: string): string {
  return idProp ?? `checkbox-${autoId}`;
}

export function checkboxHintId(inputId: string): string {
  return fieldHintId(inputId);
}

export function checkboxErrorId(inputId: string): string {
  return fieldErrorId(inputId);
}

export function checkboxLabelId(inputId: string): string {
  return `${inputId}-label`;
}
