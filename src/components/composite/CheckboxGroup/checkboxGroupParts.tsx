import { forwardRef } from "react";

import { FieldError } from "@/components/core/Field";
import {
  OptionGroupHeader,
  OptionGroupHint,
  OptionGroupLegend,
  OptionGroupList,
} from "@/components/composite/utils/optionGroupFieldset";

import { useCheckboxGroupContext } from "./checkboxGroupContext";
import type {
  CheckboxGroupErrorProps,
  CheckboxGroupHintProps,
  CheckboxGroupLegendProps,
  CheckboxGroupListProps,
} from "./checkboxGroupTypes";

export function CheckboxGroupLegend({ children, ...rest }: CheckboxGroupLegendProps) {
  return (
    <OptionGroupLegend {...rest}>
      <OptionGroupHeader>{children}</OptionGroupHeader>
    </OptionGroupLegend>
  );
}

CheckboxGroupLegend.displayName = "CheckboxGroup.Legend";

export function CheckboxGroupHint({ id, ...rest }: CheckboxGroupHintProps) {
  const { hintId } = useCheckboxGroupContext();
  return <OptionGroupHint id={id ?? hintId} {...rest} />;
}

CheckboxGroupHint.displayName = "CheckboxGroup.Hint";

export function CheckboxGroupError({ id, ...rest }: CheckboxGroupErrorProps) {
  const { errorId } = useCheckboxGroupContext();
  return <FieldError id={id ?? errorId} {...rest} />;
}

CheckboxGroupError.displayName = "CheckboxGroup.Error";

export const CheckboxGroupList = forwardRef<HTMLDivElement, CheckboxGroupListProps>(
  function CheckboxGroupList(props, ref) {
    return <OptionGroupList ref={ref} {...props} />;
  },
);

CheckboxGroupList.displayName = "CheckboxGroup.List";
