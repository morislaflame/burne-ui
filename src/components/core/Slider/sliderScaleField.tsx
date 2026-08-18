import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { SLIDER_SCALE_HEADER_BASE_CLASS, SLIDER_SCALE_HEADER_HORIZONTAL_CLASS, SLIDER_SCALE_HEADER_VERTICAL_CLASS, SLIDER_SCALE_VALUE_CLASS } from "./sliderStyles";
import type { SliderOrientation } from "./sliderTypes";

export type SliderScaleFieldHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  orientation?: SliderOrientation;
};

export const SliderScaleFieldHeader = forwardRef<HTMLDivElement, SliderScaleFieldHeaderProps>(
  function SliderScaleFieldHeader(
    { children, className, orientation = "horizontal", ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
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
  },
);

SliderScaleFieldHeader.displayName = "SliderScaleFieldHeader";

export type SliderScaleFieldValueProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  fallback?: ReactNode;
};

export const SliderScaleFieldValue = forwardRef<HTMLElement, SliderScaleFieldValueProps>(
  function SliderScaleFieldValue({ children, fallback, className, ...rest }, ref) {
    const text = children ?? fallback;
    if (text == null) return null;
    return (
      <Text
        ref={ref}
        as="span"
        variant="base"
        className={cn(SLIDER_SCALE_VALUE_CLASS, className)}
        {...rest}
      >
        {text}
      </Text>
    );
  },
);

SliderScaleFieldValue.displayName = "SliderScaleFieldValue";

export type SliderSimpleLayoutParts = {
  Header: (props: { children?: ReactNode }) => ReactNode;
  Value: (props: { children?: ReactNode }) => ReactNode;
};

export type SliderSimpleLayoutProps = SliderSimpleLayoutParts & {
  label?: ReactNode;
  labelNode?: ReactNode;
  showValue?: boolean;
  valueText?: ReactNode;
  hintNode?: ReactNode;
  errorNode?: ReactNode;
  track: ReactNode;
};

/** Simple mode layout for Slider. */
export function renderSliderSimpleLayout({
  label,
  labelNode,
  showValue,
  valueText,
  hintNode,
  errorNode,
  Header,
  Value,
  track,
}: SliderSimpleLayoutProps) {
  const showHeader = label != null || showValue || valueText != null;

  return (
    <>
      {showHeader ? (
        <Header>
          {labelNode}
          {valueText != null ? (
            <Value>{valueText}</Value>
          ) : showValue ? (
            <Value />
          ) : null}
        </Header>
      ) : null}
      {track}
      {hintNode}
      {errorNode}
    </>
  );
}
