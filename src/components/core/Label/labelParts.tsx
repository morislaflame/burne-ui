import { Text } from "@/components/core/Text";
import { useMotionPart } from "@/components/core/utils/slotMotion";

import { LABEL_REQUIRED_MARKER_ARIA_HIDDEN } from "./labelA11y";
import { useLabelClassNames, useOptionalLabelMotionScope } from "./labelContext";
import { labelRequiredClass, labelTextClass } from "./labelStyles";
import type { LabelContentProps, LabelProps } from "./labelTypes";

export function LabelSlot(_props: LabelProps) {
  return null;
}

LabelSlot.displayName = "Label";

export function LabelContent({ children, required, variant = "base" }: LabelContentProps) {
  const slotClassNames = useLabelClassNames();
  const scope = useOptionalLabelMotionScope();
  const textPart = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "text",
    pointerPhases: false,
  });
  const requiredPart = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "required",
    pointerPhases: false,
  });

  return (
    <>
      <Text
        ref={textPart.setRef}
        as="span"
        variant={variant}
        className={labelTextClass(slotClassNames.text)}
        {...textPart.pointerHandlers}
      >
        {children}
      </Text>
      {required ? (
        <span
          ref={requiredPart.setRef}
          className={labelRequiredClass(slotClassNames.required)}
          aria-hidden={LABEL_REQUIRED_MARKER_ARIA_HIDDEN}
          {...requiredPart.pointerHandlers}
        >
          *
        </span>
      ) : null}
    </>
  );
}
