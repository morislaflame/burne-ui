import type { ReactNode, RefObject } from "react";

import type {
  DropdownClassNames,
  DropdownPopoverProps,
  DropdownProps,
  DropdownTriggerProps,
} from "@/components/core/Dropdown";

export type ContextMenuClassNames = DropdownClassNames;

export type ContextMenuProps = DropdownProps;

export type ContextMenuTriggerProps = DropdownTriggerProps;

export type ContextMenuContentProps = Omit<
  DropdownPopoverProps,
  "anchorRef" | "matchAnchorWidth"
>;

export type ContextMenuAnchorContextValue = RefObject<HTMLElement | null>;

export type ContextMenuAnchorProviderProps = {
  anchorRef: ContextMenuAnchorContextValue;
  children: ReactNode;
};
