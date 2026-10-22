 
import { useInJoinedButtonGroup } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { itemsPartTaken } from "@/components/core/utils/itemsBesideChildren";
 
import { DropdownClassNamesProvider, DropdownMotionProvider, DropdownProvider } from "./dropdownContext";
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
  DropdownSubPopover,
  DropdownSubTrigger,
  DropdownTrigger,
} from "./dropdownParts";
import { dropdownRootClass } from "./dropdownStyles";
import type { DropdownProps } from "./dropdownTypes";
import { useDropdownRootState } from "./useDropdownRootState";
import { OVERLAY_TRIGGER_MOTION_DEFAULTS } from "@/components/core/utils/overlayTriggerSqueeze";
 
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
  DropdownSubPopoverProps,
  DropdownMotion,
  DropdownLifecycleMotion,
  DropdownPartMotion,
  DropdownPopoverMotion,
  DropdownItemData,
} from "./dropdownTypes";
 
export function DropdownRoot({
  children,
  label,
  items,
  className,
  classNames,
  open,
  defaultOpen,
  onOpenChange,
  selectionMode,
  value,
  defaultValue,
  onValueChange,
  values,
  defaultValues,
  onValuesChange,
  closeOnSelect,
  size,
  variant: popoverVariant,
  portalContainer,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...rest
}: DropdownProps) {
  const { contextValue } = useDropdownRootState({
    open,
    defaultOpen,
    onOpenChange,
    selectionMode,
    value,
    defaultValue,
    onValueChange,
    values,
    defaultValues,
    onValuesChange,
    closeOnSelect,
    size,
    variant: popoverVariant,
    portalContainer,
  });
  const inJoinedButtonGroup = useInJoinedButtonGroup();
 
  return (
    <DropdownProvider value={contextValue}>
      <DropdownClassNamesProvider classNames={classNames}>
        <DropdownMotionProvider
          motion={motion}
          defaults={OVERLAY_TRIGGER_MOTION_DEFAULTS}
          controller={motionController}
          motionState={motionState}
          motionPayload={motionPayload}
          playInitialState={playInitialState}
        >
          <div
            className={dropdownRootClass({
              inJoinedButtonGroup,
              className: cn(classNames?.root, className),
            })}
            {...rest}
          >
            {label != null ? <DropdownTrigger>{label}</DropdownTrigger> : null}
            {children}
            {items && !itemsPartTaken("Dropdown", children, "Dropdown.Popover") ? (
              <DropdownPopover>
                {items.map((item) => (
                  <DropdownItem key={item.value} value={item.value} disabled={item.disabled}>
                    <DropdownItemLabel>{item.label}</DropdownItemLabel>
                    {item.hint != null ? <DropdownItemHint>{item.hint}</DropdownItemHint> : null}
                  </DropdownItem>
                ))}
              </DropdownPopover>
            ) : null}
          </div>
        </DropdownMotionProvider>
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
  DropdownSubPopover,
};
 
