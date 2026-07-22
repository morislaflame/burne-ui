import { InputControl, InputError, InputHint, InputLabel, InputRoot } from "./Input";

export const Input = Object.assign(InputRoot, {
  Label: InputLabel,
  Control: InputControl,
  Hint: InputHint,
  Error: InputError,
});

export type {
  InputClassNames,
  InputErrorProps,
  InputHintProps,
  InputControlProps,
  InputProps,
  InputSimpleProps,
  InputSize,
  InputStatus,
  InputVariant,
} from "./inputTypes";

export { InputControl, InputError, InputHint } from "./Input";
