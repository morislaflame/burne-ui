import { forwardRef } from "react";

import { FieldLabelContext } from "@/components/core/Label";
import { OptionGroupFieldset, type OptionGroupFieldsetProps } from "@/components/composite/utils/optionGroupFieldset";

import { CheckboxGroupError, CheckboxGroupHint, CheckboxGroupLegend, CheckboxGroupList } from "./checkboxGroupParts";
import { CheckboxGroupClassNamesProvider, CheckboxGroupProvider, useCheckboxGroupClassNames } from "./checkboxGroupContext";
import type { CheckboxGroupProps } from "./checkboxGroupTypes";
import { useCheckboxGroupRootState } from "./useCheckboxGroupRootState";

export type {
  CheckboxGroupProps,
  CheckboxGroupSelection,
  CheckboxGroupOrientation,
  CheckboxGroupClassNames,
  CheckboxGroupHintProps,
  CheckboxGroupLabelProps,
  CheckboxGroupLegendProps,
  CheckboxGroupListProps,
  CheckboxGroupErrorProps,
} from "./checkboxGroupTypes";

const CheckboxGroupFieldsetShell = forwardRef<HTMLFieldSetElement, Omit<OptionGroupFieldsetProps, "classNames">>(
  function CheckboxGroupFieldsetShell(props, ref) {
    const slotClassNames = useCheckboxGroupClassNames();

    return <OptionGroupFieldset ref={ref} classNames={slotClassNames} {...props} />;
  },
);

export const CheckboxGroupRoot = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  function CheckboxGroupRoot(props, ref) {
    const {
      children,
      className,
      classNames,
      size,
      disabled = false,
      required: _required,
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
        <CheckboxGroupClassNamesProvider classNames={classNames}>
          <FieldLabelContext.Provider value={fieldLabelCtx}>
            <CheckboxGroupFieldsetShell
              ref={ref}
              disabled={disabled}
              hintId={hintId}
              errorId={errorId}
              size={size}
              className={className}
              {...fieldsetProps}
            >
              {children}
            </CheckboxGroupFieldsetShell>
          </FieldLabelContext.Provider>
        </CheckboxGroupClassNamesProvider>
      </CheckboxGroupProvider>
    );
  },
);

CheckboxGroupRoot.displayName = "CheckboxGroup";

export { CheckboxGroupLegend, CheckboxGroupHint, CheckboxGroupError, CheckboxGroupList };
