import { useMotionPart } from "@/components/core/utils/slotMotion";

import { LINK_ICON_SLOT_ARIA_HIDDEN } from "./linkA11y";
import { useOptionalLinkMotionScope } from "./linkContext";
import { linkIconSlotClass } from "./linkStyles";
import type { LinkIconSlotProps } from "./linkTypes";

export function LinkIconSlot({
  children,
  size,
  muted = false,
  slotClass,
}: LinkIconSlotProps) {
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalLinkMotionScope(),
    slot: "icon",
    pointerPhases: true,
  });

  return (
    <span
      ref={setRef}
      className={linkIconSlotClass({ size, muted, slotClass })}
      aria-hidden={LINK_ICON_SLOT_ARIA_HIDDEN}
      {...pointerHandlers}
    >
      {children}
    </span>
  );
}
