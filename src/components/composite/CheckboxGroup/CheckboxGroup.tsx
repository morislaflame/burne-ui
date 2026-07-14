import { forwardRef } from "react";

import { FieldLabelContext } from "@/components/core/Label";
import { OptionGroupFieldset } from "@/components/composite/utils/optionGroupFieldset";

import {
  CheckboxGroupError,
  CheckboxGroupHint,
  CheckboxGroupLegend,
  CheckboxGroupList,
} from "./checkboxGroupParts";
import { CheckboxGroupProvider } from "./checkboxGroupContext";
import type { CheckboxGroupProps } from "./checkboxGroupTypes";
import { useCheckboxGroupRootState } from "./useCheckboxGroupRootState";

export type {
  CheckboxGroupProps,
  CheckboxGroupSelection,
  CheckboxGroupOrientation,
  CheckboxGroupHintProps,
  CheckboxGroupLabelProps,
  CheckboxGroupLegendProps,
  CheckboxGroupListProps,
  CheckboxGroupErrorProps,
} from "./checkboxGroupTypes";

export const CheckboxGroupRoot = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  function CheckboxGroupRoot(props, ref) {
    const {
      children,
      className,
      size,
      disabled = false,
      isRequired: _isRequired,
      selection: _selection,
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      hintId: _hintId,
      errorId: _errorId,
      ...fieldsetProps
    } = props;
    const { contextValue, fieldLabelCtx, hintId, errorId } = useCheckboxGroupRootState(props);

    return (
      <CheckboxGroupProvider value={contextValue}>
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
      </CheckboxGroupProvider>
    );
  },
);

CheckboxGroupRoot.displayName = "CheckboxGroup";

export { CheckboxGroupLegend, CheckboxGroupHint, CheckboxGroupError, CheckboxGroupList };
