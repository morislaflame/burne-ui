import "../utils/glossInteractive.css";

import { resolveListBoxAriaLabel } from "./listBoxA11y";
import { ListBoxClassNamesProvider, ListBoxProvider } from "./listBoxContext";
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

export { useListBox } from "./listBoxContext";

export function ListBoxRoot({
  classNames,
  children,
  className,
  size,
  variant = "default",
  multiple,
  value,
  defaultValue,
  onValueChange,
  selectionIndicator,
  disabled,
  activeValue,
  onActiveValueChange,
  listId: listIdProp,
  "aria-label": ariaLabelProp,
  "aria-labelledby": ariaLabelledByProp,
  ...rest
}: ListBoxProps) {
  const { listId, contextValue } = useListBoxRootState({
    size,
    multiple,
    value,
    defaultValue,
    onValueChange,
    selectionIndicator,
    disabled,
    activeValue,
    onActiveValueChange,
    listId: listIdProp,
  });

  const aria = resolveListBoxAriaLabel({
    ariaLabel: ariaLabelProp,
    ariaLabelledBy: ariaLabelledByProp,
  });

  return (
    <ListBoxProvider value={contextValue}>
      <ListBoxClassNamesProvider classNames={classNames}>
        <ListBoxRootShell
          listId={listId}
          variant={variant}
          className={className}
          ariaLabel={aria["aria-label"]}
          ariaLabelledBy={aria["aria-labelledby"]}
          {...rest}
        >
          {children}
        </ListBoxRootShell>
      </ListBoxClassNamesProvider>
    </ListBoxProvider>
  );
}

ListBoxRoot.displayName = "ListBox";
