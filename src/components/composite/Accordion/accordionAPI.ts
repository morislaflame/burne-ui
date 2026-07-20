export function accordionDefaultOpenId(
  defaultOpenId: string | null | undefined,
  defaultOpenIndex: number | null | undefined,
): string | null {
  if (defaultOpenId != null) return defaultOpenId;
  if (defaultOpenIndex != null) return String(defaultOpenIndex);
  return null;
}
