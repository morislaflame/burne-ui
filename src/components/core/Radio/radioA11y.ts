import type { InputHTMLAttributes } from "react";

import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";

export function radioInputId(idProp: string | undefined, autoId: string): string {
  return idProp ?? `radio-${autoId}`;
}

export function radioHintId(inputId: string): string {
  return fieldHintId(inputId);
}

export function radioErrorId(inputId: string): string {
  return fieldErrorId(inputId);
}

export function radioInputAriaLabel(
  value: InputHTMLAttributes<HTMLInputElement>["value"] | undefined,
): string {
  return value != null ? String(value) : "Option";
}
