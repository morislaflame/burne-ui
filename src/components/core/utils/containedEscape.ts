/**
 * Contained portals use `dialog.show()` — the UA does not fire `cancel` on Escape.
 * A document listener must close them, but must not steal Escape from a top-layer
 * `showModal()` dialog (playground galleries keep a contained overlay mounted).
 */
export function shouldHandleContainedEscape(
  event: Pick<KeyboardEvent, "key" | "defaultPrevented" | "target">,
  dialog: HTMLDialogElement | null,
): boolean {
  if (event.key !== "Escape" || event.defaultPrevented) return false;
  if (!dialog?.open) return false;
  const target = event.target;
  if (target == null || !dialog.contains(target as Node)) return false;
  const topModal = dialog.ownerDocument.querySelector("dialog:modal");
  if (topModal && topModal !== dialog) return false;
  if (typeof dialog.ownerDocument.querySelectorAll === "function") {
    const openModals = dialog.ownerDocument.querySelectorAll(
      "dialog[open]:not(.portal-contained)",
    );
    const lastModal = openModals.length > 0 ? openModals[openModals.length - 1] : null;
    if (lastModal && lastModal !== dialog) return false;
    const containedDialogs = dialog.ownerDocument.querySelectorAll(
      "dialog[open].portal-contained",
    );
    const topContained =
      containedDialogs.length > 0
        ? containedDialogs[containedDialogs.length - 1]
        : null;
    if (topContained && topContained !== dialog) return false;
  }
  return true;
}
 