import { ToggleButtonIcon, ToggleButtonText, ToggleButtonTrailing } from "./toggleButtonParts";
import { shouldWrapToggleButtonChildrenInText } from "./toggleButtonAPI";
import type { ToggleButtonSimpleContentProps } from "./toggleButtonTypes";

/** Simple API: assembles content slot from root props. */
export function ToggleButtonSimpleContent({
  leftIcon,
  rightIcon,
  children,
}: ToggleButtonSimpleContentProps) {
  const wrapText = shouldWrapToggleButtonChildrenInText(children);

  return (
    <>
      {leftIcon != null ? <ToggleButtonIcon>{leftIcon}</ToggleButtonIcon> : null}
      {wrapText ? <ToggleButtonText>{children}</ToggleButtonText> : children}
      {rightIcon != null ? <ToggleButtonTrailing>{rightIcon}</ToggleButtonTrailing> : null}
    </>
  );
}
