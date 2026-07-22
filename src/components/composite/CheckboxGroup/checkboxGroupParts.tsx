import { forwardRef } from "react";

import { createOptionGroupErrorPart, createOptionGroupHintPart, createOptionGroupLegendPart } from "@/components/composite/utils/optionGroupParts";
import { cn } from "@/utils/cn";

import { useCheckboxGroupClassNames, useCheckboxGroupContext } from "./checkboxGroupContext";
import { checkboxGroupListClass } from "./checkboxGroupStyles";
import type { CheckboxGroupListProps } from "./checkboxGroupTypes";

export const CheckboxGroupLegend = createOptionGroupLegendPart("CheckboxGroup.Legend");

export const CheckboxGroupHint = createOptionGroupHintPart(
  () => useCheckboxGroupContext().hintId,
  () => useCheckboxGroupClassNames().hint,
  "CheckboxGroup.Hint",
);

export const CheckboxGroupError = createOptionGroupErrorPart(
  () => useCheckboxGroupContext().errorId,
  () => useCheckboxGroupClassNames().error,
  "CheckboxGroup.Error",
);

export const CheckboxGroupList = forwardRef<HTMLDivElement, CheckboxGroupListProps>(
  function CheckboxGroupList({ className, orientation = "vertical", ...rest }, ref) {
    const slotClass = useCheckboxGroupClassNames().list;
    return (
      <div
        ref={ref}
        className={checkboxGroupListClass(orientation, cn(slotClass, className))}
        {...rest}
      />
    );
  },
);

CheckboxGroupList.displayName = "CheckboxGroup.List";
