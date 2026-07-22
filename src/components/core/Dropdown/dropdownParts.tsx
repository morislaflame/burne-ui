import { cloneElement, forwardRef, isValidElement, useCallback, useLayoutEffect, useId, useState, type HTMLAttributes, type PointerEvent as ReactPointerEvent, type ReactElement, type Ref } from "react";

import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";
import { Separator } from "@/components/core/Separator";
import { Text } from "@/components/core/Text";
import { runOpenAfterSqueeze, useOpeningRef } from "@/components/core/utils/runOpenAfterSqueeze";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";

import { useDropdownPopoverMenu } from "./dropdownAnimations";
import {
  useDropdown,
  useDropdownClassNames,
  useDropdownGroupLabelRegister,
  useDropdownIndicatorPreference,
  DropdownGroupLabelRegisterProvider,
  DropdownIndicatorPreferenceProvider,
} from "./dropdownContext";
import {
  DROPDOWN_GROUP_CLASS,
  DROPDOWN_LABEL_CLASS,
  DROPDOWN_LABEL_TEXT_CLASS,
  DROPDOWN_POPOVER_BODY_CLASS,
  DROPDOWN_POPOVER_CLASS,
  DROPDOWN_ROOT_CLASS,
  DROPDOWN_TRIGGER_CLASS,
} from "./dropdownStyles";
import type {
  DropdownGroupProps,
  DropdownLabelProps,
  DropdownPopoverProps,
  DropdownSeparatorProps,
  DropdownTriggerProps,
} from "./dropdownTypes";

import { cn } from "@/utils/cn";

