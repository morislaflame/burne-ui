import { forwardRef, useMemo } from "react";
 
import { Checkbox } from "@/components/core/Checkbox";
import { FieldHiddenValues } from "@/components/core/utils/fieldFormDom";
import { FieldLabelContext } from "@/components/core/Label";
import { OptionGroupFieldset, type OptionGroupFieldsetProps } from "@/components/composite/utils/optionGroupFieldset";
 
import { itemsPartTaken } from "@/components/core/utils/itemsBesideChildren";

import { CHECKBOX_GROUP_USES_NATIVE_FIELDSET } from "./checkboxGroupA11y";
import { resolveCheckboxGroupMotionDefaults, useCheckboxGroupRootMotion } from "./checkboxGroupAnimations";
import {
  CheckboxGroupActions,
  CheckboxGroupError,
  CheckboxGroupHint,
  CheckboxGroupLegend,
  CheckboxGroupList,
} from "./checkboxGroupParts";
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
  CheckboxGroupActionsProps,
  CheckboxGroupMotion,
  CheckboxGroupPartMotion,
} from "./checkboxGroupTypes";
 
const CheckboxGroupFieldsetShell = forwardRef<HTMLFieldSetElement, Omit<OptionGroupFieldsetProps, "classNames">>(
  function CheckboxGroupFieldsetShell(
    {
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...props
    },
    ref,
  ) {
    const slotClassNames = useCheckboxGroupClassNames();
    const { selectedValue, selectedValues, selection, required, readOnly, name } = useCheckboxGroupContext();
    const part = useCheckboxGroupRootMotion({
      forwardedRef: ref,
      selectionIdentity: selection === "single" ? (selectedValue ?? "") : selectedValues.join("\u0000"),
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <OptionGroupFieldset
        ref={part.setRef}
        classNames={slotClassNames}
        {...props}
        {...part.pointerHandlers}
        aria-required={required || undefined}
        aria-readonly={readOnly || undefined}
        data-readonly={readOnly ? "" : undefined}
      >
        {props.children}
        <FieldHiddenValues
          name={name}
          value={selection === "single" ? (selectedValue ?? "") : selectedValues}
        />
      </OptionGroupFieldset>
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
      label,
      hint,
      error,
      items,
      disabled = false,
      name: _name,
      readOnly: _readOnly,
      required: _required,
      selectionMode: _selectionMode,
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      values: _values,
      defaultValues: _defaultValues,
      onValuesChange: _onValuesChange,
      motion,
      hintId: _hintId,
      errorId: _errorId,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      ...fieldsetProps
    } = props;
    const { contextValue, fieldLabelCtx, hintId, errorId } = useCheckboxGroupRootState(props);
    const motionDefaults = useMemo(() => resolveCheckboxGroupMotionDefaults(), []);
    const optionList =
      items && !itemsPartTaken("CheckboxGroup", children, "CheckboxRoot", "CheckboxGroup.List")
        ? items
        : undefined;
 
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
        {label != null ? <CheckboxGroupLegend>{label}</CheckboxGroupLegend> : null}
        {optionList ? (
          <CheckboxGroupList>
            {optionList.map((option) => (
              <Checkbox
                key={option.value}
                value={option.value}
                label={option.label}
                hint={option.hint}
                disabled={option.disabled}
              />
            ))}
          </CheckboxGroupList>
        ) : null}
        {hint != null ? <CheckboxGroupHint>{hint}</CheckboxGroupHint> : null}
        {error != null ? <CheckboxGroupError>{error}</CheckboxGroupError> : null}
        {children}
      </CheckboxGroupFieldsetShell>
    ) : null;
 
    return (
      <CheckboxGroupProvider value={contextValue}>
        <CheckboxGroupClassNamesProvider classNames={classNames}>
          <CheckboxGroupMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
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
 
export {
  CheckboxGroupLegend,
  CheckboxGroupHint,
  CheckboxGroupError,
  CheckboxGroupActions,
  CheckboxGroupList,
};
 