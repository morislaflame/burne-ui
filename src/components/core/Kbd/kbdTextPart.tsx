import type { ReactNode } from "react";

import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { useKbdClassNames } from "./kbdContext";
import { KBD_TEXT_VARIANT } from "./kbdStyles";
import type { KbdSize } from "./kbdTypes";

export function KbdText({
  size,
  className,
  children,
}: {
  size: KbdSize;
  className?: string;
  children: ReactNode;
}) {
  const slotClassNames = useKbdClassNames();

  return (
    <Text
      as="span"
      variant={KBD_TEXT_VARIANT[size]}
      inheritColor
      className={cn(slotClassNames.text, className)}
    >
      {children}
    </Text>
  );
}

KbdText.displayName = "Kbd.Text";