export const DropdownTrigger = forwardRef<HTMLElement, DropdownTriggerProps>(
  function DropdownTrigger(
    { children, className, asChild, onClick, onPointerDown, ...rest },
    forwardedRef,
  ) {
    const { open, setOpen, triggerRef, contentId } = useDropdown();
    const slotClassNames = useDropdownClassNames();
    const openingRef = useOpeningRef();

    const handlePointerDown = useCallback(
      (e: ReactPointerEvent<HTMLElement>) => {
        if (open || openingRef.current || e.button !== 0) return;
        // Prevent child Button's own squeeze so Trigger drives the animation.
        e.preventDefault();
        runOpenAfterSqueeze({ triggerRef, openingRef, setOpen: () => setOpen(true) });
      },
      [open, openingRef, triggerRef, setOpen],
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        // When open, close immediately (no squeeze animation needed for closing).
        if (open) setOpen(false);
        // When closed, opening was already kicked off by pointerDown.
      },
      [onClick, open, setOpen],
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<
        HTMLAttributes<HTMLElement> & {
          ref?: Ref<HTMLElement>;
          onPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void;
        }
      >;
      return cloneElement(child, {
        ...rest,
        ref: (node: HTMLElement | null) => {
          mergeForwardedRef(forwardedRef, node);
          mergeForwardedRef(triggerRef, node);
          if (child.props.ref) mergeForwardedRef(child.props.ref, node);
        },
        className: cn(
          child.props.className,
          DROPDOWN_TRIGGER_CLASS,
          slotClassNames.trigger,
          className,
        ),
        // Trigger's pointerDown runs FIRST so e.preventDefault() suppresses
        // the child Button's own animation before it sees the event.
        onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
          handlePointerDown(e);
          child.props.onPointerDown?.(e);
          onPointerDown?.(e as ReactPointerEvent<HTMLButtonElement>);
        },
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          handleClick(e);
        },
        "aria-expanded": open,
        "aria-haspopup": "menu",
        "aria-controls": open ? contentId : undefined,
      });
    }

    return (
      <button
        type="button"
        ref={(node) => {
          mergeForwardedRef(forwardedRef, node);
          mergeForwardedRef(triggerRef, node);
        }}
        className={cn(
          DROPDOWN_TRIGGER_CLASS,
          slotClassNames.trigger,
          className,
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? contentId : undefined}
        onPointerDown={(e) => {
          onPointerDown?.(e as ReactPointerEvent<HTMLButtonElement>);
          handlePointerDown(e as ReactPointerEvent<HTMLElement>);
        }}
        onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

DropdownTrigger.displayName = "Dropdown.Trigger";

export const DropdownPopover = forwardRef<HTMLDivElement, DropdownPopoverProps>(
  function DropdownPopover(
    { children, className, bodyClassName, variant: variantProp, ...rest },
    forwardedRef,
  ) {
    const {
      open,
      setOpen,
      triggerRef,
      contentRef,
      contentId,
      subPanelRootsRef,
      popoverVariant,
    } = useDropdown();
    const slotClassNames = useDropdownClassNames();

    const panelVariant = variantProp ?? popoverVariant;

    const shouldDismiss = useCallback(
      (target: Node) => {
        for (const root of subPanelRootsRef.current) {
          if (root.contains(target)) return false;
        }
        return true;
      },
      [subPanelRootsRef],
    );

    useDropdownPopoverMenu({ open, setOpen, triggerRef, contentRef });

    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
        side="bottom"
        variant={panelVariant}
        anchorRef={triggerRef}
        shouldDismiss={shouldDismiss}
      >
        <Popover.Content
          ref={(node) => {
            mergeForwardedRef(forwardedRef, node);
            mergeForwardedRef(contentRef, node);
          }}
          matchAnchorWidth
          unstyled
          contentRole={undefined}
          offset={POPOVER_DEFAULT_OFFSET}
          id={contentId}
          className={cn(
            DROPDOWN_POPOVER_CLASS,
            slotClassNames.popover,
            className,
          )}
          {...rest}
        >
          <Popover.Body
            role="menu"
            className={cn(
              DROPDOWN_POPOVER_BODY_CLASS,
              slotClassNames.popoverBody,
              bodyClassName,
            )}
          >
            {children}
          </Popover.Body>
        </Popover.Content>
      </Popover>
    );
  },
);

DropdownPopover.displayName = "Dropdown.Popover";

export function DropdownGroup({
  className,
  children,
  selectionIndicator,
  ...rest
}: DropdownGroupProps) {
  const parentPreference = useDropdownIndicatorPreference();
  const slotClassNames = useDropdownClassNames();
  const resolvedPreference =
    selectionIndicator !== undefined ? selectionIndicator : parentPreference;
  const [labelId, setLabelId] = useState<string | undefined>();

  const registerLabel = useCallback((id: string | undefined) => {
    setLabelId(id);
  }, []);

  return (
    <DropdownIndicatorPreferenceProvider value={resolvedPreference}>
      <DropdownGroupLabelRegisterProvider value={registerLabel}>
        <div
          role="group"
          aria-labelledby={labelId}
          className={cn(
            DROPDOWN_GROUP_CLASS,
            slotClassNames.group,
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </DropdownGroupLabelRegisterProvider>
    </DropdownIndicatorPreferenceProvider>
  );
}

DropdownGroup.displayName = "Dropdown.Group";

export function DropdownLabel({
  className,
  children,
  id: idProp,
  ...rest
}: DropdownLabelProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const registerLabel = useDropdownGroupLabelRegister();
  const slotClassNames = useDropdownClassNames();

  useLayoutEffect(() => {
    registerLabel?.(id);
    return () => registerLabel?.(undefined);
  }, [id, registerLabel]);

  return (
    <div
      id={id}
      className={cn(
        DROPDOWN_LABEL_CLASS,
        slotClassNames.label,
        className,
      )}
      {...rest}
    >
      <Text
        as="span"
        variant="small"
        className={DROPDOWN_LABEL_TEXT_CLASS}
      >
        {children}
      </Text>
    </div>
  );
}

DropdownLabel.displayName = "Dropdown.Label";

export function DropdownSeparator({
  className,
  ...rest
}: DropdownSeparatorProps) {
  const slotClassNames = useDropdownClassNames();

  return (
    <Separator
      className={cn(slotClassNames.separator, className)}
      {...rest}
    />
  );
}

DropdownSeparator.displayName = "Dropdown.Separator";


export {
  DropdownItem,
  DropdownItemHint,
  DropdownItemIcon,
  DropdownItemIndicator,
  DropdownItemLabel,
} from "./dropdownItemParts";
export {
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
} from "./dropdownSubParts";

export { DROPDOWN_ROOT_CLASS };
