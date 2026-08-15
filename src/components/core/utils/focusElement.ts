/**
 * Programmatic focus helpers.
 *
 * Kit `focus-ring` / menu `hoverVariant()` (`focus-visible:bg-*`) paint on
 * `:focus-visible`. Use:
 * - `focusKeyboard(el)` — roving / in-widget keyboard moves (always show ring)
 * - `focusOnOpen(el, { from: trigger })` — first focus after overlay/menu open
 * - `focusElement(el)` — restore, misc (browser decides from last input)
 * - `focusElement(el, { focusVisible: false })` — force ring off (rare)
 *
 * Never use bare `focusElement(el)` to move focus into a panel that is still
 * entering. GSAP `autoAlpha: 0` sets `visibility: hidden`; without an explicit
 * `focusVisible` the UA then skips `:focus-visible`, so the kit ring / row
 * tint never appears. Read intent from the trigger (`from`) **before** focus
 * moves.
 *
 * `FocusOptions.focusVisible` is supported in Chromium / WebKit; engines that
 * ignore unknown options still receive a normal focus without throwing.
 */

export type FocusElementOptions = {
  preventScroll?: boolean;
  /**
   * Force `:focus-visible`.
   * Prefer `focusKeyboard` / `focusOnOpen` over `{ focusVisible: true }` at call sites.
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
  return !!el && typeof el.matches === "function" && el.matches(":focus-visible");
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

export type FocusOnOpenOptions = {
  /** Element that had focus before open (usually the trigger). */
  from?: Element | null;
  /** Explicit ring intent — wins over reading `from`. */
  focusVisible?: boolean;
};

/**
 * Move focus into a newly opened overlay / menu item.
 * Keyboard-opened (`from` is `:focus-visible`) → visible ring / row tint.
 * Pointer-opened → same target, no ring.
 *
 * Always passes an explicit `focusVisible` into `focus()`. Heuristics on
 * `el.focus()` fail when the target or an ancestor is `visibility: hidden`
 * from an enter tween (`autoAlpha: 0`).
 */
export function focusOnOpen(
  target: HTMLElement | null | undefined,
  options: FocusOnOpenOptions = {},
): void {
  if (!target) return;
  const from =
    options.from !== undefined
      ? options.from
      : typeof document !== "undefined"
        ? document.activeElement
        : null;
  const focusVisible =
    options.focusVisible !== undefined
      ? options.focusVisible
      : isFocusVisibleElement(from);
  focusElement(target, { focusVisible });
}

/**
 * Move focus into a panel on open (first Tab-reachable, else the panel).
 * Pass `focusVisible` when the opener already lost `:focus-visible`
 * (e.g. after `showModal()`); otherwise pass `from` to read it live.
 */
export function focusPanelOnOpen(
  panel: HTMLElement,
  options: FocusOnOpenOptions & { preferFirstFocusable?: boolean } = {},
): void {
  const { preferFirstFocusable = true, ...openOptions } = options;
  const first = preferFirstFocusable ? getFirstFocusable(panel) : null;
  // Panel fallback only when it is programmatically focusable (`tabIndex={-1}`).
  const target =
    first ?? (panel.hasAttribute("tabindex") ? panel : null);
  if (!target) return;
  focusOnOpen(target, openOptions);
}
