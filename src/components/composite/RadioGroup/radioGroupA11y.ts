/**
 * RadioGroup uses native `<fieldset role="radiogroup">` + `<legend>`.
 * `aria-readonly` lives on the group: ARIA 1.2 does not allow it on `radio`.
 * Hint/error ids feed `Field.Set` → `aria-describedby`.
 */
export const RADIO_GROUP_USES_NATIVE_FIELDSET = true as const;
 
export function radioGroupName(nameProp: string | undefined, autoId: string): string {
  return nameProp ?? `radio-group-${autoId}`;
}
 