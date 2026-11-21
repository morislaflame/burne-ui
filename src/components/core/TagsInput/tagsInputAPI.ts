/** Split a draft on comma or newline. The tail stays in the field until Enter or blur. */
export function tagsInputPieces(raw: string): { committed: string[]; rest: string } {
  const segments = raw.replace(/\r\n/g, "\n").split(/[,\n]/);
  const rest = (segments.pop() ?? "").trimStart();
  const committed = segments.map((part) => part.trim()).filter(Boolean);
  return { committed, rest };
}

export function tagsInputAppend(
  values: readonly string[],
  incoming: readonly string[],
  max?: number,
): string[] {
  const next = [...values];
  const seen = new Set(next);
  for (const raw of incoming) {
    const tag = raw.trim();
    if (!tag || seen.has(tag)) continue;
    if (max != null && next.length >= max) break;
    seen.add(tag);
    next.push(tag);
  }
  return next;
}

export function tagsInputRemove(values: readonly string[], value: string): string[] {
  const index = values.indexOf(value);
  if (index < 0) return [...values];
  return values.filter((_, item) => item !== index);
}

export function tagsInputRemoveLast(values: readonly string[]): string[] {
  return values.slice(0, -1);
}

export function tagsFromFormValue(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((item): item is string => typeof item === "string");
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(",").map((part) => part.trim()).filter(Boolean);
  }
  return [];
}
