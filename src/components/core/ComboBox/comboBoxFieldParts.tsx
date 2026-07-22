import { Field } from "@/components/core/Field";
import { Label, type LabelProps } from "@/components/core/Label";

import { comboBoxResolveHintStatus } from "./comboBoxA11y";
import { useComboBoxClassNames, useComboBoxFieldContext } from "./comboBoxContext";
import type { ComboBoxErrorProps, ComboBoxHintProps } from "./comboBoxTypes";

import { cn } from "@/utils/cn";

export function ComboBoxLabel({ className, classNames, ...rest }: LabelProps) {
  const slotClassNames = useComboBoxClassNames();

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

ComboBoxLabel.displayName = "ComboBoxLabel";

export function ComboBoxHint({
  children,
  status,
  className,
  id: idProp,
  ...rest
}: ComboBoxHintProps) {
  const field = useComboBoxFieldContext();
  const slotClassNames = useComboBoxClassNames();
  const hintStatus = comboBoxResolveHintStatus(status, field.status);

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

ComboBoxHint.displayName = "ComboBoxHint";

export function ComboBoxError({
  children,
  className,
  id: idProp,
  ...rest
}: ComboBoxErrorProps) {
  const field = useComboBoxFieldContext();
  const slotClassNames = useComboBoxClassNames();

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

ComboBoxError.displayName = "ComboBoxError";
