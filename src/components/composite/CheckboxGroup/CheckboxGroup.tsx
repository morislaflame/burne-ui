import { forwardRef, useMemo } from "react";

import { FieldLabelContext } from "@/components/core/Label";
import { OptionGroupFieldset, type OptionGroupFieldsetProps } from "@/components/composite/utils/optionGroupFieldset";

import { CHECKBOX_GROUP_USES_NATIVE_FIELDSET } from "./checkboxGroupA11y";
import { resolveCheckboxGroupMotionDefaults, useCheckboxGroupRootMotion } from "./checkboxGroupAnimations";
import { CheckboxGroupError, CheckboxGroupHint, CheckboxGroupLegend, CheckboxGroupList } from "./checkboxGroupParts";
import { CheckboxGroupClassNamesProvider, CheckboxGroupMotionProvider, CheckboxGroupProvider, useCheckboxGroupClassNames, useCheckboxGroupContext } from "./checkboxGroupContext";
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
  CheckboxGroupMotion,
  CheckboxGroupPartMotion,
} from "./checkboxGroupTypes";

const CheckboxGroupFieldsetShell = forwardRef<HTMLFieldSetElement, Omit<OptionGroupFieldsetProps, "classNames">>(
  function CheckboxGroupFieldsetShell(props, ref) {
    const slotClassNames = useCheckboxGroupClassNames();
    const { selectedValue } = useCheckboxGroupContext();
    const part = useCheckboxGroupRootMotion({
      forwardedRef: ref,
      selectionIdentity: selectedValue ?? "",
    });

    return (
      <OptionGroupFieldset
        ref={part.setRef}
        classNames={slotClassNames}
        {...props}
        {...part.pointerHandlers}
      />
    );
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
      motion,
      ...fieldsetProps
    } = props;
    const { contextValue, fieldLabelCtx, hintId, errorId } = useCheckboxGroupRootState(props);
    const motionDefaults = useMemo(() => resolveCheckboxGroupMotionDefaults(), []);

    const fieldset = CHECKBOX_GROUP_USES_NATIVE_FIELDSET ? (
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
    ) : null;

    return (
      <CheckboxGroupProvider value={contextValue}>
        <CheckboxGroupClassNamesProvider classNames={classNames}>
          <CheckboxGroupMotionProvider motion={motion} defaults={motionDefaults}>
            <FieldLabelContext.Provider value={fieldLabelCtx}>
              {fieldset}
            </FieldLabelContext.Provider>
          </CheckboxGroupMotionProvider>
        </CheckboxGroupClassNamesProvider>
      </CheckboxGroupProvider>
    );
  },
);

CheckboxGroupRoot.displayName = "CheckboxGroup";

export { CheckboxGroupLegend, CheckboxGroupHint, CheckboxGroupError, CheckboxGroupList };
