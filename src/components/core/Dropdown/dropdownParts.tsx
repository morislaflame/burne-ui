import { cloneElement, forwardRef, isValidElement, useCallback, useLayoutEffect, useId, useState, type PointerEvent as ReactPointerEvent, type ReactElement } from "react";

import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";
import { Separator } from "@/components/core/Separator";
import { Text } from "@/components/core/Text";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
import { mergeForwardedRef, mergeRefs } from "@/components/core/utils/mergeRefs";
import { runOpenAfterSqueeze, useOpeningRef } from "@/components/core/utils/runOpenAfterSqueeze";

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
    { children, className, asChild, onClick, onPointerDown, onKeyDown, ...rest },
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

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (open) setOpen(false);
          else {
            runOpenAfterSqueeze({ triggerRef, openingRef, setOpen: () => setOpen(true) });
          }
        }
      },
      [onKeyDown, open, openingRef, setOpen, triggerRef],
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement;
      return cloneElement(
        child,
        mergeAsChildProps(
          child,
          {
            ...rest,
            className: cn(
              DROPDOWN_TRIGGER_CLASS,
              slotClassNames.trigger,
              className,
            ),
            onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
              handlePointerDown(e);
              onPointerDown?.(e as ReactPointerEvent<HTMLButtonElement>);
            },
            onClick: handleClick,
            onKeyDown: handleKeyDown,
            "aria-expanded": open,
            "aria-haspopup": "menu",
            "aria-controls": open ? contentId : undefined,
          },
          mergeRefs(forwardedRef, triggerRef),
          { runBeforeChild: ["onPointerDown", "onKeyDown"] },
        ),
      );
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
        onKeyDown={handleKeyDown as React.KeyboardEventHandler<HTMLButtonElement>}
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
    {
      children,
      className,
      bodyClassName,
      variant: variantProp,
      side = "bottom",
      align,
      offset = POPOVER_DEFAULT_OFFSET,
      portalContainer: portalContainerProp,
      ...rest
    },
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
      portalContainer: portalContainerFromRoot,
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

    useDropdownPopoverMenu({
      open,
      setOpen,
      contentRef,
    });

    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
        side={side}
        variant={panelVariant}
        anchorRef={triggerRef}
        shouldDismiss={shouldDismiss}
        portalContainer={portalContainerProp ?? portalContainerFromRoot}
      >
        <Popover.Content
          ref={(node) => {
            mergeForwardedRef(forwardedRef, node);
            mergeForwardedRef(contentRef, node);
          }}
          matchAnchorWidth
          unstyled
          contentRole={undefined}
          align={align}
          offset={offset}
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

export const DropdownGroup = forwardRef<HTMLDivElement, DropdownGroupProps>(
  function DropdownGroup(
    { className, children, selectionIndicator, ...rest },
    ref,
  ) {
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
            ref={ref}
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
  },
);

DropdownGroup.displayName = "Dropdown.Group";

export const DropdownLabel = forwardRef<HTMLDivElement, DropdownLabelProps>(
  function DropdownLabel(
    { className, children, id: idProp, ...rest },
    ref,
  ) {
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
        ref={ref}
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
  },
);

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
