import { shouldWrapButtonChildrenInText } from "./buttonAPI";
import { ButtonIcon, ButtonText } from "./buttonParts";
import type { ButtonSimpleContentProps } from "./buttonTypes";

/** Simple API: assembles label slot from root props. */
export function ButtonSimpleContent({ leftIcon, children }: ButtonSimpleContentProps) {
  const wrapText = shouldWrapButtonChildrenInText(children);

  return (
    <>
      {leftIcon != null ? <ButtonIcon>{leftIcon}</ButtonIcon> : null}
      {wrapText ? <ButtonText>{children}</ButtonText> : children}
    </>
  );
}
