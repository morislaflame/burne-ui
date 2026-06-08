import type { HTMLAttributes, ReactNode } from "react";

import { FieldError } from "@/components/core/Field";

import { useComboBoxFieldContext } from "./comboBoxContext";

export type ComboBoxErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export function ComboBoxError({ children, className, id: idProp, ...rest }: ComboBoxErrorProps) {
  const field = useComboBoxFieldContext();
  return (
    <FieldError id={idProp ?? field.errorId} className={className} {...rest}>
      {children}
    </FieldError>
  );
}

ComboBoxError.displayName = "ComboBox.Error";
