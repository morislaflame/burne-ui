export type FormatShowcaseSourceOptions = {
  /**
   * Только импорты + JSX из `return`, без `export function`.
   * По умолчанию показываем весь файл — удобнее копировать в проект.
   */
  usageOnly?: boolean;
};

/**
 * Нормализует исходник demo-файла для панели «Показать код».
 */
export function formatShowcaseSource(
  raw: string,
  options?: FormatShowcaseSourceOptions,
): string {
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  if (!options?.usageOnly) return normalized;

  const fnMatch = normalized.match(/export\s+function\s+\w+\s*\([^)]*\)\s*\{([\s\S]*)\}\s*$/);
  if (!fnMatch) return normalized;

  const body = fnMatch[1]!.trim();
  const returnMatch = body.match(/^([\s\S]*?)return\s+([\s\S]+);?\s*$/);
  if (!returnMatch) return normalized;

  const hooks = returnMatch[1]!.trim();
  const jsx = returnMatch[2]!.trim();
  const imports = normalized.match(/^(import[\s\S]*?)(?=\n\nexport|\nexport)/)?.[0]?.trim();

  const parts = [imports, hooks, jsx].filter(Boolean);
  return parts.join("\n\n");
}
