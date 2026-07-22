import { Label } from "@/components/core/Label";

import { InputControl } from "./inputControlParts";
import { useInputClassNames } from "./inputContext";
import { InputError, InputHint } from "./inputFieldParts";
import type { InputSimpleBodyProps } from "./inputTypes";

export function InputSimpleBody({
  label,
  hint,
  error,
  inputId,
  labelId,
  size,
  status,
  controlProps,
}: InputSimpleBodyProps) {
  const slotClassNames = useInputClassNames();

  return (
    <>
      {label != null ? (
        <Label id={labelId} classNames={{ root: slotClassNames.label }}>
          {label}
        </Label>
      ) : null}
      <InputControl id={inputId} size={size} status={status} {...controlProps} />
      {hint != null ? <InputHint>{hint}</InputHint> : null}
      {error != null ? <InputError>{error}</InputError> : null}
    </>
  );
}
