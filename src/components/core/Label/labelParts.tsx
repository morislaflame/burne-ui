import type { HTMLAttributes } from "react";

import { Text } from "@/components/core/Text";

import { LABEL_REQUIRED_MARKER_ARIA_HIDDEN } from "./labelA11y";
import { useLabelClassNames } from "./labelContext";
import {
  labelRequiredClass,
  labelRootClass,
  labelTextClass,
} from "./labelStyles";
import type { LabelContentProps, LabelProps } from "./labelTypes";
import { useLabelRootState } from "./useLabelRootState";

function LabelContent({ children, isRequired }: LabelContentProps) {
  const slotClassNames = useLabelClassNames();

  return (
    <>
      <Text
        as="span"
        variant="base"
        className={labelTextClass(slotClassNames.text)}
      >
        {children}
      </Text>
      {isRequired ? (
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

export function LabelRoot({
  children,
  className,
  isRequired: isRequiredProp,
  htmlFor: htmlForProp,
  id: idProp,
  ...rest
}: Omit<LabelProps, "classNames">) {
  const { htmlFor, id, isRequired } = useLabelRootState({
    isRequired: isRequiredProp,
    htmlFor: htmlForProp,
    id: idProp,
  });
  const slotClassNames = useLabelClassNames();
  const rootClass = labelRootClass({
    className,
    slotClass: slotClassNames.root,
  });

  if (htmlFor != null) {
    return (
      <label htmlFor={htmlFor} className={rootClass} {...rest}>
        <LabelContent isRequired={isRequired}>{children}</LabelContent>
      </label>
    );
  }

  const spanRest = rest as HTMLAttributes<HTMLSpanElement>;

  return (
    <span id={id} className={rootClass} {...spanRest}>
      <LabelContent isRequired={isRequired}>{children}</LabelContent>
    </span>
  );
}

export function LabelSlot(_props: LabelProps) {
  return null;
}

LabelSlot.displayName = "Label";
