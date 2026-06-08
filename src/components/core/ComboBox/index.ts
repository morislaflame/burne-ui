import { Label } from "@/components/core/Label";

import {
  ComboBoxInput,
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxTrigger,
} from "./ComboBox";
import type { ComboBoxOption } from "./comboBoxContext";
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
