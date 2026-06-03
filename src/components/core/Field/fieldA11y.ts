/** Объединяет id для `aria-describedby` (hint, error, …). */
export function joinFieldDescribedBy(...ids: (string | undefined)[]) {
  const joined = ids.filter(Boolean).join(" ");
  return joined.length > 0 ? joined : undefined;
}

export function fieldHintId(baseId: string) {
  return `${baseId}-hint`;
}

export function fieldErrorId(baseId: string) {
  return `${baseId}-error`;
}
