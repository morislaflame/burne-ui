import { IoChevronForward } from "react-icons/io5";
import { cloneElement, forwardRef, isValidElement, useCallback, type HTMLAttributes, type ReactElement, type Ref } from "react";
import { createPortal } from "react-dom";

import { burneLightThemePortalProps } from "@/components/core/utils/burneLightTheme";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { resolvePortalContainer } from "@/components/core/utils/portalContainer";

import { useDropdownSubContentPortal } from "./dropdownAnimations";
import { useDropdown, useDropdownClassNames, useDropdownSub, DropdownSubProvider } from "./dropdownContext";
import {
  DROPDOWN_SUB_CLASS,
  DROPDOWN_SUB_CONTENT_GLOSS_CONTENT_CLASS,
  DROPDOWN_SUB_CONTENT_GLOSS_PANEL_CLASS,
  DROPDOWN_SUB_TRIGGER_CHEVRON_CLASS,
  DROPDOWN_SUB_TRIGGER_LABEL_WRAP_CLASS,
  dropdownSubContentClass,
  dropdownSubTriggerRowClass,
} from "./dropdownStyles";
import type {
  DropdownSubContentProps,
  DropdownSubProps,
  DropdownSubTriggerProps,
} from "./dropdownTypes";
import { useDropdownSubState } from "./useDropdownSubState";

import { cn } from "@/utils/cn";

export const DropdownSub = forwardRef<HTMLDivElement, DropdownSubProps>(
  function DropdownSub({ className, children, ...rest }, ref) {
    const { open: menuOpen } = useDropdown();
    const slotClassNames = useDropdownClassNames();
    const { contextValue } = useDropdownSubState(menuOpen);

    return (
      <DropdownSubProvider value={contextValue}>
        <div
          ref={ref}
          className={cn(
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
  },
);

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
      ref: ((node: HTMLElement | null) => {
        mergeForwardedRef<HTMLDivElement>(
          forwardedRef,
          node as HTMLDivElement | null,
        );
        mergeForwardedRef<HTMLDivElement>(triggerRef, node as HTMLDivElement | null);
        if (child.props.ref) mergeForwardedRef(child.props.ref, node);
      }) as Ref<HTMLElement>,
      className: cn(child.props.className, rowClass),
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
      ref={(node) => {
        mergeForwardedRef(forwardedRef, node);
        mergeForwardedRef(triggerRef, node);
      }}
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
        className={cn(
          DROPDOWN_SUB_TRIGGER_LABEL_WRAP_CLASS,
          slotClassNames.subTriggerLabelWrap,
        )}
      >
        {children}
      </span>
      <IoChevronForward
        className={cn(
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
    portalContainer: portalContainerProp,
    ...rest
  },
  forwardedRef,
) {
  const { open: subOpen, triggerRef, scheduleClose, cancelClose } =
    useDropdownSub();
  const {
    subPanelRootsRef,
    triggerRef: menuTriggerRef,
    popoverVariant,
    portalContainer: portalContainerFromRoot,
  } = useDropdown();
  const slotClassNames = useDropdownClassNames();

  const portal = useDropdownSubContentPortal({
    subOpen,
    triggerRef,
    menuTriggerRef,
    subPanelRootsRef,
    popoverVariant,
    portalContainer: portalContainerProp ?? portalContainerFromRoot,
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
      ref={(node) => {
        mergeForwardedRef(forwardedRef, node);
        mergeForwardedRef(portal.panelRef, node);
      }}
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
        position: portal.contained ? "absolute" : "fixed",
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
          className={cn(
            DROPDOWN_SUB_CONTENT_GLOSS_PANEL_CLASS,
            slotClassNames.subContentGlossPanel,
          )}
        >
          <div
            className={cn(
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
    ? createPortal(
        panel,
        resolvePortalContainer(portalContainerProp ?? portalContainerFromRoot),
      )
    : null;
});

DropdownSubContent.displayName = "Dropdown.SubContent";

