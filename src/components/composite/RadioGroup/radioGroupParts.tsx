import { forwardRef } from "react";

import { createOptionGroupErrorPart, createOptionGroupHintPart, createOptionGroupLegendPart } from "@/components/composite/utils/optionGroupParts";
import { cn } from "@/utils/cn";

import { useRadioGroupClassNames, useRadioGroupContext } from "./radioGroupContext";
import { radioGroupListClass } from "./radioGroupStyles";
import type { RadioGroupListProps } from "./radioGroupTypes";

export const RadioGroupLegend = createOptionGroupLegendPart("RadioGroup.Legend");

export const RadioGroupHint = createOptionGroupHintPart(
  () => useRadioGroupContext().hintId,
  () => useRadioGroupClassNames().hint,
  "RadioGroup.Hint",
);

export const RadioGroupError = createOptionGroupErrorPart(
  () => useRadioGroupContext().errorId,
  () => useRadioGroupClassNames().error,
  "RadioGroup.Error",
);

export const RadioGroupList = forwardRef<HTMLDivElement, RadioGroupListProps>(
  function RadioGroupList({ className, orientation = "vertical", ...rest }, ref) {
    const slotClass = useRadioGroupClassNames().list;
    return (
      <div
        ref={ref}
        className={radioGroupListClass(orientation, cn(slotClass, className))}
        {...rest}
      />
    );
  },
);

RadioGroupList.displayName = "RadioGroup.List";
