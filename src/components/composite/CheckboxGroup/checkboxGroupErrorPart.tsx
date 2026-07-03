import { FieldError } from "@/components/core/Field";

import { useCheckboxGroupContext } from "./checkboxGroupContext";
import type { CheckboxGroupErrorProps } from "./checkboxGroupTypes";

export function CheckboxGroupError({ id, ...rest }: CheckboxGroupErrorProps) {
  const { errorId } = useCheckboxGroupContext();
  return <FieldError id={id ?? errorId} {...rest} />;
}

CheckboxGroupError.displayName = "CheckboxGroup.Error";
