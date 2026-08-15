import { forwardRef } from "react";

import { createOptionGroupErrorPart, createOptionGroupHintPart, createOptionGroupLegendPart } from "@/components/composite/utils/optionGroupParts";
import { cn } from "@/utils/cn";

import { useCheckboxGroupListMotion } from "./checkboxGroupAnimations";
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
  function CheckboxGroupList(
    {
      className,
      orientation = "vertical",
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClass = useCheckboxGroupClassNames().list;
    const part = useCheckboxGroupListMotion({
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
    return (
      <div
        ref={part.setRef}
        className={checkboxGroupListClass(orientation, cn(slotClass, className))}
        {...part.pointerHandlers}
        {...rest}
      />
    );
  },
);

CheckboxGroupList.displayName = "CheckboxGroup.List";
