import { PinInputRoot } from "./PinInput";
import { PinInputError, PinInputGroup, PinInputHint, PinInputLabel } from "./pinInputParts";

export const PinInput = Object.assign(PinInputRoot, {
  Label: PinInputLabel,
  Group: PinInputGroup,
  Hint: PinInputHint,
  Error: PinInputError,
});

export type {
  PinInputClassNames,
  PinInputErrorProps,
  PinInputGroupProps,
  PinInputHintProps,
  PinInputLabelProps,
  PinInputMotion,
  PinInputPartMotion,
  PinInputProps,
  PinInputType,
} from "./pinInputTypes";
