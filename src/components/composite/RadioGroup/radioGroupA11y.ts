/**
 * RadioGroup uses native `<fieldset>` + `<legend>` for the accessible name.
 * Hint/error ids feed `Field.Set` → `aria-describedby`.
 */
export const RADIO_GROUP_USES_NATIVE_FIELDSET = true as const;

export function radioGroupName(nameProp: string | undefined, autoId: string): string {
  return nameProp ?? `radio-group-${autoId}`;
}
