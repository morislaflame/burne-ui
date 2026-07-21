import { forwardRef, type FieldsetHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";

import { FieldLegend, FieldLegendHeader, FieldSetRoot, FieldSetActions, FieldSetGroup, type FieldSetProps } from "@/components/core/Field";
import { FieldHint } from "@/components/core/Field";
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
    return <FieldSetRoot ref={ref} size={size} {...props} />;
  },
);

export type OptionGroupLegendProps = HTMLAttributes<HTMLLegendElement>;

export const OptionGroupLegend = forwardRef<HTMLLegendElement, OptionGroupLegendProps>(
  function OptionGroupLegend({ children, ...rest }, ref) {
    return (
      <FieldLegend ref={ref} {...rest}>
        {children}
      </FieldLegend>
    );
  },
);

OptionGroupLegend.displayName = "OptionGroupLegend";

export { FieldSetGroup as OptionGroupGroup, FieldSetActions as OptionGroupActions };

export type OptionGroupHintProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  id?: string;
};

export function OptionGroupHint({ children, className, id, ...rest }: OptionGroupHintProps) {
  return (
    <FieldHint as="span" variant="small" id={id} className={className} {...rest}>
      {children}
    </FieldHint>
  );
}

export type OptionGroupHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

/** Wrapper for `Label` + `Hint` inside `Legend`. */
export function OptionGroupHeader({ children, className, ...rest }: OptionGroupHeaderProps) {
  return (
    <FieldLegendHeader className={className} {...rest}>
      {children}
    </FieldLegendHeader>
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
