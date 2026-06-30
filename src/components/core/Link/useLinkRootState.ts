import { LINK_TEXT_VARIANT } from "./linkStyles";
import { resolveLinkBodyIcons } from "./linkAPI";
import type { UseLinkRootStateProps } from "./linkTypes";

export function useLinkRootState({
  size = "base",
  underline = false,
  leftIcon,
  rightIcon,
  showDefaultIcon = false,
  defaultIconPosition = "end",
  children,
}: UseLinkRootStateProps) {
  const icons = resolveLinkBodyIcons({
    size,
    underline,
    leftIcon,
    rightIcon,
    showDefaultIcon,
    defaultIconPosition,
    children,
  });

  return {
    size,
    underline,
    textVariant: LINK_TEXT_VARIANT[size],
    ...icons,
  };
}
