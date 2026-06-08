import type { HTMLAttributes, ReactNode } from "react";

import { FieldHint } from "@/components/core/Field";
import type { InputStatus } from "@/components/core/Input";

import { useComboBoxFieldContext } from "./comboBoxContext";

export type ComboBoxHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: Exclude<InputStatus, "danger"> | "default";
};

export function ComboBoxHint({
  children,
  status,
  className,
  id: idProp,
  ...rest
}: ComboBoxHintProps) {
  const field = useComboBoxFieldContext();
  const hintStatus =
    status ??
    (field.status === "danger"
      ? "default"
      : field.status === "default"
        ? "default"
        : field.status);

  return (
    <FieldHint
      id={idProp ?? field.hintId}
      status={hintStatus}
      className={className}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

ComboBoxHint.displayName = "ComboBoxHint";
