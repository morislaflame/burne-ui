import { InputControl } from "./inputControlParts";
import { useInputClassNames } from "./inputContext";
import { InputError, InputHint, InputLabel } from "./inputFieldParts";
import type { InputSimpleBodyProps } from "./inputTypes";
 
export function InputSimpleBody({
  label,
  hint,
  error,
  inputId,
  labelId,
  size,
  controlProps,
  inputRef,
}: InputSimpleBodyProps) {
  const slotClassNames = useInputClassNames();
 
  return (
    <>
      {label != null ? (
        <InputLabel id={labelId} classNames={{ root: slotClassNames.label }}>
          {label}
        </InputLabel>
      ) : null}
      <InputControl ref={inputRef} id={inputId} size={size} {...controlProps} />
      {hint != null ? <InputHint>{hint}</InputHint> : null}
      {error != null ? <InputError>{error}</InputError> : null}
    </>
  );
}
 