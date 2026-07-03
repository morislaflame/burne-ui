import { isValidElement, type ReactNode } from "react";

import type { KbdSize } from "./kbdTypes";
import { KbdText } from "./kbdTextPart";

export function KbdBody({
  size,
  children,
}: {
  size: KbdSize;
  children: ReactNode;
}) {
  if (children == null || children === false) return null;
  if (isValidElement(children)) return children;
  return <KbdText size={size}>{children}</KbdText>;
}

KbdBody.displayName = "KbdBody";
