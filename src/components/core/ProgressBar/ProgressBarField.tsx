import { useCallback, useId, useMemo, useState, type HTMLAttributes, type ReactNode } from "react";

import { FieldError, FieldHint, FieldRoot } from "@/components/core/Field";
import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { FieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import {
  renderScaleSimpleLayout,
  ScaleFieldHeader,
  ScaleFieldValue,
  scaleFieldRootClassName,
} from "@/components/core/utils/scaleFieldParts";

import { ProgressBarTrack, type ProgressBarTrackProps } from "./ProgressBar";
import type { ProgressBarOrientation } from "./ProgressBar";
import {
  ProgressBarFieldContext,
  type ProgressBarDisplayState,
  useProgressBarFieldContext,
} from "./progressBarFieldContext";

function progressBarDisplayEqual(
  a: ProgressBarDisplayState | null,
  b: ProgressBarDisplayState | null,
) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  return (
    a.clampedValue === b.clampedValue &&
    a.statusText === b.statusText &&
    a.min === b.min &&
    a.max === b.max &&
    a.indeterminate === b.indeterminate
  );
}

export type ProgressBarRootProps = HTMLAttributes<HTMLDivElement> &
  Partial<ProgressBarTrackProps> & {
    children?: ReactNode;
    id?: string;
    orientation?: ProgressBarOrientation;
    label?: ReactNode;
    showValue?: boolean;
    valueText?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
  };

export function ProgressBarRoot({
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
  indeterminate,
  min,
  max,
  size,
  thickness,
  color,
  formatValue,
  ...divRest
}: ProgressBarRootProps) {
  const autoId = useId();
  const progressId = idProp ?? `progress-${autoId}`;
  const hintId = fieldHintId(progressId);
  const errorId = fieldErrorId(progressId);
  const labelId = `${progressId}-label`;
  const [display, setDisplayState] = useState<ProgressBarDisplayState | null>(null);
  const setDisplay = useCallback((next: ProgressBarDisplayState | null) => {
    setDisplayState((prev) => (progressBarDisplayEqual(prev, next) ? prev : next));
  }, []);

  const isCompound = hasCompoundChildren(children);
  const hasHint = hint != null || (isCompound && hasCompoundChild(children, ProgressBarHint));
  const hasError = error != null || (isCompound && hasCompoundChild(children, ProgressBarError));

  const contextValue = useMemo(
    () => ({
      progressId,
      hintId,
      errorId,
      hintConnected: hasHint,
      errorConnected: hasError,
      orientation,
      display,
      setDisplay,
    }),
    [display, errorId, hasError, hasHint, hintId, orientation, progressId, setDisplay],
  );
  const trackProps = {
    value,
    indeterminate,
    min,
    max,
    size,
    thickness,
    color,
    formatValue,
    orientation,
  };

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
        Header: ProgressBarHeader,
        Value: ProgressBarValue,
        track: <ProgressBarTrack {...trackProps} />,
      });

  return (
    <ProgressBarFieldContext.Provider value={contextValue}>
      <FieldLabelContext.Provider value={{ labelId }}>
        <FieldRoot
          id={progressId}
          className={scaleFieldRootClassName(orientation, className)}
          {...divRest}
        >
          {body}
        </FieldRoot>
      </FieldLabelContext.Provider>
    </ProgressBarFieldContext.Provider>
  );
}

export type ProgressBarHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function ProgressBarHeader({ children, className, ...rest }: ProgressBarHeaderProps) {
  const { orientation } = useProgressBarFieldContext();
  return (
    <ScaleFieldHeader orientation={orientation} className={className} {...rest}>
      {children}
    </ScaleFieldHeader>
  );
}

export type ProgressBarValueProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export function ProgressBarValue({ children, className, ...rest }: ProgressBarValueProps) {
  const { display } = useProgressBarFieldContext();
  return (
    <ScaleFieldValue fallback={display?.statusText} className={className} {...rest}>
      {children}
    </ScaleFieldValue>
  );
}

export type ProgressBarHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export function ProgressBarHint({ children, className, id: idProp, ...rest }: ProgressBarHintProps) {
  const ctx = useProgressBarFieldContext();
  return (
    <FieldHint id={idProp ?? ctx.hintId} className={className} {...rest}>
      {children}
    </FieldHint>
  );
}

export type ProgressBarErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export function ProgressBarError({ children, className, id: idProp, ...rest }: ProgressBarErrorProps) {
  const ctx = useProgressBarFieldContext();
  return (
    <FieldError id={idProp ?? ctx.errorId} className={className} {...rest}>
      {children}
    </FieldError>
  );
}

ProgressBarHeader.displayName = "ProgressBar.Header";
ProgressBarValue.displayName = "ProgressBar.Value";
ProgressBarHint.displayName = "ProgressBar.Hint";
ProgressBarError.displayName = "ProgressBar.Error";
