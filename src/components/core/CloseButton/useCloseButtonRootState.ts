import { useBurneLabel } from "@/theme/BurneLabelsProvider";

import { closeButtonAriaLabel } from "./closeButtonA11y";
import { closeButtonRootClass, closeButtonVariantVisual } from "./closeButtonStyles";
import type { UseCloseButtonRootStateProps } from "./closeButtonTypes";

export function useCloseButtonRootState({
  variant = "default",
  size = "base",
  animated = true,
  ripple = false,
  className,
  disabled,
  type = "button",
  "aria-label": ariaLabel,
  classNames,
}: UseCloseButtonRootStateProps) {
  const closeLabel = useBurneLabel("close");
  const isDisabled = Boolean(disabled);
  const vn = closeButtonVariantVisual(variant);

  const buttonClass = closeButtonRootClass({
    variant,
    size,
    disabled: isDisabled,
    className,
    slotRoot: classNames?.root,
  });

  return {
    variant,
    size,
    animated,
    ripple,
    disabled: isDisabled,
    type,
    ariaLabel: closeButtonAriaLabel(ariaLabel, closeLabel),
    buttonClass,
    convergeRippleColor: vn.convergeBg,
    classNames,
  };
}
