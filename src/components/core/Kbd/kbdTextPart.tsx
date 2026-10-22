import { forwardRef, type ForwardedRef } from "react";
import { Text } from "@/components/core/Text";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { cn } from "@/utils/cn";
 
import { useKbdClassNames, useOptionalKbdMotionScope } from "./kbdContext";
import { KBD_TEXT_CLASS, KBD_TEXT_VARIANT } from "./kbdStyles";
import type { KbdTextProps } from "./kbdTypes";
 
export const KbdText = forwardRef(function KbdText({
  size,
  className,
  children,
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: KbdTextProps, ref: ForwardedRef<HTMLSpanElement>) {
  const slotClassNames = useKbdClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    forwardedRef: ref,
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
      textStyle={KBD_TEXT_VARIANT[size]}
      inheritColor
      className={cn(KBD_TEXT_CLASS, slotClassNames.text, className)}
      {...rest}
      {...pointerHandlers}
    >
      {children}
    </Text>
  );
});
 
KbdText.displayName = "Kbd.Text";
 