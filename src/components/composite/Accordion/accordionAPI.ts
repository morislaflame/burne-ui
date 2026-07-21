export function accordionDefaultValue(
  defaultValue: string | null | undefined,
  defaultOpenIndex: number | null | undefined,
): string | null {
  if (defaultValue != null) return defaultValue;
  if (defaultOpenIndex != null) return String(defaultOpenIndex);
  return null;
}
