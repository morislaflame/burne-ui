/** APG menu / listbox typeahead: typed character buffer + prefix match. */

export const TYPEAHEAD_RESET_MS = 500;

export type TypeaheadBufferState = {
  buffer: string;
  timeoutId: ReturnType<typeof setTimeout> | null;
};

export function createTypeaheadBufferState(): TypeaheadBufferState {
  return { buffer: "", timeoutId: null };
}

export function isTypeaheadPrintableKey(
  key: string,
  mods: { ctrlKey?: boolean; altKey?: boolean; metaKey?: boolean },
): boolean {
  if (mods.ctrlKey || mods.altKey || mods.metaKey) return false;
  if (key.length !== 1) return false;
  // Space often activates the focused item — not used for typeahead.
  if (key === " ") return false;
  return true;
}

export function typeaheadPush(
  state: TypeaheadBufferState,
  char: string,
  resetMs = TYPEAHEAD_RESET_MS,
): string {
  state.buffer += char;
  if (state.timeoutId != null) clearTimeout(state.timeoutId);
  state.timeoutId = setTimeout(() => {
    state.buffer = "";
    state.timeoutId = null;
  }, resetMs);
  return state.buffer;
}

/** Same letter repeated → cycle matches for that letter (APG). */
export function typeaheadQuery(buffer: string): string {
  if (buffer.length > 1 && buffer.split("").every((c) => c === buffer[0])) {
    return buffer[0]!;
  }
  return buffer;
}

/**
 * Next label (case-insensitive prefix) after `currentIndex`, wrapping.
 * `currentIndex` < 0 means start from the beginning.
 */
export function typeaheadMatchIndex(
  labels: readonly string[],
  buffer: string,
  currentIndex: number,
): number {
  const q = typeaheadQuery(buffer).toLowerCase();
  if (!q || labels.length === 0) return -1;
  const n = labels.length;
  const from = currentIndex >= 0 ? currentIndex : -1;
  for (let step = 1; step <= n; step += 1) {
    const idx = (from + step) % n;
    if ((labels[idx] ?? "").toLowerCase().startsWith(q)) return idx;
  }
  return -1;
}
