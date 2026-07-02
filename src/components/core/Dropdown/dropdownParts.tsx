import { IoChevronForward } from "react-icons/io5";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useId,
  useState,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type Ref,
} from "react";
import { createPortal } from "react-dom";

import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { Separator } from "@/components/core/Separator";
import { Text } from "@/components/core/Text";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  runOpenAfterSqueeze,
  useOpeningRef,
} from "@/components/core/utils/runOpenAfterSqueeze";
import { burneLightThemePortalProps } from "@/components/core/utils/burneLightTheme";
import {
  OptionListItemContextProvider,
  useOptionListItemContext,
} from "@/components/core/utils/optionListItemContext";
import {
  OptionListItemHint,
  OptionListItemIcon,
  OptionListItemIndicatorShell,
  OptionListItemLabel,
} from "@/components/core/utils/optionListItemParts";

import {
  useDropdownPopoverMenu,
  useDropdownSubContentPortal,
} from "./dropdownAnimations";
import {
  mergeDropdownRefs,
  mergeDropdownSlotClass,
  partitionDropdownItemChildren,
  resolveDropdownItemIndicatorClassNames,
} from "./dropdownAPI";
import {
  useDropdown,
  useDropdownClassNames,
  useDropdownGroupLabelRegister,
  useDropdownIndicatorPreference,
  useDropdownSub,
  DropdownGroupLabelRegisterProvider,
  DropdownIndicatorPreferenceProvider,
  DropdownSubProvider,
} from "./dropdownContext";
import {
  DROPDOWN_GROUP_CLASS,
  DROPDOWN_LABEL_CLASS,
  DROPDOWN_LABEL_TEXT_CLASS,
  DROPDOWN_POPOVER_BODY_CLASS,
  DROPDOWN_POPOVER_CLASS,
  DROPDOWN_ROOT_CLASS,
  DROPDOWN_SUB_CLASS,
  DROPDOWN_SUB_CONTENT_GLOSS_CONTENT_CLASS,
  DROPDOWN_SUB_CONTENT_GLOSS_PANEL_CLASS,
  DROPDOWN_SUB_TRIGGER_CHEVRON_CLASS,
  DROPDOWN_SUB_TRIGGER_LABEL_WRAP_CLASS,
  DROPDOWN_TRIGGER_CLASS,
  dropdownItemRowClass,
  dropdownSubContentClass,
  dropdownSubTriggerRowClass,
} from "./dropdownStyles";
import type {
  DropdownGroupProps,
  DropdownItemHintProps,
  DropdownItemIconProps,
  DropdownItemIndicatorProps,
  DropdownItemLabelProps,
  DropdownItemProps,
  DropdownLabelProps,
  DropdownPopoverProps,
  DropdownSeparatorProps,
  DropdownSubContentProps,
  DropdownSubProps,
  DropdownSubTriggerProps,
  DropdownTriggerProps,
} from "./dropdownTypes";
import { useDropdownSubState } from "./useDropdownSubState";

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
        ref: mergeDropdownRefs(forwardedRef, triggerRef, child.props.ref),
        className: mergeDropdownSlotClass(
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
        ref={mergeDropdownRefs(
          forwardedRef as Ref<HTMLButtonElement>,
          triggerRef as Ref<HTMLButtonElement>,
        )}
        className={mergeDropdownSlotClass(
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
          ref={mergeDropdownRefs(forwardedRef, contentRef)}
          matchAnchorWidth
          unstyled
          contentRole={undefined}
          offset={POPOVER_DEFAULT_OFFSET}
          id={contentId}
          className={mergeDropdownSlotClass(
            DROPDOWN_POPOVER_CLASS,
            slotClassNames.popover,
            className,
          )}
          {...rest}
        >
          <Popover.Body
            role="menu"
            className={mergeDropdownSlotClass(
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
          className={mergeDropdownSlotClass(
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
      className={mergeDropdownSlotClass(
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
      className={mergeDropdownSlotClass(slotClassNames.separator, className)}
      {...rest}
    />
  );
}

DropdownSeparator.displayName = "Dropdown.Separator";

export function DropdownSub({ className, children, ...rest }: DropdownSubProps) {
  const { open: menuOpen } = useDropdown();
  const slotClassNames = useDropdownClassNames();
  const { contextValue } = useDropdownSubState(menuOpen);

  return (
    <DropdownSubProvider value={contextValue}>
      <div
        className={mergeDropdownSlotClass(
          DROPDOWN_SUB_CLASS,
          slotClassNames.sub,
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </DropdownSubProvider>
  );
}

DropdownSub.displayName = "Dropdown.Sub";

export const DropdownSubTrigger = forwardRef<
  HTMLDivElement,
  DropdownSubTriggerProps
>(function DropdownSubTrigger(
  {
    className,
    children,
    asChild,
    onPointerEnter,
    onPointerLeave,
    onClick,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const { open, setOpen, triggerRef, scheduleClose, cancelClose } =
    useDropdownSub();
  const slotClassNames = useDropdownClassNames();

  const handleEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented) return;
      cancelClose();
      setOpen(true);
    },
    [cancelClose, onPointerEnter, setOpen],
  );

  const handleLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(e);
      if (e.defaultPrevented) return;
      scheduleClose();
    },
    [onPointerLeave, scheduleClose],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      cancelClose();
      setOpen(true);
    },
    [cancelClose, onClick, setOpen],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        cancelClose();
        setOpen(true);
      }
    },
    [cancelClose, onKeyDown, setOpen],
  );

  const rowClass = dropdownSubTriggerRowClass({
    className,
    slotClass: slotClassNames.subTrigger,
  });

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<
      HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }
    >;
    return cloneElement(child, {
      ...rest,
      ref: mergeDropdownRefs(
        forwardedRef,
        triggerRef,
        child.props.ref,
      ) as Ref<HTMLElement>,
      className: mergeDropdownSlotClass(child.props.className, rowClass),
      onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
        (child.props as HTMLAttributes<HTMLElement>).onPointerEnter?.(e);
        handleEnter(e as unknown as React.PointerEvent<HTMLDivElement>);
      },
      onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
        (child.props as HTMLAttributes<HTMLElement>).onPointerLeave?.(e);
        handleLeave(e as unknown as React.PointerEvent<HTMLDivElement>);
      },
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        (child.props as HTMLAttributes<HTMLElement>).onClick?.(e);
        handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        (child.props as HTMLAttributes<HTMLElement>).onKeyDown?.(e);
        handleKeyDown(e as unknown as React.KeyboardEvent<HTMLDivElement>);
      },
      role: "menuitem",
      "aria-expanded": open,
      "aria-haspopup": "menu",
    });
  }

  return (
    <div
      ref={mergeDropdownRefs(forwardedRef, triggerRef)}
      role="menuitem"
      tabIndex={-1}
      aria-expanded={open}
      aria-haspopup="menu"
      className={rowClass}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <span
        className={mergeDropdownSlotClass(
          DROPDOWN_SUB_TRIGGER_LABEL_WRAP_CLASS,
          slotClassNames.subTriggerLabelWrap,
        )}
      >
        {children}
      </span>
      <IoChevronForward
        className={mergeDropdownSlotClass(
          DROPDOWN_SUB_TRIGGER_CHEVRON_CLASS,
          slotClassNames.subTriggerChevron,
        )}
        aria-hidden
      />
    </div>
  );
});

