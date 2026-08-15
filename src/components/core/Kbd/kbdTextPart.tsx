import { Text } from "@/components/core/Text";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { cn } from "@/utils/cn";

import { useKbdClassNames, useOptionalKbdMotionScope } from "./kbdContext";
import { KBD_TEXT_CLASS, KBD_TEXT_VARIANT } from "./kbdStyles";
import type { KbdTextProps } from "./kbdTypes";

export function KbdText({
  size,
  className,
  children,
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: KbdTextProps) {
  const slotClassNames = useKbdClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalKbdMotionScope(),
    slot: "text",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });

  return (
    <Text
      ref={setRef as never}
      as="span"
      variant={KBD_TEXT_VARIANT[size]}
      inheritColor
      className={cn(KBD_TEXT_CLASS, slotClassNames.text, className)}
      {...rest}
      {...pointerHandlers}
    >
      {children}
    </Text>
  );
}

KbdText.displayName = "Kbd.Text";
