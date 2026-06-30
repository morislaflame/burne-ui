import { resolveLinkIconPlacement } from "./linkAPI";
import { LINK_TEXT_VARIANT } from "./linkStyles";
import type { UseLinkRootStateProps } from "./linkTypes";

export function useLinkRootState({
  size = "base",
  underline = false,
  leftIcon,
  rightIcon,
  showDefaultIcon = false,
  defaultIconPosition = "end",
}: UseLinkRootStateProps) {
  const iconPlacement = resolveLinkIconPlacement({
    leftIcon,
    rightIcon,
    showDefaultIcon,
    defaultIconPosition,
  });

  return {
    size,
    underline,
    textVariant: LINK_TEXT_VARIANT[size],
    leftIcon,
    rightIcon,
    ...iconPlacement,
  };
}
