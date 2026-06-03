import { Label } from "@/components/core/Label";

import {
  ComboBoxInput,
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxTrigger,
  type ComboBoxOption,
} from "./ComboBox";
import { ComboBoxError, ComboBoxHint, ComboBoxRoot } from "./ComboBoxField";

export const ComboBox = Object.assign(ComboBoxRoot, {
  Label,
  InputGroup: ComboBoxInputGroup,
  Input: ComboBoxInput,
  Trigger: ComboBoxTrigger,
  Popover: ComboBoxPopover,
  Hint: ComboBoxHint,
  Error: ComboBoxError,
});

export type { ComboBoxOption };
export type {
  ComboBoxRootProps,
  ComboBoxSimpleProps,
  ComboBoxHintProps,
  ComboBoxErrorProps,
} from "./ComboBoxField";
export type {
  ComboBoxInputGroupProps,
  ComboBoxInputProps,
  ComboBoxTriggerProps,
  ComboBoxPopoverProps,
} from "./ComboBox";
