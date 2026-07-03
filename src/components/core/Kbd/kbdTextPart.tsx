import type { ReactNode } from "react";

import { Text } from "@/components/core/Text";

import { KBD_TEXT_VARIANT } from "./kbdStyles";
import type { KbdSize } from "./kbdTypes";

export function KbdText({
  size,
  children,
}: {
  size: KbdSize;
  children: ReactNode;
}) {
  return (
    <Text as="span" variant={KBD_TEXT_VARIANT[size]} inheritColor>
      {children}
    </Text>
  );
}

KbdText.displayName = "KbdText";
