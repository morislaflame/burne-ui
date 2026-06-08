import { useCallback, useId, useMemo, useState, type HTMLAttributes, type ReactNode } from "react";

import { FieldError, FieldHint, FieldRoot } from "@/components/core/Field";
import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { FieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import {
  ScaleFieldHeader,
  ScaleFieldValue,
} from "@/components/core/utils/scaleFieldParts";
import { renderScaleSimpleLayout } from "@/components/core/utils/scaleFieldLayout";
import { scaleFieldRootClassName } from "@/components/core/utils/scaleFieldRootClassName";

import { MeterTrack, type MeterTrackProps } from "./Meter";
import type { MeterOrientation } from "./Meter";
import {
  MeterFieldContext,
  type MeterDisplayState,
  useMeterFieldContext,
} from "./meterFieldContext";

function meterDisplayEqual(a: MeterDisplayState | null, b: MeterDisplayState | null) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  return (
    a.clampedValue === b.clampedValue &&
    a.statusText === b.statusText &&
    a.min === b.min &&
    a.max === b.max
  );
}

export type MeterRootProps = HTMLAttributes<HTMLDivElement> &
  Partial<MeterTrackProps> & {
    children?: ReactNode;
    id?: string;
    orientation?: MeterOrientation;
    label?: ReactNode;
    showValue?: boolean;
    valueText?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
  };

export function MeterRoot({
  children,
  className,
  id: idProp,
  orientation = "horizontal",
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
  ...divRest
}: MeterRootProps) {
  const autoId = useId();
  const meterId = idProp ?? `meter-${autoId}`;
  const hintId = fieldHintId(meterId);
  const errorId = fieldErrorId(meterId);
  const labelId = `${meterId}-label`;
  const [display, setDisplayState] = useState<MeterDisplayState | null>(null);
  const setDisplay = useCallback((next: MeterDisplayState | null) => {
    setDisplayState((prev) => (meterDisplayEqual(prev, next) ? prev : next));
  }, []);

  const isCompound = hasCompoundChildren(children);
  const hasHint = hint != null || (isCompound && hasCompoundChild(children, MeterHint));
  const hasError = error != null || (isCompound && hasCompoundChild(children, MeterError));

  const contextValue = useMemo(
    () => ({
      meterId,
      hintId,
      errorId,
      hintConnected: hasHint,
      errorConnected: hasError,
      orientation,
      display,
      setDisplay,
    }),
    [display, errorId, hasError, hasHint, hintId, meterId, orientation, setDisplay],
  );

  const trackProps = { value, min, max, size, thickness, color, formatValue, orientation };

  const body = isCompound
    ? children
    : renderScaleSimpleLayout({
        label,
        showValue,
        valueText,
        hint,
        hintId: hasHint ? hintId : undefined,
        error,
        errorId: hasError ? errorId : undefined,
        Header: MeterHeader,
        Value: MeterValue,
        track:
          value != null ? <MeterTrack {...trackProps} value={value} /> : null,
      });

  return (
    <MeterFieldContext.Provider value={contextValue}>
      <FieldLabelContext.Provider value={{ labelId }}>
        <FieldRoot
          id={meterId}
          className={scaleFieldRootClassName(orientation, className)}
          {...divRest}
        >
          {body}
        </FieldRoot>
      </FieldLabelContext.Provider>
    </MeterFieldContext.Provider>
  );
}

export type MeterHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function MeterHeader({ children, className, ...rest }: MeterHeaderProps) {
  const { orientation } = useMeterFieldContext();
  return (
    <ScaleFieldHeader orientation={orientation} className={className} {...rest}>
      {children}
    </ScaleFieldHeader>
  );
}

export type MeterValueProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export function MeterValue({ children, className, ...rest }: MeterValueProps) {
  const { display } = useMeterFieldContext();
  return (
    <ScaleFieldValue fallback={display?.statusText} className={className} {...rest}>
      {children}
    </ScaleFieldValue>
  );
}

export type MeterHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export function MeterHint({ children, className, id: idProp, ...rest }: MeterHintProps) {
  const ctx = useMeterFieldContext();
  return (
    <FieldHint id={idProp ?? ctx.hintId} className={className} {...rest}>
      {children}
    </FieldHint>
  );
}

MeterHint.displayName = "MeterHint";

export type MeterErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export function MeterError({ children, className, id: idProp, ...rest }: MeterErrorProps) {
  const ctx = useMeterFieldContext();
  return (
    <FieldError id={idProp ?? ctx.errorId} className={className} {...rest}>
      {children}
    </FieldError>
  );
}

MeterError.displayName = "MeterError";
