import {
  useCallback,
  useRef,
  useSyncExternalStore,
  type RefObject,
} from "react";

const THEME_ATTR = "data-theme";
const THEME_ATTR_SELECTOR = `[${THEME_ATTR}]`;

type BurneThemeMode = "light" | "dark";

/** Synchronous theme mode read from element (`data-theme`). */
export function readBurneThemeFromElement(el: Element): BurneThemeMode | null {
  const theme = el.getAttribute(THEME_ATTR);
  if (theme === "light") return "light";
  if (theme) return "dark";
  return null;
}

/**
 * Burne UI light theme: nearest wrapper at `anchor` first, otherwise `<html>`.
 */
export function isBurneLightTheme(anchor?: Element | null): boolean {
  if (typeof document === "undefined") return false;

  if (anchor) {
    const themedAncestor = anchor.closest(THEME_ATTR_SELECTOR);
    if (themedAncestor) {
      return readBurneThemeFromElement(themedAncestor) === "light";
    }
  }

  return readBurneThemeFromElement(document.documentElement) === "light";
}

export type BurneLightThemePortalProps = {
  "data-theme"?: "light";
};

/**
 * Theme attributes for portal in `body`: copies light theme from `anchor` or root.
 * Used in portals (`Dialog`, `AlertDialog`, `Drawer`, `Tooltip`, `Dropdown`, `Popover`).
 */
export function burneLightThemePortalProps(
  anchor?: Element | null,
): BurneLightThemePortalProps {
  if (typeof document === "undefined") return {};

  const themedAncestor =
    anchor?.closest(THEME_ATTR_SELECTOR) ?? document.documentElement;
  if (readBurneThemeFromElement(themedAncestor) !== "light") return {};

  // If light theme is set on <html>, portal in document.body already inherits
  // all CSS variables from root. Repeating data-theme="light" on the portal itself
  // would re-apply default light tokens and override playground inline presets.
  if (themedAncestor === document.documentElement) return {};

  return { "data-theme": "light" };
}

function collectThemeObserveTargets(anchor?: Element | null): Element[] {
  if (typeof document === "undefined") return [];

  const seen = new Set<Element>();
  const targets: Element[] = [];

  const addChain = (start: Element | null) => {
    let el = start;
    while (el && !seen.has(el)) {
      seen.add(el);
      targets.push(el);
      el = el.parentElement;
    }
  };

  if (anchor) addChain(anchor);
  addChain(document.documentElement);
  return targets;
}

function subscribeToBurneTheme(
  anchor: Element | null | undefined,
  onStoreChange: () => void,
) {
  if (typeof document === "undefined") return () => {};

  const observer = new MutationObserver(onStoreChange);
  for (const target of collectThemeObserveTargets(anchor)) {
    observer.observe(target, {
      attributes: true,
      attributeFilter: [THEME_ATTR],
    });
  }
  return () => observer.disconnect();
}

/** Reactive light theme: updates when `data-theme` changes on root or `anchor`. */
export function useBurneLightTheme(anchor?: Element | null): boolean {
  return useSyncExternalStore(
    useCallback((onStoreChange) => subscribeToBurneTheme(anchor, onStoreChange), [anchor]),
    () => isBurneLightTheme(anchor),
    () => false,
  );
}

export type BurneThemeAnchor =
  | Element
  | null
  | RefObject<Element | null>;

function resolveThemeAnchor(anchor?: BurneThemeAnchor): Element | null {
  if (!anchor) return null;
  if ("current" in anchor) return anchor.current;
  return anchor;
}

/**
 * Theme inheritance anchor for portal: explicit `themeAnchor` or `document.activeElement` on open.
 */
export function usePortalThemeAnchor(
  open: boolean,
  themeAnchor?: BurneThemeAnchor,
): Element | null {
  const explicitAnchor = resolveThemeAnchor(themeAnchor);
  const openAnchorRef = useRef<HTMLElement | null>(null);

  if (!open) {
    openAnchorRef.current = null;
  } else if (!explicitAnchor && openAnchorRef.current === null) {
    const active =
      typeof document !== "undefined" ? document.activeElement : null;
    openAnchorRef.current = active instanceof HTMLElement ? active : null;
  }

  return explicitAnchor ?? openAnchorRef.current;
}
