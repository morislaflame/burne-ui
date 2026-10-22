import { PinInputRoot } from "./PinInput";
import {
  PinInputError,
  PinInputControl,
  PinInputShell,
  PinInputHint,
  PinInputLabel,
} from "./pinInputParts";

export const PinInput = Object.assign(PinInputRoot, {
  Label: PinInputLabel,
  Shell: PinInputShell,
  Control: PinInputControl,
  Hint: PinInputHint,
  Error: PinInputError,
});

export type {
  PinInputClassNames,
  PinInputErrorProps,
  PinInputControlProps,
  PinInputShellProps,
  PinInputHintProps,
  PinInputLabelProps,
  PinInputMotion,
  PinInputPartMotion,
  PinInputProps,
  PinInputSize,
  PinInputVariant,
  PinInputType,
} from "./pinInputTypes";
