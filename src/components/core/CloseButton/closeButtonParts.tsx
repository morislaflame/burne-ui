import type { ReactNode } from "react";

import { KitClose } from "@/components/core/utils/kitIcons";
 
import { Ripple } from "@/components/core/Ripple";
import { useMotionPart } from "@/components/core/utils/slotMotion";
 
import {
  useCloseButtonClassNames,
  useOptionalCloseButtonMotionScope,
} from "./closeButtonContext";
import { closeButtonIconClass, closeButtonIconSlotClass, CLOSE_BUTTON_RIPPLE_CLIP_CLASS } from "./closeButtonStyles";
import type { CloseButtonSize } from "./closeButtonTypes";
 
import { cn } from "@/utils/cn";
 
export function CloseButtonRipple({
  color,
  disabled,
  className,
}: {
  color: string;
  disabled: boolean;
  className?: string;
}) {
  const slotClassNames = useCloseButtonClassNames();
 
  return (
    <Ripple
      color={color}
      disabled={disabled}
      className={cn(
        CLOSE_BUTTON_RIPPLE_CLIP_CLASS,
        slotClassNames.ripple,
        className,
      )}
    />
  );
}
 
export function CloseButtonIcon({
  size,
  icon,
}: {
  size: CloseButtonSize;
  icon?: ReactNode | null;
}) {
  const slotClassNames = useCloseButtonClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalCloseButtonMotionScope(),
    slot: "icon",
    pointerPhases: true,
  });

  if (icon === null) return null;
 
  return (
    <span
      ref={setRef}
      className={closeButtonIconSlotClass(size, slotClassNames.icon)}
      {...pointerHandlers}
    >
      {icon ?? <KitClose aria-hidden className={closeButtonIconClass()} />}
    </span>
  );
}
 