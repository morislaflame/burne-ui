import { Field } from "@/components/core/Field";
import { Text } from "@/components/core/Text";

import { SwitchControl } from "./switchControlParts";
import { useSwitchClassNames } from "./switchContext";
import {
  SWITCH_ERROR_DISABLED_CLASS,
  SWITCH_HINT_DISABLED_CLASS,
  SWITCH_LABEL_TEXT_DISABLED_CLASS,
  SWITCH_LAYOUT,
  SWITCH_SIMPLE_LABEL_TEXT_CLASS,
  SWITCH_SIMPLE_LABEL_WRAP_CLASS,
  switchControlCellClass,
  switchLabelCellClass,
  switchSecondaryCellClass,
} from "./switchStyles";
import type { SwitchControlProps, SwitchSize } from "./switchTypes";

import { cn } from "@/utils/cn";

export function SwitchSimpleBody({
  label,
  hint,
  error,
  hasTextColumn,
  hasHint,
  hasError,
  secondaryLines,
  textColRef,
  size,
  disabled,
  labelPosition,
  hintId,
  errorId,
  controlProps,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  hasTextColumn: boolean;
  hasHint: boolean;
  hasError: boolean;
  secondaryLines: number;
  textColRef: React.RefObject<HTMLElement | null>;
  size: SwitchSize;
  disabled?: boolean;
  labelPosition: "left" | "right";
  hintId: string;
  errorId: string;
  controlProps: SwitchControlProps;
}) {
  const slotClassNames = useSwitchClassNames();
  const sz = SWITCH_LAYOUT[size];

  return (
    <>
      <SwitchControl
        size={size}
        disabled={disabled}
        className={switchControlCellClass(labelPosition)}
        {...controlProps}
      />
      {hasTextColumn ? (
        <>
          <span
            ref={textColRef}
            className={cn(
              switchLabelCellClass(labelPosition),
              !secondaryLines && SWITCH_SIMPLE_LABEL_WRAP_CLASS,
              slotClassNames.simpleLabelWrap,
              slotClassNames.label,
            )}
          >
            <Text
              as="span"
              variant={sz.title}
              inheritColor
              className={cn(
                SWITCH_SIMPLE_LABEL_TEXT_CLASS,
                disabled && SWITCH_LABEL_TEXT_DISABLED_CLASS,
                slotClassNames.simpleLabelText,
                slotClassNames.labelText,
              )}
            >
              {label}
            </Text>
          </span>
          {hasHint ? (
            <Field.Hint
              as="span"
              id={hintId}
              variant={sz.desc}
              className={cn(
                switchSecondaryCellClass(2, labelPosition),
                disabled && SWITCH_HINT_DISABLED_CLASS,
                slotClassNames.hint,
              )}
            >
              {hint}
            </Field.Hint>
          ) : null}
          {hasError ? (
            <Field.Error
              as="span"
              id={errorId}
              variant={sz.desc}
              className={cn(
                switchSecondaryCellClass(hasHint ? 3 : 2, labelPosition),
                disabled && SWITCH_ERROR_DISABLED_CLASS,
                slotClassNames.error,
              )}
            >
              {error}
            </Field.Error>
          ) : null}
        </>
      ) : null}
    </>
  );
}
