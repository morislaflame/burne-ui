import { LINK_TEXT_VARIANT } from "./linkStyles";
import { resolveLinkBodyIcons } from "./linkAPI";
import type { UseLinkRootStateProps } from "./linkTypes";

export function useLinkRootState({
  size = "base",
  underline = false,
  icon,
  iconPosition = "start",
  showDefaultIcon = false,
  defaultIconPosition = "end",
  children,
}: UseLinkRootStateProps) {
  const icons = resolveLinkBodyIcons({
    size,
    underline,
    icon,
    iconPosition,
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
