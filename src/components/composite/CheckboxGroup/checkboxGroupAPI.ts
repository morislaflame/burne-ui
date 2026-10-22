/** Next `values` after one option is checked or cleared. Order of the rest is kept. */
export function checkboxGroupNextValues(
  values: readonly string[],
  value: string,
  checked: boolean,
): string[] {
  const has = values.includes(value);
  if (checked) return has ? [...values] : [...values, value];
  return has ? values.filter((item) => item !== value) : [...values];
}

export function checkboxGroupValuesEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}
