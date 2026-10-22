import { SelectError, SelectHint, SelectLabel, SelectPopover, SelectRoot, SelectTrigger, SelectShell, SelectValue } from "./Select";
 
export const Select = Object.assign(SelectRoot, {
  Label: SelectLabel,
  Shell: SelectShell,
  Value: SelectValue,
  Trigger: SelectTrigger,
  Popover: SelectPopover,
  Hint: SelectHint,
  Error: SelectError,
});
 
export type { SelectItem, SelectItemGroup } from "./selectTypes";
 
export type {
  SelectProps,
  SelectSize,
  SelectVariant,
  SelectSimpleProps,
  SelectHintProps,
  SelectLabelProps,
  SelectErrorProps,
  SelectShellProps,
  SelectValueProps,
  SelectTriggerProps,
  SelectPopoverProps,
  SelectClassNames,
  SelectMotion,
  SelectPartMotion,
} from "./selectTypes";
 