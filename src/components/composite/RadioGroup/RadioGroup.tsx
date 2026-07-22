import { forwardRef } from "react";

import { FieldLabelContext } from "@/components/core/Label";
import { OptionGroupFieldset, type OptionGroupFieldsetProps } from "@/components/composite/utils/optionGroupFieldset";

import { RADIO_GROUP_USES_NATIVE_FIELDSET } from "./radioGroupA11y";
import { RadioGroupClassNamesProvider, RadioGroupProvider, useRadioGroupClassNames } from "./radioGroupContext";
import { RadioGroupError, RadioGroupHint, RadioGroupLegend, RadioGroupList } from "./radioGroupParts";
import type { RadioGroupProps } from "./radioGroupTypes";
import { useRadioGroupRootState } from "./useRadioGroupRootState";

export type {
  RadioGroupProps,
  RadioGroupOrientation,
  RadioGroupClassNames,
  RadioGroupHintProps,
  RadioGroupLabelProps,
  RadioGroupLegendProps,
  RadioGroupListProps,
  RadioGroupErrorProps,
} from "./radioGroupTypes";

const RadioGroupFieldsetShell = forwardRef<HTMLFieldSetElement, Omit<OptionGroupFieldsetProps, "classNames">>(
  function RadioGroupFieldsetShell(props, ref) {
    const slotClassNames = useRadioGroupClassNames();

    return <OptionGroupFieldset ref={ref} classNames={slotClassNames} {...props} />;
  },
);

export const RadioGroupRoot = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  function RadioGroupRoot(props, ref) {
    const {
      children,
      className,
      classNames,
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

    const fieldset = RADIO_GROUP_USES_NATIVE_FIELDSET ? (
      <RadioGroupFieldsetShell
        ref={ref}
        disabled={disabled}
        hintId={hintId}
        errorId={errorId}
        size={size}
        className={className}
        {...fieldsetProps}
      >
        {children}
      </RadioGroupFieldsetShell>
    ) : null;

    return (
      <RadioGroupProvider value={contextValue}>
        <RadioGroupClassNamesProvider classNames={classNames}>
          <FieldLabelContext.Provider value={fieldLabelCtx}>
            {fieldset}
          </FieldLabelContext.Provider>
        </RadioGroupClassNamesProvider>
      </RadioGroupProvider>
    );
  },
);

RadioGroupRoot.displayName = "RadioGroup";

export { RadioGroupLegend, RadioGroupHint, RadioGroupError, RadioGroupList };