DropdownSubTrigger.displayName = "Dropdown.SubTrigger";

export const DropdownSubContent = forwardRef<
  HTMLDivElement,
  DropdownSubContentProps
>(function DropdownSubContent(
  {
    children,
    className,
    style,
    onPointerEnter: onPointerEnterProp,
    onPointerLeave: onPointerLeaveProp,
    ...rest
  },
  forwardedRef,
) {
  const { open: subOpen, triggerRef, scheduleClose, cancelClose } =
    useDropdownSub();
  const { subPanelRootsRef, triggerRef: menuTriggerRef, popoverVariant } =
    useDropdown();
  const slotClassNames = useDropdownClassNames();

  const portal = useDropdownSubContentPortal({
    subOpen,
    triggerRef,
    menuTriggerRef,
    subPanelRootsRef,
    popoverVariant,
  });

  const handleEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerEnterProp?.(e);
      if (e.defaultPrevented) return;
      cancelClose();
    },
    [cancelClose, onPointerEnterProp],
  );

  const handleLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeaveProp?.(e);
      if (e.defaultPrevented) return;
      scheduleClose();
    },
    [onPointerLeaveProp, scheduleClose],
  );

  if (!portal.portalMounted) return null;

  const portalTheme = burneLightThemePortalProps(menuTriggerRef.current);

  const panel = (
    <div
      ref={mergeDropdownRefs(forwardedRef, portal.panelRef)}
      {...portalTheme}
      role="menu"
      className={dropdownSubContentClass({
        isGlossPanel: portal.isGlossPanel,
        subOpen,
        portalMounted: portal.portalMounted,
        className,
        slotClass: slotClassNames.subContent,
      })}
      style={{
        top: portal.pos.top,
        left: portal.pos.left,
        minWidth: portal.pos.minW,
        ...style,
      }}
      {...rest}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      {portal.isGlossPanel ? (
        <div
          className={mergeDropdownSlotClass(
            DROPDOWN_SUB_CONTENT_GLOSS_PANEL_CLASS,
            slotClassNames.subContentGlossPanel,
          )}
        >
          <div
            className={mergeDropdownSlotClass(
              DROPDOWN_SUB_CONTENT_GLOSS_CONTENT_CLASS,
              slotClassNames.subContentGlossContent,
            )}
          >
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(panel, document.body)
    : null;
});

DropdownSubContent.displayName = "Dropdown.SubContent";

export function DropdownItemLabel({
  className,
  ...props
}: DropdownItemLabelProps) {
  const slotClassNames = useDropdownClassNames();

  return (
    <OptionListItemLabel
      className={mergeDropdownSlotClass(slotClassNames.itemLabel, className)}
      {...props}
    />
  );
}

DropdownItemLabel.displayName = "DropdownItemLabel";

export function DropdownItemHint({ className, ...props }: DropdownItemHintProps) {
  const slotClassNames = useDropdownClassNames();

  return (
    <OptionListItemHint
      className={mergeDropdownSlotClass(slotClassNames.itemHint, className)}
      {...props}
    />
  );
}

DropdownItemHint.displayName = "DropdownItemHint";

export function DropdownItemIcon({
  className,
  ...props
}: DropdownItemIconProps) {
  const slotClassNames = useDropdownClassNames();

  return (
    <OptionListItemIcon
      className={mergeDropdownSlotClass(slotClassNames.itemIcon, className)}
      {...props}
    />
  );
}

DropdownItemIcon.displayName = "DropdownItemIcon";

export function DropdownItemIndicator({
  variant = "base",
  size = "small",
  check,
  children,
  className,
  classNames: classNamesProp,
  ...rest
}: DropdownItemIndicatorProps) {
  const ctx = useOptionListItemContext("Dropdown.ItemIndicator");
  const slotClassNames = useDropdownClassNames();

  if (!ctx.showIndicatorSlot) return null;

  const showCheck = check ?? ctx.indicatorMode === "multi";

  return (
    <OptionListItemIndicatorShell
      className={mergeDropdownSlotClass(
        slotClassNames.itemIndicator,
        classNamesProp?.itemIndicator,
        className,
      )}
      {...rest}
    >
      <SelectionIndicator
        variant={variant}
        size={size}
        selected={ctx.selected}
        check={showCheck}
        classNames={resolveDropdownItemIndicatorClassNames({
          slotClassNames,
          classNames: classNamesProp,
        })}
      >
        {children}
      </SelectionIndicator>
    </OptionListItemIndicatorShell>
  );
}

DropdownItemIndicator.displayName = "DropdownItemIndicator";

export const DropdownItem = forwardRef<HTMLElement, DropdownItemProps>(
  function DropdownItem(
    {
      children,
      className,
      value,
      href,
      disabled = false,
      selection: selectionProp,
      variant = "default",
      onClick,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const { selected, selectItem, multiple, indicatorMode, setOpen } =
      useDropdown();
    const indicatorPreference = useDropdownIndicatorPreference();
    const slotClassNames = useDropdownClassNames();

    const parts = partitionDropdownItemChildren(children);
    const hasItemIndicator = parts.indicator != null;
    const hasHint = parts.hint != null;
    const hasIcon = parts.icon != null;

    const isLink = Boolean(href);
    const isSelectionItem = !isLink && selectionProp !== false;
    const showIndicatorSlot =
      isSelectionItem &&
      (multiple || indicatorPreference || hasItemIndicator);

    const itemRole = !showIndicatorSlot
      ? "menuitem"
      : indicatorMode === "multi"
        ? "menuitemcheckbox"
        : "menuitemradio";

    const isSelected =
      isSelectionItem && value != null && selected.has(value);

    const setRefs = useCallback(
      (node: HTMLElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const rowClass = dropdownItemRowClass({
      variant,
      disabled,
      hasHint,
      showIndicatorSlot,
      hasIcon,
      className,
      slotClass: slotClassNames.item,
    });

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled) return;
        const el = e.currentTarget;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        void animateInteractivePressSqueeze(el);
      },
      [disabled, onPointerDown],
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled) return;
        if (!isSelectionItem) {
          setOpen(false);
          return;
        }
        if (value == null) return;
        selectItem(value);
      },
      [disabled, isSelectionItem, onClick, selectItem, setOpen, value],
    );

    const itemBody = (
      <>
        {showIndicatorSlot && !hasItemIndicator ? <DropdownItemIndicator /> : null}
        {parts.indicator}
        {parts.label}
        {parts.hint}
        {parts.icon}
        {parts.rest}
      </>
    );

    const itemCtx = {
      showIndicatorSlot,
      hasHint,
      hasIcon,
      selected: isSelected,
      indicatorMode,
      disabled,
      mutedHint: disabled || variant === "default",
    };

    if (isLink) {
      return (
        <OptionListItemContextProvider value={itemCtx}>
          <a
            ref={setRefs as Ref<HTMLAnchorElement>}
            role={itemRole}
            href={disabled ? undefined : href}
            tabIndex={-1}
            aria-disabled={disabled || undefined}
            className={rowClass}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            {...(rest as HTMLAttributes<HTMLAnchorElement>)}
          >
            {itemBody}
          </a>
        </OptionListItemContextProvider>
      );
    }

    return (
      <OptionListItemContextProvider value={itemCtx}>
        <button
          ref={setRefs as Ref<HTMLButtonElement>}
          type="button"
          role={itemRole}
          disabled={disabled}
          tabIndex={-1}
          aria-checked={showIndicatorSlot ? isSelected : undefined}
          className={rowClass}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          {...(rest as HTMLAttributes<HTMLButtonElement>)}
        >
          {itemBody}
        </button>
      </OptionListItemContextProvider>
    );
  },
);

DropdownItem.displayName = "Dropdown.Item";

export { DROPDOWN_ROOT_CLASS };
