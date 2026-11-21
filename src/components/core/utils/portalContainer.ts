/**
 * Whether `el` is an open modal `<dialog>` promoted to the browser Top Layer
 * (`showModal()`, i.e. not `.portal-contained`).
 */
export function isTopLayerDialog(
  el: Element | null | undefined,
): el is HTMLDialogElement {
  if (typeof HTMLDialogElement === "undefined") return false;
  if (!(el instanceof HTMLDialogElement) || !el.open) return false;
  if (el.classList.contains("portal-contained")) return false;
  return true;
}

/**
 * Return the topmost currently open modal `<dialog>` in the document, if any.
 * Used by global floating viewports (e.g. Toast) so notifications render inside
 * the active Top Layer instead of becoming inert behind `showModal()`.
 */
export function getTopmostOpenModalDialog(
  doc: Document | null = typeof document === "undefined" ? null : document,
): HTMLDialogElement | null {
  if (!doc) return null;
  const dialogs = doc.querySelectorAll<HTMLDialogElement>(
    "dialog[open]:not(.portal-contained)",
  );
  return dialogs.length > 0 ? dialogs[dialogs.length - 1]! : null;
}

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
 * Resolve the portal host for floating overlays (Popover, Select, ComboBox,
 * DatePicker, ColorPicker, Dropdown, ContextMenu, Tooltip, HoverCard).
 *
 * When `container` is omitted and `anchor` lives inside an open modal `<dialog>`
 * (`showModal()`), the portal mounts inside that `<dialog>` so it participates
 * in the same browser Top Layer and is not blocked by modal `inert` or painted
 * beneath `::backdrop`. Non-modal `.portal-contained` dialogs fall through to
 * `document.body` so floating panels escape clipped showcase frames.
 */
export function resolveFloatingPortalContainer(
  container?: HTMLElement | null,
  anchor?: Element | null,
): HTMLElement | null {
  if (container) return container;
  if (anchor && typeof anchor.closest === "function") {
    const modalHost = anchor.closest("dialog[open]:not(.portal-contained)");
    if (modalHost instanceof HTMLElement) return modalHost;
  }
  return resolvePortalContainer(null);
}

function hasFixedContainingBlockTransform(el: HTMLElement): boolean {
  if (typeof window === "undefined" || typeof window.getComputedStyle !== "function") {
    return false;
  }
  const style = window.getComputedStyle(el);
  return (
    (Boolean(style.transform) && style.transform !== "none") ||
    (Boolean(style.filter) && style.filter !== "none") ||
    (Boolean(style.perspective) && style.perspective !== "none")
  );
}

/**
 * Custom portal hosts (not `document.body` and not an untransformed Top-Layer
 * `<dialog>`) need non-modal `<dialog>.show()` and `position: absolute` —
 * `showModal()` promotes to the browser top layer and always covers the viewport.
 */
export function isContainedPortal(
  container?: HTMLElement | null,
): boolean {
  if (container == null) return false;
  const body = container.ownerDocument?.body
    ?? (typeof document === "undefined" ? null : document.body);
  if (!body || container === body) return false;
  if (isTopLayerDialog(container) && !hasFixedContainingBlockTransform(container)) {
    return false;
  }
  return true;
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
 * `close` / `cancel` do not bubble, but React still walks fibers and invokes
 * `onClose` / `onCancel` on ancestor `<dialog>` hosts. Dismiss only the dialog
 * that actually fired the event.
 */
export function isOwnNativeDialogEvent(event: {
  target: EventTarget | null;
  currentTarget: EventTarget | null;
}): boolean {
  return event.target === event.currentTarget;
}

/**
 * Place a floating panel from viewport-space coords (`getBoundingClientRect`).
 * - `document.body` or Top-Layer `<dialog>` → `position: fixed` with viewport coords
 * - custom host → `position: absolute` relative to the host padding box
 */
export function applyFloatingPortalPosition(
  panel: HTMLElement,
  placement: { left: number; top: number },
  portalContainer?: HTMLElement | null,
): void {
  if (isContainedPortal(portalContainer) && portalContainer) {
    const hostRect = portalContainer.getBoundingClientRect();
    panel.style.position = "absolute";
    panel.style.left = `${placement.left - hostRect.left - portalContainer.clientLeft + portalContainer.scrollLeft}px`;
    panel.style.top = `${placement.top - hostRect.top - portalContainer.clientTop + portalContainer.scrollTop}px`;
    return;
  }

  panel.style.position = "fixed";
  panel.style.left = `${placement.left}px`;
  panel.style.top = `${placement.top}px`;
}
 