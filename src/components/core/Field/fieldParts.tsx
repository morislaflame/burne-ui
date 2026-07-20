import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";

import { Label } from "@/components/core/Label";
import { Text } from "@/components/core/Text";

import { joinFieldDescribedBy } from "./fieldA11y";
import {
  FieldClassNamesProvider,
  useFieldClassNames,
  useFieldSetClassNames,
  useFieldSetSize,
} from "./fieldContext";
import {
  FIELD_LEGEND_CLASS,
  FIELD_LEGEND_HEADER_CLASS,
  FIELD_ROOT_CLASS,
  FIELD_SET_CLASS,
  fieldHintClass,
  fieldSetActionsClass,
  fieldSetGroupClass,
  fieldSetStackClass,
} from "./fieldStyles";
import type {
  FieldErrorProps,
  FieldHintProps,
  FieldLegendHeaderProps,
  FieldLegendProps,
  FieldRootProps,
  FieldSetActionsProps,
  FieldSetGroupProps,
  FieldSetProps,
} from "./fieldTypes";
import type { UseFieldSetRootStateResult } from "./fieldTypes";

import { cn } from "@/utils/cn";

export function FieldRootShell({
  className,
  children,
  ...rest
}: Omit<FieldRootProps, "classNames">) {
  const slotClassNames = useFieldClassNames();

  return (
    <div
      className={cn(
        FIELD_ROOT_CLASS,
        slotClassNames.root,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function FieldRoot({ classNames, ...rest }: FieldRootProps) {
  return (
    <FieldClassNamesProvider classNames={classNames}>
      <FieldRootShell {...rest} />
    </FieldClassNamesProvider>
  );
}

export function FieldHint({
  children,
  className,
  status = "default",
  as = "p",
  variant = "small",
  ...rest
}: FieldHintProps) {
  const slotClassNames = useFieldClassNames();

  return (
    <Text
      as={as as ElementType}
      variant={variant}
      inheritColor={as === "span"}
      className={fieldHintClass({
        status,
        className,
        slotClass: slotClassNames.hint,
      })}
      {...rest}
    >
      {children}
    </Text>
  );
}

export const FieldLabel = Label;

export function FieldError({ role = "alert", className, ...props }: FieldErrorProps) {
  const slotClassNames = useFieldClassNames();

  return (
    <FieldHint
      status="danger"
      role={role}
      className={cn(slotClassNames.error, className)}
      {...props}
    />
  );
}

export const FieldLegend = forwardRef<HTMLLegendElement, FieldLegendProps>(
  function FieldLegend({ className, children, ...rest }, ref) {
    const slotClassNames = useFieldSetClassNames();

    return (
      <legend
        ref={ref}
        className={cn(
          FIELD_LEGEND_CLASS,
          slotClassNames.legend,
          className,
        )}
        {...rest}
      >
        {children}
      </legend>
    );
  },
);

FieldLegend.displayName = "FieldLegend";

export function FieldLegendHeader({
  children,
  className,
  ...rest
}: FieldLegendHeaderProps) {
  const slotClassNames = useFieldSetClassNames();

  return (
    <span
      className={cn(
        FIELD_LEGEND_HEADER_CLASS,
        slotClassNames.legendHeader,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

export const FieldSetGroup = forwardRef<HTMLDivElement, FieldSetGroupProps>(
  function FieldSetGroup({ className, children, ...rest }, ref) {
    const size = useFieldSetSize();
    const slotClassNames = useFieldSetClassNames();

    return (
      <div
        ref={ref}
        className={fieldSetGroupClass({
          size,
          className,
          slotClass: slotClassNames.group,
        })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

FieldSetGroup.displayName = "FieldSetGroup";

export const FieldSetActions = forwardRef<HTMLDivElement, FieldSetActionsProps>(
  function FieldSetActions({ className, children, ...rest }, ref) {
    const size = useFieldSetSize();
    const slotClassNames = useFieldSetClassNames();

    return (
      <div
        ref={ref}
        className={fieldSetActionsClass({
          size,
          className,
          slotClass: slotClassNames.actions,
        })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

FieldSetActions.displayName = "FieldSetActions";

export function FieldSetStack({
  legend,
  loose,
  groups,
  actions,
}: UseFieldSetRootStateResult) {
  const size = useFieldSetSize();
  const slotClassNames = useFieldSetClassNames();
  const stack: ReactNode[] = [];

  if (groups.length > 0) {
    stack.push(...loose, ...groups);
  } else if (loose.length > 0) {
    stack.push(
      <FieldSetGroup key="field-set-group">{loose}</FieldSetGroup>,
    );
  }

  if (actions != null) {
    stack.push(actions);
  }

  if (stack.length === 0) return null;

  return (
    <div
      className={fieldSetStackClass({
        size,
        hasLegend: legend != null,
        slotClass: slotClassNames.stack,
      })}
    >
      {stack}
    </div>
  );
}

export const FieldSetRootInner = forwardRef<
  HTMLFieldSetElement,
  Omit<FieldSetProps, "classNames" | "size" | "children"> & {
    state: UseFieldSetRootStateResult;
  }
>(function FieldSetRootInner(
  { className, hintId, errorId, disabled, state, ...rest },
  ref,
) {
  const slotClassNames = useFieldSetClassNames();

  return (
    <fieldset
      ref={ref}
      disabled={disabled}
      aria-describedby={joinFieldDescribedBy(hintId, errorId)}
      className={cn(
        FIELD_SET_CLASS,
        slotClassNames.set,
        className,
      )}
      {...rest}
    >
      {state.legend}
      <FieldSetStack {...state} />
    </fieldset>
  );
});

FieldSetRootInner.displayName = "FieldSetRootInner";
