import { useMemo } from "react";
 
 
import { resolveListBoxAriaLabel } from "./listBoxA11y";
import { resolveListBoxMotionDefaults } from "./listBoxAnimations";
import {
  ListBoxActiveValueProvider,
  ListBoxClassNamesProvider,
  ListBoxMotionProvider,
  ListBoxProvider,
} from "./listBoxContext";
import { ListBoxRootShell } from "./listBoxParts";
import type { ListBoxProps } from "./listBoxTypes";
import { useListBoxRootState } from "./useListBoxRootState";
 
export type {
  ListBoxProps,
  ListBoxSectionProps,
  ListBoxHeaderProps,
  ListBoxSeparatorProps,
  ListBoxEmptyProps,
  ListBoxItemProps,
  ListBoxLabelProps,
  ListBoxHintProps,
  ListBoxIconProps,
  ListBoxItemIndicatorProps,
  ListBoxSize,
  ListBoxVariant,
  ListBoxClassNames,
  ListBoxMotion,
  ListBoxPartMotion,
} from "./listBoxTypes";
 
export {
  ListBoxRootShell,
  ListBoxSection,
  ListBoxHeader,
  ListBoxSeparator,
  ListBoxEmpty,
  ListBoxItem,
  ListBoxLabel,
  ListBoxHint,
  ListBoxIcon,
  ListBoxItemIndicator,
} from "./listBoxParts";
 
export { useListBox, useListBoxActiveValue } from "./listBoxContext";
 
export function ListBoxRoot({
  classNames,
  children,
  className,
  size,
  variant,
  multiple,
  value,
  defaultValue,
  onValueChange,
  disabled,
  activeValue,
  onActiveValueChange,
  listId: listIdProp,
  "aria-label": ariaLabelProp,
  "aria-labelledby": ariaLabelledByProp,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  virtualized,
  virtualItemSize,
  ...rest
}: ListBoxProps) {
  const { listId, contextValue, activeValue: resolvedActiveValue } =
    useListBoxRootState({
      size,
      multiple,
      value,
      defaultValue,
      onValueChange,
      disabled,
      activeValue,
      onActiveValueChange,
      listId: listIdProp,
    });
 
  const aria = resolveListBoxAriaLabel({
    ariaLabel: ariaLabelProp,
    ariaLabelledBy: ariaLabelledByProp,
  });
 
  const motionDefaults = useMemo(() => resolveListBoxMotionDefaults(), []);
 
  return (
    <ListBoxProvider value={contextValue}>
      <ListBoxActiveValueProvider value={resolvedActiveValue}>
        <ListBoxClassNamesProvider classNames={classNames}>
          <ListBoxMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
          <ListBoxRootShell
            listId={listId}
            variant={variant}
            className={className}
            ariaLabel={aria["aria-label"]}
            ariaLabelledBy={aria["aria-labelledby"]}
            virtualized={virtualized}
            virtualItemSize={virtualItemSize}
            {...rest}
          >
            {children}
          </ListBoxRootShell>
          </ListBoxMotionProvider>
        </ListBoxClassNamesProvider>
      </ListBoxActiveValueProvider>
    </ListBoxProvider>
  );
}
 
ListBoxRoot.displayName = "ListBox";
 
