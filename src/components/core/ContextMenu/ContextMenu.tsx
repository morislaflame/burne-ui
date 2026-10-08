import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  type MouseEvent,
  type ReactElement,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

import { Dropdown, type DropdownItemProps } from "@/components/core/Dropdown";
import { useDropdown, useDropdownClassNames } from "@/components/core/Dropdown/dropdownContext";
import { dataOpenState } from "@/components/core/utils/dataContract";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
import { mergeRefs } from "@/components/core/utils/mergeRefs";

import { isContextMenuKey, nudgeOpenContextMenu, placeContextMenuAnchor } from "./contextMenuAPI";
import { ContextMenuAnchorProvider, useContextMenuAnchor } from "./contextMenuContext";
import { CONTEXT_MENU_ANCHOR_CLASS, CONTEXT_MENU_TRIGGER_CLASS } from "./contextMenuStyles";
import type { ContextMenuContentProps, ContextMenuProps, ContextMenuTriggerProps } from "./contextMenuTypes";

import { cn } from "@/utils/cn";

function ContextMenuPoint() {
  const anchorRef = useContextMenuAnchor();
  const { open, triggerRef } = useDropdown();

  useLayoutEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    const trigger = triggerRef.current;
    if (!anchor || !trigger || anchor.style.left) return;
    const rect = trigger.getBoundingClientRect();
    placeContextMenuAnchor(anchor, rect.left, rect.bottom);
  }, [anchorRef, open, triggerRef]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <span ref={anchorRef} aria-hidden tabIndex={-1} className={CONTEXT_MENU_ANCHOR_CLASS} />,
    document.body,
  );
}

export function ContextMenuRoot({ children, ...rest }: ContextMenuProps) {
  const anchorRef = useRef<HTMLElement | null>(null);

  return (
    <ContextMenuAnchorProvider anchorRef={anchorRef}>
      <Dropdown {...rest}>
        <ContextMenuPoint />
        {children}
      </Dropdown>
    </ContextMenuAnchorProvider>
  );
}

ContextMenuRoot.displayName = "ContextMenu";

function openContextMenu(
  anchor: HTMLElement | null,
  x: number,
  y: number,
  open: boolean,
  setOpen: (next: boolean) => void,
) {
  placeContextMenuAnchor(anchor, x, y);
  if (open) {
    nudgeOpenContextMenu();
    return;
  }
  setOpen(true);
}

export const ContextMenuTrigger = forwardRef<HTMLElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger(
    { children, className, asChild, tabIndex, onContextMenu, onKeyDown, ...rest },
    forwardedRef,
  ) {
    const { open, setOpen, triggerRef, contentId } = useDropdown();
    const anchorRef = useContextMenuAnchor();
    const slotClassNames = useDropdownClassNames();
    const mergedRef = useCallback(
      (node: HTMLElement | null) => {
        mergeRefs(forwardedRef, triggerRef)(node);
      },
      [forwardedRef, triggerRef],
    );

    const handleContextMenu = useCallback(
      (event: MouseEvent<HTMLElement>) => {
        onContextMenu?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        openContextMenu(anchorRef.current, event.clientX, event.clientY, open, setOpen);
      },
      [anchorRef, onContextMenu, open, setOpen],
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !isContextMenuKey(event)) return;
        event.preventDefault();
        const rect = event.currentTarget.getBoundingClientRect();
        openContextMenu(anchorRef.current, rect.left, rect.bottom, open, setOpen);
      },
      [anchorRef, onKeyDown, open, setOpen],
    );

    const shared = {
      className: cn(CONTEXT_MENU_TRIGGER_CLASS, slotClassNames.trigger, className),
      "aria-expanded": open,
      "aria-haspopup": "menu" as const,
      "aria-controls": open ? contentId : undefined,
      onContextMenu: handleContextMenu,
      onKeyDown: handleKeyDown,
      "data-state": dataOpenState(open),
    };

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement;
      return cloneElement(
        child,
        mergeAsChildProps(child, {
          ...rest,
          ...shared,
          ...(tabIndex !== undefined ? { tabIndex } : null),
        }, mergedRef),
      );
    }

    return (
      <div
        ref={mergedRef}
        {...rest}
        {...shared}
        tabIndex={tabIndex ?? 0}
        data-state={dataOpenState(open)}
      >
        {children}
      </div>
    );
  },
);

ContextMenuTrigger.displayName = "ContextMenu.Trigger";

export const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  function ContextMenuContent({ side = "bottom", align = "start", offset = 4, ...rest }, forwardedRef) {
    const anchorRef = useContextMenuAnchor();
    return (
      <Dropdown.Popover
        ref={forwardedRef}
        side={side}
        align={align}
        offset={offset}
        {...rest}
        anchorRef={anchorRef}
        matchAnchorWidth={false}
      />
    );
  },
);

ContextMenuContent.displayName = "ContextMenu.Content";

export const ContextMenuItem = forwardRef<HTMLElement, DropdownItemProps>(
  function ContextMenuItem({ selection = false, ...rest }, ref) {
    return <Dropdown.Item ref={ref} selection={selection} {...rest} />;
  },
);

ContextMenuItem.displayName = "ContextMenu.Item";
