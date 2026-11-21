export function cardRenderAsButton(
  pressable: boolean,
  hasExplicitHandlers: boolean,
): boolean {
  return pressable || hasExplicitHandlers;
}
 
export function cardHasExplicitHandlers(props: {
  onClick?: unknown;
  onKeyDown?: unknown;
  onPointerDown?: unknown;
}): boolean {
  return Boolean(props.onClick || props.onKeyDown || props.onPointerDown);
}

const CARD_INTERACTIVE_DESCENDANT_SELECTOR = [
  "button",
  "a[href]",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[role='link']",
  "[role='checkbox']",
  "[role='switch']",
  "[role='menuitem']",
  "[role='option']",
  "[role='combobox']",
  "[contenteditable='true']",
].join(",");

export function isInteractiveCardDescendant(
  target: EventTarget | null,
  cardEl: HTMLElement,
): boolean {
  if (!(target instanceof Element) || target === cardEl) return false;
  const interactive = target.closest(CARD_INTERACTIVE_DESCENDANT_SELECTOR);
  if (!interactive || interactive === cardEl) return false;
  return cardEl.contains(interactive);
}
 