import "../utils/glossInteractive.css";

import { useInJoinedButtonGroup } from "@/components/composite/ButtonGroup/buttonGroupContext";

import { DropdownClassNamesProvider, DropdownIndicatorPreferenceProvider, DropdownProvider } from "./dropdownContext";
import {
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
import { dropdownRootClass } from "./dropdownStyles";
import type { DropdownProps } from "./dropdownTypes";
import { useDropdownRootState } from "./useDropdownRootState";

import { cn } from "@/utils/cn";

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
  DropdownItemStatus,
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
  portalContainer,
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
    portalContainer,
  });
  const inJoinedButtonGroup = useInJoinedButtonGroup();

  return (
    <DropdownProvider value={contextValue}>
      <DropdownClassNamesProvider classNames={classNames}>
        <DropdownIndicatorPreferenceProvider value={selectionIndicator}>
          <div
            className={dropdownRootClass({
              inJoinedButtonGroup,
              className: cn(classNames?.root, className),
            })}
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
