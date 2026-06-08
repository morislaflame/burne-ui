import { forwardRef, type FieldsetHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";

import {
  FieldLegend,
  FieldLegendHeader,
  FieldSetRoot,
  FieldSetActions,
  FieldSetGroup,
  useFieldSetErrorId,
  useFieldSetHintId,
} from "@/components/core/Field/FieldSet";
import { FieldHint } from "@/components/core/Field";
import { cn } from "@/utils/cn";

import {
  OPTION_GROUP_ORIENTATION_LAYOUT,
  type OptionGroupOrientation,
} from "./optionGroupLayout";

export type { OptionGroupOrientation };

export type OptionGroupFieldsetProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children"
> & {
  children?: ReactNode;
  /** id для `aria-describedby` у поля; задаётся корнем группы. */
  hintId?: string;
  errorId?: string;
  isRequired?: boolean;
};

export const OptionGroupFieldset = forwardRef<HTMLFieldSetElement, OptionGroupFieldsetProps>(
  function OptionGroupFieldset(props, ref) {
    return <FieldSetRoot ref={ref} {...props} />;
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

/** @deprecated Используйте `Label` из `@/components/core/Label`. */
export { Label as OptionGroupLabel, type LabelProps as OptionGroupLabelProps } from "@/components/core/Label";

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

/** Обёртка для `Label` + `Hint` внутри `Legend`. */
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

/** @deprecated Используйте `useFieldSetHintId` из `@/components/core/Field`. */
export function useOptionGroupHintId(providedId?: string) {
  return useFieldSetHintId(providedId);
}

/** @deprecated Используйте `useFieldSetErrorId` из `@/components/core/Field`. */
export function useOptionGroupErrorId(providedId?: string) {
  return useFieldSetErrorId(providedId);
}
