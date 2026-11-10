import { useCallback, useRef, useSyncExternalStore, type RefObject } from "react";
 
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
  "data-theme"?: "light" | "dark";
};

/**
 * Theme attribute for a portal in `body`.
 * `<html>` is inherited, so the portal does not repeat it.
 * A nested island is copied (`light` or `dark`) so the panel does not take the page mode.
 */
export function burneLightThemePortalProps(
  anchor?: Element | null,
): BurneLightThemePortalProps {
  if (typeof document === "undefined") return {};

  const themedAncestor =
    anchor?.closest(THEME_ATTR_SELECTOR) ?? document.documentElement;
  if (themedAncestor === document.documentElement) return {};

  const mode = readBurneThemeFromElement(themedAncestor);
  if (mode === "light" || mode === "dark") return { "data-theme": mode };
  return {};
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
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- clears the anchor during render so a closed portal does not keep the previous element
    openAnchorRef.current = null;
  } else if (!explicitAnchor && openAnchorRef.current === null) {
    const active =
      typeof document !== "undefined" ? document.activeElement : null;
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- captures document.activeElement on the open render, before focus moves into the portal
    openAnchorRef.current = active instanceof HTMLElement ? active : null;
  }
 
  return explicitAnchor ?? openAnchorRef.current;
}
 