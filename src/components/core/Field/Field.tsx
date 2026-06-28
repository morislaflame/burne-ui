import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { Label, type LabelProps } from "@/components/core/Label";
import { Text, type TextVariant } from "@/components/core/Text";
import { cn } from "@/utils/cn";

export type FieldHintStatus = "default" | "danger" | "success" | "warning";

const STATUS_HINT: Record<FieldHintStatus, string> = {
  default: "text-muted",
  danger: "text-danger",
  success: "text-success",
  warning: "text-warning",
};

export type FieldRootProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function FieldRoot({ className, children, ...rest }: FieldRootProps) {
  return (
    <div className={cn("flex w-full flex-col gap-xsmall", className)} {...rest}>
      {children}
    </div>
  );
}

export type FieldHintProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  status?: FieldHintStatus;
  as?: "p" | "span";
  variant?: TextVariant;
};

export function FieldHint({
  children,
  className,
  status = "default",
  as = "p",
  variant = "small",
  ...rest
}: FieldHintProps) {
  return (
    <Text
      as={as as ElementType}
      variant={variant}
      inheritColor={as === "span"}
      className={cn(STATUS_HINT[status], className)}
      {...rest}
    >
      {children}
    </Text>
  );
}

export type FieldLabelProps = LabelProps;

export const FieldLabel = Label;

export type FieldErrorProps = Omit<FieldHintProps, "status">;

export function FieldError({ role = "alert", ...props }: FieldErrorProps) {
  return <FieldHint status="danger" role={role} {...props} />;
}
