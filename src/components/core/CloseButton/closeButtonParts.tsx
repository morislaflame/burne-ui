import { IoClose } from "react-icons/io5";

import { Ripple } from "@/components/core/Ripple";
import { getMotionConfig } from "@/components/core/utils/motionConfig";

import { useCloseButtonClassNames } from "./closeButtonContext";
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
      duration={getMotionConfig().rippleDefaultDuration}
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

  return (
    <IoClose
      aria-hidden
      className={closeButtonIconClass(size, slotClassNames.icon)}
    />
  );
}
