import { useSkinVariant } from "@/skins/skinContext";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";
 
import { closeButtonAriaLabel } from "./closeButtonA11y";
import { closeButtonRootClass, closeButtonVariantVisual } from "./closeButtonStyles";
import type { UseCloseButtonRootStateProps } from "./closeButtonTypes";
 
export function useCloseButtonRootState({
  variant: variantProp,
  size = "base",
  ripple = false,
  className,
  disabled,
  type = "button",
  "aria-label": ariaLabel,
  classNames,
}: UseCloseButtonRootStateProps) {
  const variant = useSkinVariant(variantProp);
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
    ripple,
    disabled: isDisabled,
    type,
    ariaLabel: closeButtonAriaLabel(ariaLabel, closeLabel),
    buttonClass,
    convergeRippleColor: vn.convergeBg,
    classNames,
  };
}
 