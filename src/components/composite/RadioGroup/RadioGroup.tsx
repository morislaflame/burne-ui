import { forwardRef } from "react";

import { FieldLabelContext } from "@/components/core/Label";
import { OptionGroupFieldset } from "@/components/composite/utils/optionGroupFieldset";

import { RadioGroupProvider } from "./radioGroupContext";
import { RadioGroupError, RadioGroupHint, RadioGroupLegend, RadioGroupList } from "./radioGroupParts";
import type { RadioGroupProps } from "./radioGroupTypes";
import { useRadioGroupRootState } from "./useRadioGroupRootState";

export type {
  RadioGroupProps,
  RadioGroupOrientation,
  RadioGroupHintProps,
  RadioGroupLabelProps,
  RadioGroupLegendProps,
  RadioGroupListProps,
  RadioGroupErrorProps,
} from "./radioGroupTypes";

export const RadioGroupRoot = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  function RadioGroupRoot(props, ref) {
    const {
      children,
      className,
      size,
      disabled = false,
      name: _name,
      required: _required,
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      hintId: _hintId,
      errorId: _errorId,
      ...fieldsetProps
    } = props;
    const { contextValue, fieldLabelCtx, hintId, errorId } = useRadioGroupRootState(props);

    return (
      <RadioGroupProvider value={contextValue}>
        <FieldLabelContext.Provider value={fieldLabelCtx}>
          <OptionGroupFieldset
            ref={ref}
            disabled={disabled}
            hintId={hintId}
            errorId={errorId}
            size={size}
            className={className}
            {...fieldsetProps}
          >
            {children}
          </OptionGroupFieldset>
        </FieldLabelContext.Provider>
      </RadioGroupProvider>
    );
  },
);

RadioGroupRoot.displayName = "RadioGroup";

export { RadioGroupLegend, RadioGroupHint, RadioGroupError, RadioGroupList };
