import type { HTMLAttributes, ReactNode } from "react";

import { FieldHint } from "@/components/core/Field";

import { useTextAreaFieldContext } from "./textareaFieldContext";
import type { TextAreaStatus } from "./TextArea";

export type TextAreaHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: Exclude<TextAreaStatus, "danger"> | "default";
};

export function TextAreaHint({ children, status, className, id: idProp, ...rest }: TextAreaHintProps) {
  const field = useTextAreaFieldContext();
  const hintStatus =
    status ??
    (field.status === "danger"
      ? "default"
      : field.status === "default"
        ? "default"
        : field.status);

  return (
    <FieldHint id={idProp ?? field.hintId} status={hintStatus} className={className} {...rest}>
      {children}
    </FieldHint>
  );
}

TextAreaHint.displayName = "TextAreaHint";
