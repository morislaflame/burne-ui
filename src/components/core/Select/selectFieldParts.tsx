import { Field } from "@/components/core/Field";
import { Label, type LabelProps } from "@/components/core/Label";

import { selectResolveHintStatus } from "./selectAPI";
import { useSelectClassNames, useSelectFieldContext } from "./selectContext";
import type { SelectErrorProps, SelectHintProps } from "./selectTypes";

import { cn } from "@/utils/cn";

export function SelectLabel({ className, classNames, ...rest }: LabelProps) {
  const slotClassNames = useSelectClassNames();

  return (
    <Label
      className={className}
      classNames={{
        ...classNames,
        root: cn(slotClassNames.label, classNames?.root),
      }}
      {...rest}
    />
  );
}

SelectLabel.displayName = "SelectLabel";

export function SelectHint({
  children,
  status,
  className,
  id: idProp,
  ...rest
}: SelectHintProps) {
  const field = useSelectFieldContext();
  const slotClassNames = useSelectClassNames();
  const hintStatus = selectResolveHintStatus(status, field.status);

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

SelectHint.displayName = "SelectHint";

export function SelectError({
  children,
  className,
  id: idProp,
  ...rest
}: SelectErrorProps) {
  const field = useSelectFieldContext();
  const slotClassNames = useSelectClassNames();

  return (
    <Field.Error
      id={idProp ?? field.errorId}
      className={cn(slotClassNames.error, className)}
      {...rest}
    >
      {children ?? field.errorMessage}
    </Field.Error>
  );
}

SelectError.displayName = "Select.Error";
