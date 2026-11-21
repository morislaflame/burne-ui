import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

import type { FormFieldRules, FormValues } from "./formTypes";
 
export function countFormErrors(errors: Record<string, string>): number {
  let count = 0;
  for (const key of Object.keys(errors)) {
    if (errors[key]) count += 1;
  }
  return count;
}

export function formErrorEntries(errors: Record<string, string>): Array<[string, string]> {
  return Object.entries(errors).filter(([, message]) => Boolean(message));
}

export function cleanFormResolverErrors(
  errors?: Partial<Record<string, string>>,
): Record<string, string> {
  if (!errors) return {};
  const cleaned: Record<string, string> = {};
  for (const [key, message] of Object.entries(errors)) {
    if (typeof message === "string" && message.length > 0) {
      cleaned[key] = message;
    }
  }
  return cleaned;
}

export function getFormValueAtPath(values: FormValues, path: string): unknown {
  if (!path.includes(".")) return values[path];
  const parts = path.split(".");
  return parts.reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, values);
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
 
/** Puts the form's live announcement on the user's `Form.Announce` when it has no message. */
export function withFormAnnounceMessage(children: ReactNode, announce: string | null): ReactNode {
  if (!announce) return children;
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const name = (child.type as { displayName?: string }).displayName;
    const props = child.props as { children?: ReactNode; message?: string | null };
    if (name === "Form.Announce") {
      if (props.message != null && props.message !== "") return child;
      return cloneElement(child as ReactElement<{ message?: string | null }>, {
        message: announce,
      });
    }
    if (props.children == null) return child;
    return cloneElement(child, {}, withFormAnnounceMessage(props.children, announce));
  });
}

export function readControlValueFromEvent(event: unknown, type?: string): unknown {
  if (event == null || typeof event !== "object" || !("target" in event)) {
    return event;
  }
 
  const target = (event as { target: EventTarget | null }).target;
  if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
    return target.value;
  }
  if (!(target instanceof HTMLInputElement)) return undefined;
 
  if (type === "checkbox") return target.checked;
  if (type === "number") return target.value === "" ? undefined : Number(target.value);
  return target.value;
}
 