import { IoClose } from "react-icons/io5";

import { Ripple } from "@/components/core/Ripple";
import { useMotionPart } from "@/components/core/utils/slotMotion";

import {
  useCloseButtonClassNames,
  useOptionalCloseButtonMotionScope,
} from "./closeButtonContext";
import { closeButtonIconClass, CLOSE_BUTTON_RIPPLE_CLIP_CLASS } from "./closeButtonStyles";
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

export function CloseButtonIcon({ size }: { size: CloseButtonSize }) {
  const slotClassNames = useCloseButtonClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalCloseButtonMotionScope(),
    slot: "icon",
    pointerPhases: true,
  });

  return (
    <span ref={setRef} {...pointerHandlers}>
      <IoClose
        aria-hidden
        className={closeButtonIconClass(size, slotClassNames.icon)}
      />
    </span>
  );
}
