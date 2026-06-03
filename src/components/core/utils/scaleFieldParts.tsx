import type { HTMLAttributes, ReactNode } from "react";

import { FieldError, FieldHint } from "@/components/core/Field";
import { Label } from "@/components/core/Label";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

export type ScaleOrientation = "horizontal" | "vertical";

export type ScaleFieldHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  orientation?: ScaleOrientation;
};

export function ScaleFieldHeader({
  children,
  className,
  orientation = "horizontal",
  ...rest
}: ScaleFieldHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-xsmall",
        orientation === "horizontal" ? "w-full" : "min-w-[8rem]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export type ScaleFieldValueProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  fallback?: ReactNode;
};

export function ScaleFieldValue({ children, fallback, className, ...rest }: ScaleFieldValueProps) {
  const text = children ?? fallback;
  if (text == null) return null;
  return (
    <Text as="span" variant="base" className={cn("tabular-nums text-muted", className)} {...rest}>
      {text}
    </Text>
  );
}

export type ScaleSimpleLayoutParts = {
  Header: (props: { children?: ReactNode }) => ReactNode;
  Value: (props: { children?: ReactNode }) => ReactNode;
};

export type ScaleSimpleLayoutProps = ScaleSimpleLayoutParts & {
  label?: ReactNode;
  showValue?: boolean;
  valueText?: ReactNode;
  hint?: ReactNode;
  hintId?: string;
  error?: ReactNode;
  errorId?: string;
  track: ReactNode;
};

/** Разметка simple mode для Meter / ProgressBar / Slider. */
export function renderScaleSimpleLayout({
  label,
  showValue,
  valueText,
  hint,
  hintId,
  error,
  errorId,
  Header,
  Value,
  track,
}: ScaleSimpleLayoutProps) {
  const showHeader = label != null || showValue || valueText != null;

  return (
    <>
      {showHeader ? (
        <Header>
          {label != null ? <Label>{label}</Label> : null}
          {valueText != null ? (
            <Value>{valueText}</Value>
          ) : showValue ? (
            <Value />
          ) : null}
        </Header>
      ) : null}
      {track}
      {hint != null ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      {error != null ? <FieldError id={errorId}>{error}</FieldError> : null}
    </>
  );
}

export function scaleFieldRootClassName(
  orientation: ScaleOrientation,
  className?: string,
) {
  return cn(
    orientation === "horizontal" ? "w-full" : "w-auto items-center",
    className,
  );
}
