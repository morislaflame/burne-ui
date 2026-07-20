import type { FormFieldRules, FormValues } from "./formTypes";

export function countFormErrors(errors: Record<string, string>): number {
  return Object.keys(errors).length;
}

export function formErrorEntries(errors: Record<string, string>): Array<[string, string]> {
  return Object.entries(errors);
}

export function setFormValueAtPath(
  values: FormValues,
  path: string,
  value: unknown,
): FormValues {
  if (!path.includes(".")) {
    return { ...values, [path]: value };
  }

  const keys = path.split(".");
  const root = { ...values };
  let cursor: Record<string, unknown> = root;

  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i]!;
    const next = cursor[key];
    const branch =
      next != null && typeof next === "object" && !Array.isArray(next)
        ? { ...(next as Record<string, unknown>) }
        : {};
    cursor[key] = branch;
    cursor = branch;
  }

  cursor[keys[keys.length - 1]!] = value;
  return root;
}

export function isFormValueEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "boolean") return false;
  return false;
}

export function validateFormFieldRules(
  value: unknown,
  values: FormValues,
  rules?: FormFieldRules,
): string | undefined {
  if (rules == null) return undefined;

  if (rules.required) {
    const message = typeof rules.required === "string" ? rules.required : "Required field";
    if (typeof value === "boolean") {
      if (!value) return message;
    } else if (isFormValueEmpty(value)) {
      return message;
    }
  }

  if (typeof value === "string") {
    if (rules.minLength && value.length < rules.minLength.value) {
      return rules.minLength.message;
    }
    if (rules.maxLength && value.length > rules.maxLength.value) {
      return rules.maxLength.message;
    }
    if (rules.pattern && !rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }
  }

  if (rules.validate) {
    return rules.validate(value, values);
  }

  return undefined;
}

export function mergeFormFieldRules(
  ...parts: Array<FormFieldRules | undefined>
): FormFieldRules | undefined {
  const merged: FormFieldRules = {};
  for (const part of parts) {
    if (part == null) continue;
    Object.assign(merged, part);
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}

export function readControlValueFromEvent(event: unknown, type?: string): unknown {
  if (event == null || typeof event !== "object" || !("target" in event)) {
    return event;
  }

  const target = (event as { target: EventTarget | null }).target;
  if (!(target instanceof HTMLInputElement)) return undefined;

  if (type === "checkbox") return target.checked;
  if (type === "number") return target.value === "" ? undefined : Number(target.value);
  return target.value;
}
