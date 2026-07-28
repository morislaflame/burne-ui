/**
 * Programmatic focus helpers.
 *
 * Kit `focus-ring` paints on `:focus-visible`. Use:
 * - `focusKeyboard(el)` — roving / in-widget keyboard moves (always show ring)
 * - `focusElement(el)` — open, restore, misc (browser decides from last input)
 * - `focusElement(el, { focusVisible: false })` — force ring off (rare)
 *
 * Menu / listbox rows often omit `focus-ring` and use surface tint via
 * `hoverVariant()` (`focus-visible:bg-*`) instead.
 *
 * `FocusOptions.focusVisible` is supported in Chromium / WebKit; engines that
 * ignore unknown options still receive a normal focus without throwing.
 */

export type FocusElementOptions = {
  preventScroll?: boolean;
  /**
   * Force `:focus-visible`.
   * Prefer `focusKeyboard` over `{ focusVisible: true }` at call sites.
   */
  focusVisible?: boolean;
};

type FocusOptionsWithVisible = FocusOptions & { focusVisible?: boolean };

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function focusElement(
  el: HTMLElement | null | undefined,
  options: FocusElementOptions = {},
): void {
  if (!el) return;
  const { preventScroll = true, focusVisible } = options;
  const focusOpts: FocusOptionsWithVisible = { preventScroll };
  if (focusVisible !== undefined) {
    focusOpts.focusVisible = focusVisible;
  }
  el.focus(focusOpts);
}

/** Roving tabindex / arrow moves — always paints the kit focus ring. */
export function focusKeyboard(
  el: HTMLElement | null | undefined,
  options: Omit<FocusElementOptions, "focusVisible"> = {},
): void {
  focusElement(el, { ...options, focusVisible: true });
}

/** Whether `el` currently matches `:focus-visible` (keyboard-styled focus). */
export function isFocusVisibleElement(el: Element | null | undefined): boolean {
  return el instanceof Element && el.matches(":focus-visible");
}

/**
 * First Tab-reachable control inside `root` (skips `aria-hidden` subtrees).
 * Falls back to `null` when the panel itself should take focus (`tabIndex={-1}`).
 */
export function getFirstFocusable(root: HTMLElement): HTMLElement | null {
  const nodes = root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  for (const el of nodes) {
    if (el.closest("[aria-hidden='true']")) continue;
    return el;
  }
  return null;
}

/**
 * Move focus into a panel on open.
 * Keyboard-opened → first focusable (or panel) with visible ring.
 * Pointer-opened → same target, no ring.
 *
 * Pass `focusVisible` when the opener already lost `:focus-visible`
 * (e.g. after `showModal()`); otherwise pass `from` to read it live.
 */
export function focusPanelOnOpen(
  panel: HTMLElement,
  options: {
    /** Element that had focus before open (usually the trigger). */
    from?: Element | null;
    /** Explicit ring intent — wins over reading `from`. */
    focusVisible?: boolean;
    preferFirstFocusable?: boolean;
  } = {},
): void {
  const { from = null, preferFirstFocusable = true } = options;
  const first = preferFirstFocusable ? getFirstFocusable(panel) : null;
  // Panel fallback only when it is programmatically focusable (`tabIndex={-1}`).
  const target =
    first ?? (panel.hasAttribute("tabindex") ? panel : null);
  if (!target) return;
  const focusVisible =
    options.focusVisible !== undefined
      ? options.focusVisible
      : isFocusVisibleElement(from);
  focusElement(target, { focusVisible });
}
