const WINDOW_SCROLL: AddEventListenerOptions = { capture: true, passive: true };
const PASSIVE: AddEventListenerOptions = { passive: true };
 
/**
 * Reposition floating overlays when layout changes.
 * Capture `scroll` is `{ passive: true }` so the listener does not disable
 * scroll optimizations. iOS keyboard resizes `visualViewport` without
 * `window.resize` — those events keep Popover / Tooltip / Dropdown.Sub
 * pinned to the trigger.
 */
export function bindOverlayReflow(onReflow: () => void): () => void {
  if (typeof window === "undefined") return () => {};
 
  window.addEventListener("scroll", onReflow, WINDOW_SCROLL);
  window.addEventListener("resize", onReflow, PASSIVE);
  const viewport = window.visualViewport;
  viewport?.addEventListener("resize", onReflow, PASSIVE);
  viewport?.addEventListener("scroll", onReflow, PASSIVE);
 
  return () => {
    window.removeEventListener("scroll", onReflow, WINDOW_SCROLL);
    window.removeEventListener("resize", onReflow, PASSIVE);
    viewport?.removeEventListener("resize", onReflow, PASSIVE);
    viewport?.removeEventListener("scroll", onReflow, PASSIVE);
  };
}
 