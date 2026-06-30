import { Label } from "@/components/core/Label";

import { InputControl, InputError, InputHint, InputRoot } from "./Input";

export const Input = Object.assign(InputRoot, {
  Label,
  Control: InputControl,
  Hint: InputHint,
  Error: InputError,
});

export type {
  InputClassNames,
  InputErrorProps,
  InputHintProps,
  InputProps,
  InputRootProps,
  InputSimpleProps,
  InputSize,
  InputStatus,
  InputVariant,
} from "./inputTypes";

export { InputControl, InputError, InputHint } from "./Input";
