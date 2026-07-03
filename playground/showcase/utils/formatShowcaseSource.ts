export type FormatShowcaseSourceOptions = {
  /**
   * Imports only + JSX from `return`, without `export function`.
   * By default, we show the entire file - it’s more convenient to copy it into the project.
   */
  usageOnly?: boolean;
};

/**
 * Normalizes the source demo-file for the “Show Code” panel».
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
