import { Field } from "@/components/core/Field";
import type { LabelProps } from "@/components/core/Label";

import { useInputClassNames, useInputFieldContext } from "./inputContext";
import type { InputErrorProps, InputHintProps } from "./inputTypes";

import { cn } from "@/utils/cn";

export function InputLabel({ className, classNames, ...rest }: LabelProps) {
  const slotClassNames = useInputClassNames();

  return (
    <Field.Label
      className={className}
      classNames={{
        ...classNames,
        root: cn(slotClassNames.label, classNames?.root),
      }}
      {...rest}
    />
  );
}

InputLabel.displayName = "InputLabel";

export function InputHint({
  children,
  status,
  className,
  id: idProp,
  ...rest
}: InputHintProps) {
  const field = useInputFieldContext();
  const slotClassNames = useInputClassNames();
  const hintStatus =
    status ??
    (field.status === "danger"
      ? "default"
      : field.status === "default"
        ? "default"
        : field.status);

  return (
    <Field.Hint
      id={idProp ?? field.hintId}
      status={hintStatus}
      className={cn(slotClassNames.hint, className)}
      {...rest}
    >
      {children}
    </Field.Hint>
  );
}

InputHint.displayName = "InputHint";

export function InputError({
  children,
  className,
  id: idProp,
  ...rest
}: InputErrorProps) {
  const field = useInputFieldContext();
  const slotClassNames = useInputClassNames();

  return (
    <Field.Error
      id={idProp ?? field.errorId}
      className={cn(slotClassNames.error, className)}
      {...rest}
    >
      {children}
    </Field.Error>
  );
}

InputError.displayName = "InputError";
