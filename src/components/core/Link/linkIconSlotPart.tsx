import { useMotionPart } from "@/components/core/utils/slotMotion";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { cn } from "@/utils/cn";
 
import { LINK_ICON_SLOT_ARIA_HIDDEN } from "./linkA11y";
import { useOptionalLinkMotionScope } from "./linkContext";
import { linkIconSlotClass } from "./linkStyles";
import type { LinkIconSlotProps } from "./linkTypes";
 
export function LinkIconSlot({
  children,
  size,
  muted = false,
  slotClass,
  className,
  forwardedRef,
  slot,
}: LinkIconSlotProps) {
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalLinkMotionScope(),
    slot,
    pointerPhases: true,
  });
 
  return (
    <span
      ref={mergeRefs(forwardedRef, setRef)}
      className={cn(linkIconSlotClass({ size, muted, slotClass }), className)}
      aria-hidden={LINK_ICON_SLOT_ARIA_HIDDEN}
      {...pointerHandlers}
    >
      {children}
    </span>
  );
}
 