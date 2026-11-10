export function placeContextMenuAnchor(
  anchor: HTMLElement | null,
  x: number,
  y: number,
): void {
  if (!anchor) return;
  anchor.style.left = `${x}px`;
  anchor.style.top = `${y}px`;
}

export function isContextMenuKey(event: { key: string; shiftKey: boolean }): boolean {
  return event.key === "ContextMenu" || (event.shiftKey && event.key === "F10");
}

/** Move an already-open menu when the pointer anchor changes. */
export function nudgeOpenContextMenu(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("scroll"));
}
