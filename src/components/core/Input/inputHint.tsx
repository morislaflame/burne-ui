import type { HTMLAttributes, ReactNode } from "react";

import { FieldHint } from "@/components/core/Field";

import { useInputFieldContext } from "./inputFieldContext";
import type { InputStatus } from "./Input";

export type InputHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: Exclude<InputStatus, "danger"> | "default";
};

export function InputHint({ children, status, className, id: idProp, ...rest }: InputHintProps) {
  const field = useInputFieldContext();
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

InputHint.displayName = "InputHint";
