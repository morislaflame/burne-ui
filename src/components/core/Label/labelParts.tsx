import { Text } from "@/components/core/Text";

import { LABEL_REQUIRED_MARKER_ARIA_HIDDEN } from "./labelA11y";
import { useLabelClassNames } from "./labelContext";
import { labelRequiredClass, labelTextClass } from "./labelStyles";
import type { LabelContentProps, LabelProps } from "./labelTypes";

export function LabelSlot(_props: LabelProps) {
  return null;
}

LabelSlot.displayName = "Label";

export function LabelContent({ children, required, variant = "base" }: LabelContentProps) {
  const slotClassNames = useLabelClassNames();

  return (
    <>
      <Text
        as="span"
        variant={variant}
        className={labelTextClass(slotClassNames.text)}
      >
        {children}
      </Text>
      {required ? (
        <span
          className={labelRequiredClass(slotClassNames.required)}
          aria-hidden={LABEL_REQUIRED_MARKER_ARIA_HIDDEN}
        >
          *
        </span>
      ) : null}
    </>
  );
}
