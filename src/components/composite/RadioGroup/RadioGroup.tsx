import { Children, forwardRef, isValidElement, useMemo, type ReactNode } from "react";
 
import { Radio } from "@/components/core/Radio";
import { FieldLabelContext } from "@/components/core/Label";
import { OptionGroupFieldset, type OptionGroupFieldsetProps } from "@/components/composite/utils/optionGroupFieldset";
 
import { itemsPartTaken } from "@/components/core/utils/itemsBesideChildren";

import { RADIO_GROUP_USES_NATIVE_FIELDSET } from "./radioGroupA11y";
import { resolveRadioGroupMotionDefaults, useRadioGroupRootMotion } from "./radioGroupAnimations";
import {
  RadioGroupClassNamesProvider,
  RadioGroupMotionProvider,
  RadioGroupProvider,
  useRadioGroupClassNames,
  useRadioGroupContext,
} from "./radioGroupContext";
import {
  RadioGroupActions,
  RadioGroupError,
  RadioGroupHint,
  RadioGroupLegend,
  RadioGroupList,
} from "./radioGroupParts";
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
  RadioGroupActionsProps,
  RadioGroupMotion,
  RadioGroupPartMotion,
} from "./radioGroupTypes";
 
function radioGroupLegendLabelledBy(children: ReactNode, legendId: string): string | undefined {
  const legend = Children.toArray(children).find(
    (child) =>
      isValidElement(child) &&
      (child.type as { displayName?: string }).displayName === "RadioGroup.Legend",
  );
  if (!isValidElement(legend)) return undefined;
  const id = (legend.props as { id?: string }).id;
  return id ?? legendId;
}

const RadioGroupFieldsetShell = forwardRef<HTMLFieldSetElement, Omit<OptionGroupFieldsetProps, "classNames">>(
  function RadioGroupFieldsetShell(
    {
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      children,
      ...props
    },
    ref,
  ) {
    const slotClassNames = useRadioGroupClassNames();
    const { selectedValue, required, readOnly, legendId } = useRadioGroupContext();
    const part = useRadioGroupRootMotion({
      forwardedRef: ref,
      selectionIdentity: selectedValue ?? "",
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
    const legendLabel = radioGroupLegendLabelledBy(children, legendId);
    const labelledBy =
      props["aria-labelledby"] ??
      (props["aria-label"] == null ? legendLabel : undefined);

    return (
      <OptionGroupFieldset
        ref={part.setRef}
        classNames={slotClassNames}
        {...props}
        {...part.pointerHandlers}
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-required={required || undefined}
        aria-readonly={readOnly || undefined}
        data-readonly={readOnly ? "" : undefined}
      >
        {children}
      </OptionGroupFieldset>
    );
  },
);
 
export const RadioGroupRoot = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  function RadioGroupRoot(props, ref) {
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
      readOnly: _readOnly,
      name: _name,
      required: _required,
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      hintId: _hintId,
      errorId: _errorId,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      ...fieldsetProps
    } = props;
    const { contextValue, fieldLabelCtx, hintId, errorId } = useRadioGroupRootState(props);
    const motionDefaults = useMemo(() => resolveRadioGroupMotionDefaults(), []);
    const optionList =
      items && !itemsPartTaken("RadioGroup", children, "RadioRoot", "RadioGroup.List") ? items : undefined;
 
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
        {label != null ? <RadioGroupLegend>{label}</RadioGroupLegend> : null}
        {optionList ? (
          <RadioGroupList>
            {optionList.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                label={option.label}
                hint={option.hint}
                disabled={option.disabled}
              />
            ))}
          </RadioGroupList>
        ) : null}
        {hint != null ? <RadioGroupHint>{hint}</RadioGroupHint> : null}
        {error != null ? <RadioGroupError>{error}</RadioGroupError> : null}
        {children}
      </RadioGroupFieldsetShell>
    ) : null;
 
    return (
      <RadioGroupProvider value={contextValue}>
        <RadioGroupClassNamesProvider classNames={classNames}>
          <RadioGroupMotionProvider
            motion={motion}
            defaults={motionDefaults}
            controller={motionController}
            motionState={motionState}
            motionPayload={motionPayload}
            playInitialState={playInitialState}
          >
            <FieldLabelContext.Provider value={fieldLabelCtx}>
              {fieldset}
            </FieldLabelContext.Provider>
          </RadioGroupMotionProvider>
        </RadioGroupClassNamesProvider>
      </RadioGroupProvider>
    );
  },
);
 
RadioGroupRoot.displayName = "RadioGroup";
 
export {
  RadioGroupLegend,
  RadioGroupHint,
  RadioGroupError,
  RadioGroupActions,
  RadioGroupList,
};
 