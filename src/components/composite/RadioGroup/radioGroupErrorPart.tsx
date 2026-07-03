import { FieldError } from "@/components/core/Field";

import { useRadioGroupContext } from "./radioGroupContext";
import type { RadioGroupErrorProps } from "./radioGroupTypes";

export function RadioGroupError({ id, ...rest }: RadioGroupErrorProps) {
  const { errorId } = useRadioGroupContext();
  return <FieldError id={id ?? errorId} {...rest} />;
}

RadioGroupError.displayName = "RadioGroup.Error";
