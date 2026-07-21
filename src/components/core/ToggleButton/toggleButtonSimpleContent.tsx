import { ToggleButtonIconStart, ToggleButtonText, ToggleButtonIconEnd } from "./toggleButtonParts";
import { shouldWrapToggleButtonChildrenInText } from "./toggleButtonAPI";
import type { ToggleButtonSimpleContentProps } from "./toggleButtonTypes";

/** Simple API: assembles content slot from root props (single icon). */
export function ToggleButtonSimpleContent({
  icon,
  iconPosition = "start",
  children,
}: ToggleButtonSimpleContentProps) {
  const wrapText = shouldWrapToggleButtonChildrenInText(children);
  const text = wrapText ? <ToggleButtonText>{children}</ToggleButtonText> : children;
  const iconNode =
    icon == null
      ? null
      : iconPosition === "end" ? (
          <ToggleButtonIconEnd>{icon}</ToggleButtonIconEnd>
        ) : (
          <ToggleButtonIconStart>{icon}</ToggleButtonIconStart>
        );

  return (
    <>
      {iconPosition === "start" ? iconNode : null}
      {text}
      {iconPosition === "end" ? iconNode : null}
    </>
  );
}
