import { shouldWrapButtonChildrenInText } from "./buttonAPI";
import { ButtonIcon, ButtonText } from "./buttonParts";
import type { ButtonSimpleContentProps } from "./buttonTypes";

/** Simple API: assembles label slot from root props. */
export function ButtonSimpleContent({
  icon,
  iconPosition = "start",
  children,
}: ButtonSimpleContentProps) {
  const wrapText = shouldWrapButtonChildrenInText(children);
  const iconNode = icon != null ? <ButtonIcon>{icon}</ButtonIcon> : null;

  return (
    <>
      {iconPosition === "start" ? iconNode : null}
      {wrapText ? <ButtonText>{children}</ButtonText> : children}
      {iconPosition === "end" ? iconNode : null}
    </>
  );
}
