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
  InputLabelProps,
  InputControlProps,
  InputProps,
  InputSimpleProps,
  InputSize,
  InputVariant,
  InputMotion,
  InputPartMotion,
} from "./inputTypes";
 