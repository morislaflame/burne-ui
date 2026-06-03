import { InputControl, type InputProps, type InputSize, type InputStatus, type InputVariant } from "./Input";
import { Label } from "@/components/core/Label";
import { InputError, InputHint, InputRoot } from "./InputField";

export const Input = Object.assign(InputRoot, {
  Label,
  Control: InputControl,
  Hint: InputHint,
  Error: InputError,
});

export type {
  InputProps,
  InputSize,
  InputStatus,
  InputVariant,
};

export type { InputRootProps, InputHintProps, InputErrorProps, InputSimpleProps } from "./InputField";
