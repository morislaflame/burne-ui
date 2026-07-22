import type { HTMLAttributes, ReactNode } from "react";

import { Field } from "@/components/core/Field";
import { Label } from "@/components/core/Label";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { SLIDER_SCALE_HEADER_BASE_CLASS, SLIDER_SCALE_HEADER_HORIZONTAL_CLASS, SLIDER_SCALE_HEADER_VERTICAL_CLASS, SLIDER_SCALE_VALUE_CLASS } from "./sliderStyles";
import type { SliderOrientation } from "./sliderTypes";

export type SliderScaleFieldHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  orientation?: SliderOrientation;
};

export function SliderScaleFieldHeader({
  children,
  className,
  orientation = "horizontal",
  ...rest
}: SliderScaleFieldHeaderProps) {
  return (
    <div
      className={cn(
        SLIDER_SCALE_HEADER_BASE_CLASS,
        orientation === "horizontal"
          ? SLIDER_SCALE_HEADER_HORIZONTAL_CLASS
          : SLIDER_SCALE_HEADER_VERTICAL_CLASS,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export type SliderScaleFieldValueProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  fallback?: ReactNode;
};

export function SliderScaleFieldValue({
  children,
  fallback,
  className,
  ...rest
}: SliderScaleFieldValueProps) {
  const text = children ?? fallback;
  if (text == null) return null;
  return (
    <Text as="span" variant="base" className={cn(SLIDER_SCALE_VALUE_CLASS, className)} {...rest}>
      {text}
    </Text>
  );
}

export type SliderSimpleLayoutParts = {
  Header: (props: { children?: ReactNode }) => ReactNode;
  Value: (props: { children?: ReactNode }) => ReactNode;
};

export type SliderSimpleLayoutProps = SliderSimpleLayoutParts & {
  label?: ReactNode;
  labelClassName?: string;
  showValue?: boolean;
  valueText?: ReactNode;
  hint?: ReactNode;
  hintId?: string;
  error?: ReactNode;
  errorId?: string;
  track: ReactNode;
};

/** Simple mode layout for Slider. */
export function renderSliderSimpleLayout({
  label,
  labelClassName,
  showValue,
  valueText,
  hint,
  hintId,
  error,
  errorId,
  Header,
  Value,
  track,
}: SliderSimpleLayoutProps) {
  const showHeader = label != null || showValue || valueText != null;

  return (
    <>
      {showHeader ? (
        <Header>
          {label != null ? (
            <Label classNames={labelClassName ? { root: labelClassName } : undefined}>
              {label}
            </Label>
          ) : null}
          {valueText != null ? (
            <Value>{valueText}</Value>
          ) : showValue ? (
            <Value />
          ) : null}
        </Header>
      ) : null}
      {track}
      {hint != null ? <Field.Hint id={hintId}>{hint}</Field.Hint> : null}
      {error != null ? <Field.Error id={errorId}>{error}</Field.Error> : null}
    </>
  );
}
