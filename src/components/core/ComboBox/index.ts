import { Label } from "@/components/core/Label";

import {
  ComboBoxError,
  ComboBoxHint,
  ComboBoxInput,
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxRoot,
  ComboBoxTrigger,
} from "./ComboBox";

export const ComboBox = Object.assign(ComboBoxRoot, {
  Label,
  InputGroup: ComboBoxInputGroup,
  Input: ComboBoxInput,
  Trigger: ComboBoxTrigger,
  Popover: ComboBoxPopover,
  Hint: ComboBoxHint,
  Error: ComboBoxError,
});

export type { ComboBoxOption } from "./comboBoxTypes";

export type {
  ComboBoxRootProps,
  ComboBoxSimpleProps,
  ComboBoxHintProps,
  ComboBoxErrorProps,
  ComboBoxInputGroupProps,
  ComboBoxInputProps,
  ComboBoxTriggerProps,
  ComboBoxPopoverProps,
  ComboBoxClassNames,
} from "./comboBoxTypes";

export { comboBoxFilteredValues } from "./comboBoxAPI";
