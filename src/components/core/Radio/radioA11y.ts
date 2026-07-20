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

/**
 * Fallback accessible name when there is no visible label (icon-only / control-only).
 * With a visible label (wrapping `<label>` text or `Radio.Label`), return `undefined`
 * so `aria-label` does not override Label in Name (WCAG 2.5.3).
 */
export function radioInputAriaLabel(
  value: InputHTMLAttributes<HTMLInputElement>["value"] | undefined,
  hasLabel: boolean,
): string | undefined {
  if (hasLabel) return undefined;
  return value != null ? String(value) : "Option";
}
