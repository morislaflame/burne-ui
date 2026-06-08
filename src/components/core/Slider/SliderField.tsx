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

import { SliderTrack, type SliderRangeProps, type SliderSingleProps, type SliderTrackProps } from "./Slider";
import type { SliderOrientation } from "./Slider";
import {
  SliderFieldContext,
  type SliderDisplayState,
  useSliderFieldContext,
} from "./sliderFieldContext";

function sliderDisplayEqual(a: SliderDisplayState | null, b: SliderDisplayState | null) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  return (
    a.valueLabel === b.valueLabel &&
    a.min === b.min &&
    a.max === b.max &&
    a.range === b.range &&
    a.singleValue === b.singleValue &&
    a.rangeValue[0] === b.rangeValue[0] &&
    a.rangeValue[1] === b.rangeValue[1] &&
    a.label === b.label
  );
}

type SliderRootLayoutProps = {
  children?: ReactNode;
  id?: string;
  orientation?: SliderOrientation;
  label?: ReactNode;
  showValue?: boolean;
  valueText?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
};

export type SliderRootProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "value"> &
  SliderRootLayoutProps &
  (
    | Partial<Omit<SliderSingleProps, "orientation" | "className">>
    | Partial<Omit<SliderRangeProps, "orientation" | "className">>
  );

export function SliderRoot({
  children,
  className,
  id: idProp,
  orientation = "horizontal",
  label,
  showValue,
  valueText,
  hint,
  error,
  range,
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step,
  marks,
  size,
  thickness,
  formatValue,
  icon,
  disabled,
  ariaLabel,
  ...divRest
}: SliderRootProps) {
  const autoId = useId();
  const sliderId = idProp ?? `slider-${autoId}`;
  const hintId = fieldHintId(sliderId);
  const errorId = fieldErrorId(sliderId);
  const labelId = `${sliderId}-label`;
  const [display, setDisplayState] = useState<SliderDisplayState | null>(null);
  const setDisplay = useCallback((next: SliderDisplayState | null) => {
    setDisplayState((prev) => (sliderDisplayEqual(prev, next) ? prev : next));
  }, []);

  const isCompound = hasCompoundChildren(children);
  const hasHint = hint != null || (isCompound && hasCompoundChild(children, SliderHint));
  const hasError = error != null || (isCompound && hasCompoundChild(children, SliderError));

  const contextValue = useMemo(
    () => ({
      sliderId,
      labelId,
      hintId,
      errorId,
      hintConnected: hasHint,
      errorConnected: hasError,
      orientation,
      display,
      setDisplay,
    }),
    [display, errorId, hasError, hasHint, hintId, labelId, orientation, setDisplay, sliderId],
  );

  const trackProps = {
    range,
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    step,
    marks,
    size,
    thickness,
    formatValue,
    icon,
    disabled,
    ariaLabel,
    orientation,
  } as SliderTrackProps;

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
        Header: SliderHeader,
        Value: SliderValue,
        track: <SliderTrack {...trackProps} />,
      });

  const fieldLabelCtx = useMemo(() => ({ labelId, isRequired: false as const }), [labelId]);

  return (
    <SliderFieldContext.Provider value={contextValue}>
      <FieldLabelContext.Provider value={fieldLabelCtx}>
        <FieldRoot
          id={sliderId}
          className={scaleFieldRootClassName(orientation, className)}
          {...divRest}
        >
          {body}
        </FieldRoot>
      </FieldLabelContext.Provider>
    </SliderFieldContext.Provider>
  );
}

export type SliderHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function SliderHeader({ children, className, ...rest }: SliderHeaderProps) {
  const { orientation } = useSliderFieldContext();
  return (
    <ScaleFieldHeader orientation={orientation} className={className} {...rest}>
      {children}
    </ScaleFieldHeader>
  );
}

export type SliderValueProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export function SliderValue({ children, className, ...rest }: SliderValueProps) {
  const { display } = useSliderFieldContext();
  return (
    <ScaleFieldValue fallback={display?.valueLabel} className={className} {...rest}>
      {children}
    </ScaleFieldValue>
  );
}

export type SliderHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export function SliderHint({ children, className, id: idProp, ...rest }: SliderHintProps) {
  const ctx = useSliderFieldContext();
  return (
    <FieldHint id={idProp ?? ctx.hintId} className={className} {...rest}>
      {children}
    </FieldHint>
  );
}

export type SliderErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export function SliderError({ children, className, id: idProp, ...rest }: SliderErrorProps) {
  const ctx = useSliderFieldContext();
  return (
    <FieldError id={idProp ?? ctx.errorId} className={className} {...rest}>
      {children}
    </FieldError>
  );
}

SliderRoot.displayName = "Slider";
SliderHeader.displayName = "Slider.Header";
SliderValue.displayName = "Slider.Value";
SliderHint.displayName = "Slider.Hint";
SliderError.displayName = "Slider.Error";
