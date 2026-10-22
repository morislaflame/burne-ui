export const SKIP_TYPES: Set<string>;
export const SITE_SLUG_OVERRIDES: Record<string, string>;

export function stripComments(source: string): string;
export function extractObjectBody(source: string, name: string): string | null;
export function extractSlotKeys(body: string): string[];
export function walkSync(dir: string, acc?: string[]): string[];
export function componentName(typeName: string): string;
export function siteSlug(typeName: string): string;

export function loadClassNamesTypes(
  srcRoot: string,
  options?: { skip?: Set<string> },
): { types: Map<string, string[]>; aliases: Map<string, string> };

export function loadMotionSlotKeys(srcRoot: string): Map<string, string[]>;
