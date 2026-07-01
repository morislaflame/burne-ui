import { Label } from "@/components/core/Label";

import {
  SelectError,
  SelectHint,
  SelectPopover,
  SelectRoot,
  SelectTrigger,
  SelectTriggerGroup,
  SelectValue,
} from "./Select";

export const Select = Object.assign(SelectRoot, {
  Label,
  TriggerGroup: SelectTriggerGroup,
  Value: SelectValue,
  Trigger: SelectTrigger,
  Popover: SelectPopover,
  Hint: SelectHint,
  Error: SelectError,
});

export type { SelectOption } from "./selectTypes";

export type {
  SelectRootProps,
  SelectSimpleProps,
  SelectHintProps,
  SelectErrorProps,
  SelectTriggerGroupProps,
  SelectValueProps,
  SelectTriggerProps,
  SelectPopoverProps,
  SelectClassNames,
} from "./selectTypes";
