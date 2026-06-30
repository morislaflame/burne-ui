import { FieldRoot } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";

import {
  ProgressBarClassNamesProvider,
  ProgressBarFieldProvider,
} from "./progressBarContext";
import { ProgressBarSimpleBody } from "./progressBarParts";
import { progressBarRootClass } from "./progressBarStyles";
import type { ProgressBarRootProps } from "./progressBarTypes";
import { useProgressBarRootState } from "./useProgressBarRootState";

export type {
  ProgressBarClassNames,
  ProgressBarErrorProps,
  ProgressBarHeaderProps,
  ProgressBarHintProps,
  ProgressBarOrientation,
  ProgressBarRootProps,
  ProgressBarSize,
  ProgressBarTrackProps,
  ProgressBarValueProps,
} from "./progressBarTypes";

export {
  ProgressBarError,
  ProgressBarHeader,
  ProgressBarHint,
  ProgressBarSimpleBody,
  ProgressBarTrack,
  ProgressBarValue,
} from "./progressBarParts";

export {
  useProgressBarFieldContext,
  useOptionalProgressBarFieldContext,
} from "./progressBarContext";

export function ProgressBarRoot({
  children,
  className,
  classNames,
  id,
  orientation,
  label,
  showValue,
  valueText,
  hint,
  error,
  value,
  indeterminate,
  min,
  max,
  size,
  thickness,
  color,
  formatValue,
  ...divRest
}: ProgressBarRootProps) {
  const state = useProgressBarRootState({
    children,
    id,
    orientation,
    label,
    showValue,
    valueText,
    hint,
    error,
    value,
    indeterminate,
    min,
    max,
    size,
    thickness,
    color,
    formatValue,
  });

  const body = state.isCompound ? (
    children
  ) : (
    <ProgressBarSimpleBody
      label={state.label}
      showValue={state.showValue}
      valueText={state.valueText}
      hint={state.hint}
      error={state.error}
      trackProps={state.trackProps}
    />
  );

  return (
    <ProgressBarFieldProvider value={state.fieldCtx}>
      <ProgressBarClassNamesProvider classNames={classNames}>
        <FieldLabelContext.Provider value={state.fieldLabelCtx}>
          <FieldRoot
            id={state.progressId}
            className={progressBarRootClass({
              orientation: state.fieldCtx.orientation,
              slotClass: classNames?.root,
              className,
            })}
            {...divRest}
          >
            {body}
          </FieldRoot>
        </FieldLabelContext.Provider>
      </ProgressBarClassNamesProvider>
    </ProgressBarFieldProvider>
  );
}

ProgressBarRoot.displayName = "ProgressBar";
