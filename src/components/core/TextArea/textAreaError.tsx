import type { HTMLAttributes, ReactNode } from "react";

import { FieldError } from "@/components/core/Field";

import { useTextAreaFieldContext } from "./textareaFieldContext";

export type TextAreaErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export function TextAreaError({ children, className, id: idProp, ...rest }: TextAreaErrorProps) {
  const field = useTextAreaFieldContext();
  return (
    <FieldError id={idProp ?? field.errorId} className={className} {...rest}>
      {children}
    </FieldError>
  );
}

TextAreaError.displayName = "TextAreaError";
