import { Label } from "@/components/core/Label";

import {
  TimeFieldControl,
  TimeFieldError,
  TimeFieldHint,
  TimeFieldRoot,
} from "./TimeField";

export const TimeField = Object.assign(TimeFieldRoot, {
  Label,
  Control: TimeFieldControl,
  Hint: TimeFieldHint,
  Error: TimeFieldError,
});

export {
  TimeFieldControl,
  TimeFieldHint,
  TimeFieldError,
  TimeFieldRoot,
} from "./TimeField";

export type {
  TimeFieldRootProps,
  TimeFieldControlProps,
  TimeFieldHintProps,
  TimeFieldErrorProps,
  TimeFieldSize,
  TimeFieldStatus,
  TimeFieldVariant,
  TimeFieldFormat,
} from "./TimeField";
