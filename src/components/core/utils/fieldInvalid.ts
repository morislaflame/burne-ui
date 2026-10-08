import { useFieldInvalid } from "@/components/core/Field/fieldContext";

/**
 * Form binding wins when it reports invalid.
 * Otherwise an explicit `invalid`, otherwise a present `error`
 * (`invalid ?? (error != null)`), otherwise an ancestor Field.
 */
export function resolveFieldInvalid({
  invalid,
  error,
  formInvalid,
  inheritedInvalid,
}: {
  invalid?: boolean;
  error?: unknown;
  formInvalid?: boolean;
  inheritedInvalid?: boolean;
}): boolean {
  if (formInvalid === true) return true;
  if (invalid !== undefined) return invalid;
  if (error != null) return true;
  return inheritedInvalid === true;
}

/** `aria-invalid` is omitted when the control is valid. */
export function ariaInvalidValue(isInvalid: boolean): true | undefined {
  return isInvalid ? true : undefined;
}

/** Empty `data-invalid` on the control root. Omitted when valid. */
export function dataInvalidValue(isInvalid: boolean): "" | undefined {
  return isInvalid ? "" : undefined;
}

/** Resolve invalid at a control: prop, error, form binding, ancestor Field. */
export function useResolvedFieldInvalid({
  invalid,
  errorConnected = false,
  formInvalid = false,
}: {
  invalid?: boolean;
  errorConnected?: boolean;
  formInvalid?: boolean;
}): boolean {
  const inheritedInvalid = useFieldInvalid();
  return resolveFieldInvalid({
    invalid,
    error: errorConnected ? true : undefined,
    formInvalid,
    inheritedInvalid,
  });
}

/** Invalid state paints danger. `status` alone does not imply invalid. */
export function visualStatusForInvalid<T extends string>(
  status: T | undefined,
  isInvalid: boolean,
  fallback: T): T {
  if (isInvalid) return "danger" as T;
  return status ?? fallback;
}
