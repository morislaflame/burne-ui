/**
 * Resolve the DOM node for overlay portals (`createPortal`).
 * Defaults to `document.body` when `container` is omitted.
 * Returns `null` during SSR (no `document`) — callers must skip the portal.
 */
export function resolvePortalContainer(
  container?: HTMLElement | null,
): HTMLElement | null {
  if (container) return container;
  if (typeof document === "undefined") return null;
  return document.body;
}

/**
 * Custom portal hosts (not `document.body`) need non-modal `<dialog>.show()`
 * and `position: absolute` — `showModal()` promotes to the browser top layer
 * and always covers the viewport, ignoring the host.
 */
export function isContainedPortal(
  container?: HTMLElement | null,
): boolean {
  if (typeof document === "undefined") return false;
  if (container == null) return false;
  return container !== document.body;
}

/**
 * Open a native `<dialog>`. Contained portals use non-modal `show()`.
 */
export function openNativeDialog(
  dialog: HTMLDialogElement,
  options?: { contained?: boolean },
): void {
  if (dialog.open) return;
  if (options?.contained) dialog.show();
  else dialog.showModal();
}

/**
 * Place a floating panel from viewport-space coords (`getBoundingClientRect`).
 * - `document.body` → `position: fixed` with viewport coords
 * - custom host → `position: absolute` relative to the host box
 */
export function applyFloatingPortalPosition(
  panel: HTMLElement,
  placement: { left: number; top: number },
  portalContainer?: HTMLElement | null,
): void {
  if (isContainedPortal(portalContainer) && portalContainer) {
    const hostRect = portalContainer.getBoundingClientRect();
    panel.style.position = "absolute";
    panel.style.left = `${placement.left - hostRect.left + portalContainer.scrollLeft}px`;
    panel.style.top = `${placement.top - hostRect.top + portalContainer.scrollTop}px`;
    return;
  }

  panel.style.position = "fixed";
  panel.style.left = `${placement.left}px`;
  panel.style.top = `${placement.top}px`;
}
