import { forwardRef } from "react";

import { Text } from "@/components/core/Text";

import {
  useOptionalButtonGroupLayout,
  useOptionalButtonGroupSegment,
} from "./buttonGroupContext";
import {
  BUTTON_GROUP_TEXT_LABEL_CLASS,
  BUTTON_GROUP_TEXT_VARIANT,
  buttonGroupTextClass,
} from "./buttonGroupStyles";
import type { ButtonGroupTextProps } from "./buttonGroupTypes";

export const ButtonGroupText = forwardRef<HTMLSpanElement, ButtonGroupTextProps>(
  function ButtonGroupText(
    {
      children,
      className = "",
      buttonSize: buttonSizeProp,
      groupSegment: groupSegmentProp,
      ...rest
    },
    ref,
  ) {
    const layoutCtx = useOptionalButtonGroupLayout();
    const groupCtx = useOptionalButtonGroupSegment();
    const buttonSize = buttonSizeProp ?? groupCtx?.buttonSize ?? "base";
    const groupSegment = layoutCtx?.segmented
      ? undefined
      : (groupSegmentProp ?? groupCtx?.segment);
    const groupVariant = groupCtx?.variant;

    return (
      <span
        ref={ref}
        {...rest}
        className={buttonGroupTextClass({
          groupSegment,
          groupVariant,
          buttonSize,
          className,
        })}
      >
        <Text
          variant={BUTTON_GROUP_TEXT_VARIANT[buttonSize]}
          inheritColor
          as="span"
          className={BUTTON_GROUP_TEXT_LABEL_CLASS}
        >
          {children}
        </Text>
      </span>
    );
  },
);

ButtonGroupText.displayName = "ButtonGroupText";
