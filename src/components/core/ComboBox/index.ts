import { ComboBoxError, ComboBoxHint, ComboBoxLabel, ComboBoxInput, ComboBoxShell, ComboBoxPopover, ComboBoxRoot, ComboBoxTrigger } from "./ComboBox";
 
export const ComboBox = Object.assign(ComboBoxRoot, {
  Label: ComboBoxLabel,
  Shell: ComboBoxShell,
  Input: ComboBoxInput,
  Trigger: ComboBoxTrigger,
  Popover: ComboBoxPopover,
  Hint: ComboBoxHint,
  Error: ComboBoxError,
});
 
export type { ComboBoxItem } from "./comboBoxTypes";
 
export type {
  ComboBoxProps,
  ComboBoxSize,
  ComboBoxVariant,
  ComboBoxSimpleProps,
  ComboBoxHintProps,
  ComboBoxLabelProps,
  ComboBoxErrorProps,
  ComboBoxShellProps,
  ComboBoxInputProps,
  ComboBoxTriggerProps,
  ComboBoxPopoverProps,
  ComboBoxClassNames,
  ComboBoxMotion,
  ComboBoxPartMotion,
} from "./comboBoxTypes";
 
export { comboBoxFilteredValues } from "./comboBoxAPI";
 