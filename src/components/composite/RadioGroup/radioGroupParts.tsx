import { forwardRef } from "react";

import { FieldError } from "@/components/core/Field";
import {
  OptionGroupHeader,
  OptionGroupHint,
  OptionGroupLegend,
  OptionGroupList,
} from "@/components/composite/utils/optionGroupFieldset";

import { useRadioGroupContext } from "./radioGroupContext";
import type {
  RadioGroupErrorProps,
  RadioGroupHintProps,
  RadioGroupLegendProps,
  RadioGroupListProps,
} from "./radioGroupTypes";

export function RadioGroupLegend({ children, ...rest }: RadioGroupLegendProps) {
  return (
    <OptionGroupLegend {...rest}>
      <OptionGroupHeader>{children}</OptionGroupHeader>
    </OptionGroupLegend>
  );
}

RadioGroupLegend.displayName = "RadioGroup.Legend";

export function RadioGroupHint({ id, ...rest }: RadioGroupHintProps) {
  const { hintId } = useRadioGroupContext();
  return <OptionGroupHint id={id ?? hintId} {...rest} />;
}

RadioGroupHint.displayName = "RadioGroup.Hint";

export function RadioGroupError({ id, ...rest }: RadioGroupErrorProps) {
  const { errorId } = useRadioGroupContext();
  return <FieldError id={id ?? errorId} {...rest} />;
}

RadioGroupError.displayName = "RadioGroup.Error";

export const RadioGroupList = forwardRef<HTMLDivElement, RadioGroupListProps>(
  function RadioGroupList(props, ref) {
    return <OptionGroupList ref={ref} {...props} />;
  },
);

RadioGroupList.displayName = "RadioGroup.List";
