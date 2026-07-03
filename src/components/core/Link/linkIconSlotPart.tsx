import { LINK_ICON_SLOT_ARIA_HIDDEN } from "./linkA11y";
import { linkIconSlotClass } from "./linkStyles";
import type { LinkIconSlotProps } from "./linkTypes";

export function LinkIconSlot({
  children,
  size,
  muted = false,
  slotClass,
}: LinkIconSlotProps) {
  return (
    <span
      className={linkIconSlotClass({ size, muted, slotClass })}
      aria-hidden={LINK_ICON_SLOT_ARIA_HIDDEN}
    >
      {children}
    </span>
  );
}
