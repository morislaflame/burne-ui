import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { useMemo } from "react";

import { resolveMeterMotionDefaults } from "./meterAnimations";
import { MeterClassNamesProvider, MeterFieldProvider, MeterMotionProvider } from "./meterContext";
import { MeterSimpleBody } from "./meterParts";
import { meterRootClass } from "./meterStyles";
import type { MeterProps } from "./meterTypes";
import { useMeterRootState } from "./useMeterRootState";

export type {
  MeterClassNames,
  MeterErrorProps,
  MeterHeaderProps,
  MeterHintProps,
  MeterOrientation,
  MeterProps,
  MeterSize,
  MeterTrackProps,
  MeterValueProps,
  MeterMotion,
  MeterPartMotion,
} from "./meterTypes";

export {
  MeterError,
  MeterHeader,
  MeterHint,
  MeterLabel,
  MeterSimpleBody,
  MeterTrack,
  MeterValue,
} from "./meterParts";

export {
  useMeterFieldContext,
  useOptionalMeterFieldContext,
} from "./meterContext";

export function MeterRoot({
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
  min,
  max,
  size,
  thickness,
  color,
  formatValue,
  motion,
  ...divRest
}: MeterProps) {
  const state = useMeterRootState({
    children,
    id,
    orientation,
    label,
    showValue,
    valueText,
    hint,
    error,
    value,
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
    <MeterSimpleBody
      label={state.label}
      showValue={state.showValue}
      valueText={state.valueText}
      hint={state.hint}
      error={state.error}
      trackProps={state.trackProps}
    />
  );

  const motionDefaults = useMemo(() => resolveMeterMotionDefaults(), []);

  return (
    <MeterFieldProvider value={state.fieldCtx}>
      <MeterClassNamesProvider classNames={classNames}>
        <MeterMotionProvider motion={motion} defaults={motionDefaults}>
          <FieldLabelContext.Provider value={state.fieldLabelCtx}>
            <Field
              id={state.meterId}
              className={meterRootClass({
                orientation: state.fieldCtx.orientation,
                slotClass: classNames?.root,
                className,
              })}
              {...divRest}
            >
              {body}
            </Field>
          </FieldLabelContext.Provider>
        </MeterMotionProvider>
      </MeterClassNamesProvider>
    </MeterFieldProvider>
  );
}

MeterRoot.displayName = "Meter";
