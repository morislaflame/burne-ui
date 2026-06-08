import type { HTMLAttributes, ReactNode } from "react";

import { FieldError } from "@/components/core/Field";

import { useInputFieldContext } from "./inputFieldContext";

export type InputErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export function InputError({ children, className, id: idProp, ...rest }: InputErrorProps) {
  const field = useInputFieldContext();
  return (
    <FieldError id={idProp ?? field.errorId} className={className} {...rest}>
      {children}
    </FieldError>
  );
}

InputError.displayName = "InputError";
