import { forwardRef, useMemo } from "react";

import { FieldLabelContext } from "@/components/core/Label";
import { OptionGroupFieldset, type OptionGroupFieldsetProps } from "@/components/composite/utils/optionGroupFieldset";

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

const RadioGroupFieldsetShell = forwardRef<HTMLFieldSetElement, Omit<OptionGroupFieldsetProps, "classNames">>(
  function RadioGroupFieldsetShell(
    {
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...props
    },
    ref,
  ) {
    const slotClassNames = useRadioGroupClassNames();
    const { selectedValue } = useRadioGroupContext();
    const part = useRadioGroupRootMotion({
      forwardedRef: ref,
      selectionIdentity: selectedValue ?? "",
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
      />
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
      disabled = false,
      name: _name,
      required: _required,
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      hintId: _hintId,
      errorId: _errorId,
      motion,
      ...fieldsetProps
    } = props;
    const { contextValue, fieldLabelCtx, hintId, errorId } = useRadioGroupRootState(props);
    const motionDefaults = useMemo(() => resolveRadioGroupMotionDefaults(), []);

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
          <RadioGroupMotionProvider motion={motion} defaults={motionDefaults}>
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
