import type { HTMLAttributes, ReactNode } from "react";

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
  labelClassName?: string;
  showValue?: boolean;
  valueText?: ReactNode;
  hint?: ReactNode;
  hintId?: string;
  error?: ReactNode;
  errorId?: string;
  track: ReactNode;
};

