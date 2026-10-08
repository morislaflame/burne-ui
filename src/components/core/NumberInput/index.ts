import { NumberInputRoot } from "./NumberInput";
import {
  NumberInputControl,
  NumberInputDecrement,
  NumberInputError,
  NumberInputHint,
  NumberInputIncrement,
  NumberInputLabel,
} from "./numberInputParts";

export const NumberInput = Object.assign(NumberInputRoot, {
  Label: NumberInputLabel,
  Decrement: NumberInputDecrement,
  Control: NumberInputControl,
  Increment: NumberInputIncrement,
  Hint: NumberInputHint,
  Error: NumberInputError,
});

export type {
  NumberInputClassNames,
  NumberInputControlProps,
  NumberInputErrorProps,
  NumberInputHintProps,
  NumberInputLabelProps,
  NumberInputMotion,
  NumberInputPartMotion,
  NumberInputProps,
  NumberInputStepperProps,
} from "./numberInputTypes";
