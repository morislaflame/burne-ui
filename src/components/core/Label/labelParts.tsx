import { forwardRef } from "react";

import { Text } from "@/components/core/Text";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
 
import { LABEL_REQUIRED_MARKER_ARIA_HIDDEN } from "./labelA11y";
import { useLabelClassNames, useOptionalLabelMotionScope } from "./labelContext";
import { labelRequiredClass, labelTextClass } from "./labelStyles";
import type { LabelContentProps, LabelProps, LabelRequiredProps, LabelTextProps } from "./labelTypes";
 
export const LabelSlot = forwardRef<HTMLElement, LabelProps>(function LabelSlot(_props, _ref) {
  return null;
});
 
LabelSlot.displayName = "Label";
 
export const LabelText = forwardRef<HTMLSpanElement, LabelTextProps>(function LabelText(
  { className, textStyle = "base", onPointerOver, onPointerOut, onPointerDown, onPointerUp, ...rest },
  ref,
) {
  const slotClassNames = useLabelClassNames();
  const scope = useOptionalLabelMotionScope();
  const part = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "text",
    pointerPhases: false,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <Text
      ref={mergeRefs(ref, part.setRef)}
      as="span"
      textStyle={textStyle}
      className={labelTextClass(slotClassNames.text, className)}
      {...rest}
      {...part.pointerHandlers}
    />
  );
});

LabelText.displayName = "Label.Text";

export const LabelRequired = forwardRef<HTMLSpanElement, LabelRequiredProps>(function LabelRequired(
  { className, onPointerOver, onPointerOut, onPointerDown, onPointerUp, ...rest },
  ref,
) {
  const slotClassNames = useLabelClassNames();
  const scope = useOptionalLabelMotionScope();
  const part = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "required",
    pointerPhases: false,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <span
      ref={mergeRefs(ref, part.setRef)}
      className={labelRequiredClass(slotClassNames.required, className)}
      aria-hidden={LABEL_REQUIRED_MARKER_ARIA_HIDDEN}
      {...rest}
      {...part.pointerHandlers}
    >
      *
    </span>
  );
});

LabelRequired.displayName = "Label.Required";

export function LabelContent({ children, required, textStyle = "base" }: LabelContentProps) {
  return (
    <>
      <LabelText textStyle={textStyle}>{children}</LabelText>
      {required ? <LabelRequired /> : null}
    </>
  );
}
 