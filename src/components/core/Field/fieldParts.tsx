import type { ElementType, ReactNode } from "react";
import { forwardRef, useMemo } from "react";

import { Label } from "@/components/core/Label";
import { Text } from "@/components/core/Text";

import { joinFieldDescribedBy } from "./fieldA11y";
import {
  resolveFieldMotionDefaults,
  useFieldSetSlotMotion,
  useFieldSlotMotion,
} from "./fieldAnimations";
import {
  FieldClassNamesProvider,
  FieldMotionProvider,
  FieldSetSizeProvider,
  useFieldClassNames,
  useFieldSetClassNames,
  useFieldSetSize,
  useOptionalFieldSize,
} from "./fieldContext";
import {
  FIELD_LEGEND_CLASS,
  FIELD_SET_CLASS,
  fieldHintClass,
  fieldHintVariant,
  fieldLabelVariant,
  fieldLegendHeaderClass,
  fieldRootClass,
  fieldSetActionsClass,
  fieldSetGroupClass,
  fieldSetStackClass,
  resolveFieldSize,
} from "./fieldStyles";
import type {
  FieldErrorProps,
  FieldHintProps,
  FieldLabelProps,
  FieldLegendHeaderProps,
  FieldLegendProps,
  FieldProps,
  FieldSetActionsProps,
  FieldSetGroupProps,
  FieldSetProps,
  UseFieldSetRootStateResult,
} from "./fieldTypes";

import { cn } from "@/utils/cn";

export function FieldRootShell({
  className,
  size: sizeProp,
  children,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...rest
}: Omit<FieldProps, "classNames" | "motion">) {
  const slotClassNames = useFieldClassNames();
  const inheritedSize = useOptionalFieldSize();
  const size = resolveFieldSize(sizeProp ?? inheritedSize ?? undefined);
  const part = useFieldSlotMotion<HTMLDivElement>("root", {
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <div
      ref={part.setRef}
      className={fieldRootClass({
        size,
        className,
        slotClass: slotClassNames.root,
      })}
      {...part.pointerHandlers}
      {...rest}
    >
      {children}
    </div>
  );
}

export function FieldRoot({ classNames, size, children, motion, ...rest }: FieldProps) {
  const motionDefaults = useMemo(() => resolveFieldMotionDefaults(), []);
  const content = (
    <FieldClassNamesProvider classNames={classNames}>
      <FieldMotionProvider motion={motion} defaults={motionDefaults}>
        <FieldRootShell size={size} {...rest}>
          {children}
        </FieldRootShell>
      </FieldMotionProvider>
    </FieldClassNamesProvider>
  );

  if (size == null) return content;

  return (
    <FieldSetSizeProvider size={resolveFieldSize(size)}>{content}</FieldSetSizeProvider>
  );
}

export const FieldHint = forwardRef<HTMLElement, FieldHintProps>(
  function FieldHint(
    {
      children,
      className,
      status = "default",
      as = "p",
      variant: variantProp,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useFieldClassNames();
    const size = useFieldSetSize();
    const variant = variantProp ?? fieldHintVariant(size);
    const part = useFieldSlotMotion<HTMLElement>("hint", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    return (
      <Text
        ref={part.setRef}
        as={as as ElementType}
        variant={variant}
        inheritColor={as === "span"}
        className={fieldHintClass({
          status,
          className,
          slotClass: slotClassNames.hint,
        })}
        {...part.pointerHandlers}
        {...rest}
      >
        {children}
      </Text>
    );
  },
);

FieldHint.displayName = "FieldHint";

export function FieldLabel({ variant: variantProp, ...rest }: FieldLabelProps) {
  const size = useFieldSetSize();
  const variant = variantProp ?? fieldLabelVariant(size);
  return <Label variant={variant} {...rest} />;
}

FieldLabel.displayName = "Field.Label";

export function FieldError({
  role = "alert",
  className,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...props
}: FieldErrorProps) {
  const slotClassNames = useFieldClassNames();
  const size = useFieldSetSize();
  const part = useFieldSlotMotion<HTMLElement>("error", {
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <Text
      ref={part.setRef}
      as="p"
      variant={fieldHintVariant(size)}
      role={role}
      className={fieldHintClass({
        status: "danger",
        className: cn(slotClassNames.error, className),
      })}
      {...part.pointerHandlers}
      {...props}
    />
  );
}

export const FieldLegend = forwardRef<HTMLLegendElement, FieldLegendProps>(
  function FieldLegend(
    {
      className,
      children,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useFieldSetClassNames();
    const part = useFieldSetSlotMotion<HTMLLegendElement>("legend", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    return (
      <legend
        ref={part.setRef}
        className={cn(
          FIELD_LEGEND_CLASS,
          slotClassNames.legend,
          className,
        )}
        {...part.pointerHandlers}
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
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...rest
}: FieldLegendHeaderProps) {
  const size = useFieldSetSize();
  const slotClassNames = useFieldSetClassNames();
  const part = useFieldSetSlotMotion<HTMLSpanElement>("legendHeader", {
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <span
      ref={part.setRef}
      className={fieldLegendHeaderClass({
        size,
        className,
        slotClass: slotClassNames.legendHeader,
      })}
      {...part.pointerHandlers}
      {...rest}
    >
      {children}
    </span>
  );
}

export const FieldSetGroup = forwardRef<HTMLDivElement, FieldSetGroupProps>(
  function FieldSetGroup(
    {
      className,
      children,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const size = useFieldSetSize();
    const slotClassNames = useFieldSetClassNames();
    const part = useFieldSetSlotMotion<HTMLDivElement>("group", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    return (
      <div
        ref={part.setRef}
        className={fieldSetGroupClass({
          size,
          className,
          slotClass: slotClassNames.group,
        })}
        {...part.pointerHandlers}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

FieldSetGroup.displayName = "FieldSetGroup";

export const FieldSetActions = forwardRef<HTMLDivElement, FieldSetActionsProps>(
  function FieldSetActions(
    {
      className,
      children,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const size = useFieldSetSize();
    const slotClassNames = useFieldSetClassNames();
    const part = useFieldSetSlotMotion<HTMLDivElement>("actions", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    return (
      <div
        ref={part.setRef}
        className={fieldSetActionsClass({
          size,
          className,
          slotClass: slotClassNames.actions,
        })}
        {...part.pointerHandlers}
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
  const part = useFieldSetSlotMotion<HTMLDivElement>("stack");
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
      ref={part.setRef}
      className={fieldSetStackClass({
        size,
        hasLegend: legend != null,
        slotClass: slotClassNames.stack,
      })}
      {...part.pointerHandlers}
    >
      {stack}
    </div>
  );
}

export const FieldSetRootInner = forwardRef<
  HTMLFieldSetElement,
  Omit<FieldSetProps, "classNames" | "size" | "children" | "motion"> & {
    state: UseFieldSetRootStateResult;
  }
>(function FieldSetRootInner(
  {
    className,
    hintId,
    errorId,
    disabled,
    state,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const slotClassNames = useFieldSetClassNames();
  const part = useFieldSetSlotMotion<HTMLFieldSetElement>("root", {
    forwardedRef: ref,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <fieldset
      ref={part.setRef}
      disabled={disabled}
      aria-describedby={joinFieldDescribedBy(hintId, errorId)}
      className={cn(
        FIELD_SET_CLASS,
        slotClassNames.root,
        className,
      )}
      {...part.pointerHandlers}
      {...rest}
    >
      {state.legend}
      <FieldSetStack {...state} />
    </fieldset>
  );
});

FieldSetRootInner.displayName = "FieldSetRootInner";
