import { forwardRef, type FieldsetHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";

import { Field, type FieldSetProps } from "@/components/core/Field";
import { cn } from "@/utils/cn";

import { OPTION_GROUP_ORIENTATION_LAYOUT, type OptionGroupOrientation } from "./optionGroupLayout";

export type { OptionGroupOrientation };

export type OptionGroupFieldsetProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children"
> &
  Pick<FieldSetProps, "hintId" | "errorId" | "size" | "classNames"> & {
    children?: ReactNode;
  };

export const OptionGroupFieldset = forwardRef<HTMLFieldSetElement, OptionGroupFieldsetProps>(
  function OptionGroupFieldset({ size = "small", ...props }, ref) {
    return <Field.Set ref={ref} size={size} {...props} />;
  },
);

export type OptionGroupLegendProps = HTMLAttributes<HTMLLegendElement>;

export const OptionGroupLegend = forwardRef<HTMLLegendElement, OptionGroupLegendProps>(
  function OptionGroupLegend({ children, ...rest }, ref) {
    return (
      <Field.Legend ref={ref} {...rest}>
        {children}
      </Field.Legend>
    );
  },
);

OptionGroupLegend.displayName = "OptionGroupLegend";

export const OptionGroupGroup = Field.Set.Group;
export const OptionGroupActions = Field.Set.Actions;

export type OptionGroupHintProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  id?: string;
};

export function OptionGroupHint({ children, className, id, ...rest }: OptionGroupHintProps) {
  return (
    <Field.Hint as="span" variant="small" id={id} className={className} {...rest}>
      {children}
    </Field.Hint>
  );
}

export type OptionGroupHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

/** Wrapper for `Label` + `Hint` inside `Legend`. */
export function OptionGroupHeader({ children, className, ...rest }: OptionGroupHeaderProps) {
  return (
    <Field.LegendHeader className={className} {...rest}>
      {children}
    </Field.LegendHeader>
  );
}

export type OptionGroupListProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: OptionGroupOrientation;
};

export const OptionGroupList = forwardRef<HTMLDivElement, OptionGroupListProps>(
  function OptionGroupList({ className, orientation = "vertical", children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn("text-left", OPTION_GROUP_ORIENTATION_LAYOUT[orientation], className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
