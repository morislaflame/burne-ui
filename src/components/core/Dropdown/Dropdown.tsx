import "../utils/glossInteractive.css";

import { mergeDropdownSlotClass } from "./dropdownAPI";
import {
  DropdownClassNamesProvider,
  DropdownIndicatorPreferenceProvider,
  DropdownProvider,
} from "./dropdownContext";
import {
  DROPDOWN_ROOT_CLASS,
  DropdownGroup,
  DropdownItem,
  DropdownItemHint,
  DropdownItemIcon,
  DropdownItemIndicator,
  DropdownItemLabel,
  DropdownLabel,
  DropdownPopover,
  DropdownSeparator,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger,
} from "./dropdownParts";
import type { DropdownProps } from "./dropdownTypes";
import { useDropdownRootState } from "./useDropdownRootState";

export type {
  DropdownProps,
  DropdownClassNames,
  DropdownTriggerProps,
  DropdownPopoverProps,
  DropdownGroupProps,
  DropdownLabelProps,
  DropdownSeparatorProps,
  DropdownItemProps,
  DropdownItemLabelProps,
  DropdownItemHintProps,
  DropdownItemIconProps,
  DropdownItemIndicatorProps,
  DropdownItemVariant,
  DropdownSubProps,
  DropdownSubTriggerProps,
  DropdownSubContentProps,
} from "./dropdownTypes";

export function DropdownRoot({
  children,
  className,
  classNames,
  open,
  defaultOpen,
  onOpenChange,
  multiple,
  value,
  defaultValue,
  onValueChange,
  selectionIndicator = false,
  closeOnSelect,
  popoverVariant,
  ...rest
}: DropdownProps) {
  const { contextValue } = useDropdownRootState({
    open,
    defaultOpen,
    onOpenChange,
    multiple,
    value,
    defaultValue,
    onValueChange,
    closeOnSelect,
    popoverVariant,
  });

  return (
    <DropdownProvider value={contextValue}>
      <DropdownClassNamesProvider classNames={classNames}>
        <DropdownIndicatorPreferenceProvider value={selectionIndicator}>
          <div
            className={mergeDropdownSlotClass(
              DROPDOWN_ROOT_CLASS,
              classNames?.root,
              className,
            )}
            {...rest}
          >
            {children}
          </div>
        </DropdownIndicatorPreferenceProvider>
      </DropdownClassNamesProvider>
    </DropdownProvider>
  );
}

DropdownRoot.displayName = "Dropdown";

export {
  DropdownTrigger,
  DropdownPopover,
  DropdownGroup,
  DropdownLabel,
  DropdownSeparator,
  DropdownItem,
  DropdownItemLabel,
  DropdownItemHint,
  DropdownItemIcon,
  DropdownItemIndicator,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
};
