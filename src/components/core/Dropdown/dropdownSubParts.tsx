import { KitChevronForward } from "@/components/core/utils/kitIcons";
import { cloneElement, forwardRef, isValidElement, useCallback, type ForwardedRef, type HTMLAttributes, type ReactElement, type Ref } from "react";
import { createPortal } from "react-dom";
 
import { burneLightThemePortalProps } from "@/components/core/utils/burneLightTheme";
import { focusKeyboard } from "@/components/core/utils/focusElement";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { OverlayLayerProvider, useRegisterOverlayLayer } from "@/components/core/utils/overlayLayer";
import { resolveFloatingPortalContainer } from "@/components/core/utils/portalContainer";
import { isRtlElement } from "@/components/core/utils/readingDirection";
import { useApplySkinPortal } from "@/skins/skinContext";
import { mergeMotionSlotMaps, mergeMotionRootSiblings, useMotionPart } from "@/components/core/utils/slotMotion";
 
import { DROPDOWN_SUB_MOTION_DEFAULTS, useDropdownMenuSlotMotion, useDropdownSubPopoverPortal, useDropdownSubmenuKeyboard } from "./dropdownAnimations";
import { DropdownMotionProvider, useDropdown, useDropdownClassNames, useDropdownMotionScope, useDropdownSub, useOptionalDropdownMotionScope, DropdownSubProvider } from "./dropdownContext";
import {
  DROPDOWN_SUB_CLASS,
  DROPDOWN_SUB_CONTENT_BODY_CLASS,
  DROPDOWN_SUB_TRIGGER_CHEVRON_CLASS,
  DROPDOWN_SUB_TRIGGER_LABEL_WRAP_CLASS,
  dropdownSubContentClass,
  dropdownSubTriggerRowClass,
} from "./dropdownStyles";
import type {
  DropdownSubPopoverProps,
  DropdownSubProps,
  DropdownSubTriggerProps,
} from "./dropdownTypes";
import { useDropdownSubState } from "./useDropdownSubState";
 
import { cn } from "@/utils/cn";
 
function DropdownSubSession({
  children,
}: {
  children: (value: ReturnType<typeof useDropdownSubState>["contextValue"]) => ReactElement;
}) {
  const { contextValue } = useDropdownSubState();
  return children(contextValue);
}

export const DropdownSub = forwardRef<HTMLDivElement, DropdownSubProps>(
  function DropdownSub({ className, children, ...rest }, ref) {
    const { open: menuOpen } = useDropdown();
    const slotClassNames = useDropdownClassNames();

    return (
      <DropdownSubSession key={menuOpen ? "open" : "closed"}>
        {(contextValue) => (
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
        )}
      </DropdownSubSession>
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
    icon,
    motion,
    onPointerEnter,
    onPointerLeave,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    onClick,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const { open, setOpen, triggerRef, scheduleClose, cancelClose } =
    useDropdownSub();
  const slotClassNames = useDropdownClassNames();
  const part = useDropdownMenuSlotMotion<HTMLDivElement>("subTrigger", {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
 
  const setPartRef = part.setRef;
  const setRowRef = useCallback(
    (node: HTMLDivElement | null) => {
      setPartRef(node);
      mergeForwardedRef(triggerRef, node);
    },
    [setPartRef, triggerRef],
  );
 
  const handleEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented || e.pointerType === "touch") return;
      cancelClose();
      setOpen(true);
    },
    [cancelClose, onPointerEnter, setOpen],
  );
 
  const handleLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(e);
      if (e.defaultPrevented || e.pointerType === "touch") return;
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
      const rtl = triggerRef.current ? isRtlElement(triggerRef.current) : false;
      const openKey = rtl ? "ArrowLeft" : "ArrowRight";
      const closeKey = rtl ? "ArrowRight" : "ArrowLeft";
      if (e.key === "Enter" || e.key === " " || e.key === openKey) {
        e.preventDefault();
        cancelClose();
        setOpen(true);
        return;
      }
      if (e.key === closeKey && open) {
        e.preventDefault();
        setOpen(false);
      }
    },
    [cancelClose, onKeyDown, open, setOpen, triggerRef],
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
        setRowRef(node as HTMLDivElement | null);
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
      ...part.pointerHandlers,
      role: "menuitem",
      "aria-expanded": open,
      "aria-haspopup": "menu",
    });
  }
 
  return (
    <div
      ref={setRowRef}
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
      {...part.pointerHandlers}
    >
      <span
        className={cn(
          DROPDOWN_SUB_TRIGGER_LABEL_WRAP_CLASS,
          slotClassNames.subTriggerLabelWrap,
        )}
      >
        {children}
      </span>
      {icon !== undefined ? (
        icon
      ) : (
        <KitChevronForward
          className={cn(
            DROPDOWN_SUB_TRIGGER_CHEVRON_CLASS,
            slotClassNames.subTriggerIcon,
          )}
          aria-hidden
        />
      )}
    </div>
  );
});
 
DropdownSubTrigger.displayName = "Dropdown.SubTrigger";
 
export const DropdownSubPopover = forwardRef<
  HTMLDivElement,
  DropdownSubPopoverProps
>(function DropdownSubPopover({ motion, motionController, motionState, motionPayload, playInitialState, ...props }, forwardedRef) {
  const parentScope = useOptionalDropdownMotionScope();
  const mergedSlots = mergeMotionSlotMaps(
    parentScope?.getRootMotion(),
    motion ? { subPopover: motion } : undefined,
  );
  const siblings = mergeMotionRootSiblings({ events: parentScope?.getEvents(), states: parentScope?.getStates() });
  const merged = { ...mergedSlots, ...siblings };
  return (
    <DropdownMotionProvider
      motion={merged}
      defaults={DROPDOWN_SUB_MOTION_DEFAULTS}
      controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
    >
      <DropdownSubPopoverHost {...props} forwardedRef={forwardedRef} />
    </DropdownMotionProvider>
  );
});
 
DropdownSubPopover.displayName = "Dropdown.SubPopover";
 
function DropdownSubPopoverHost({
  children,
  className,
  style,
  onPointerEnter: onPointerEnterProp,
  onPointerLeave: onPointerLeaveProp,
  portalContainer: portalContainerProp,
  forwardedRef,
  ...rest
}: Omit<DropdownSubPopoverProps, "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"> & {
  forwardedRef?: ForwardedRef<HTMLDivElement>;
}) {
  const { open: subOpen, triggerRef, scheduleClose, cancelClose, setOpen } =
    useDropdownSub();
  const {
    subPanelRootsRef,
    triggerRef: menuTriggerRef,
    popoverVariant,
    portalContainer: portalContainerFromRoot,
  } = useDropdown();
  const slotClassNames = useDropdownClassNames();
  const motionScope = useDropdownMotionScope();
  const { setRef: setSubContentPartRef } = useMotionPart<HTMLDivElement>({
    scope: motionScope,
    slot: "subPopover",
  });
 
  const effectiveContainer = portalContainerProp ?? portalContainerFromRoot;
  const portal = useDropdownSubPopoverPortal({
    subOpen,
    triggerRef,
    menuTriggerRef,
    subPanelRootsRef,
    popoverVariant,
    portalContainer: effectiveContainer,
    motionScope,
  });
  useApplySkinPortal(portal.panelRef, portal.portalMounted);

  const layerId = useRegisterOverlayLayer({
    enabled: subOpen,
    kind: "floating",
    onEscape: () => {
      setOpen(false);
      focusKeyboard(triggerRef.current);
      return true;
    },
    containsNode: (node) =>
      Boolean(
        triggerRef.current?.contains(node) ||
          portal.panelRef.current?.contains(node),
      ),
  });
 
  useDropdownSubmenuKeyboard({
    subOpen,
    portalMounted: portal.portalMounted,
    panelRef: portal.panelRef,
    triggerRef,
    setOpen,
    layerId,
  });
 
  const handleEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerEnterProp?.(e);
      if (e.defaultPrevented || e.pointerType === "touch") return;
      cancelClose();
    },
    [cancelClose, onPointerEnterProp],
  );
 
  const handleLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeaveProp?.(e);
      if (e.defaultPrevented || e.pointerType === "touch") return;
      scheduleClose();
    },
    [onPointerLeaveProp, scheduleClose],
  );
 
  if (!portal.portalMounted) return null;
 
  const dirSource = triggerRef.current ?? menuTriggerRef.current;
  const dirAncestor = dirSource?.closest?.("[dir]");
  const rawDir =
    dirAncestor && dirAncestor !== document.documentElement
      ? dirAncestor.getAttribute("dir")
      : null;
  const portalDir =
    rawDir === "rtl" || rawDir === "ltr"
      ? rawDir
      : dirSource instanceof HTMLElement && isRtlElement(dirSource)
        ? "rtl"
        : undefined;
  const portalTheme = burneLightThemePortalProps(
    triggerRef.current ?? menuTriggerRef.current,
  );
 
  const panel = (
    <OverlayLayerProvider layerId={layerId}>
      <div
        ref={(node) => {
          mergeForwardedRef(forwardedRef ?? null, node);
          mergeForwardedRef(portal.panelRef, node);
          setSubContentPartRef(node);
        }}
        dir={portalDir}
        {...portalTheme}
        role="menu"
        className={dropdownSubContentClass({
          variant: portal.popoverVariant,
          subOpen,
          portalMounted: portal.portalMounted,
          className,
          slotClass: slotClassNames.subPopover,
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
        <div className={cn(DROPDOWN_SUB_CONTENT_BODY_CLASS, slotClassNames.subPopoverBody)}>
          {children}
        </div>
      </div>
    </OverlayLayerProvider>
  );
 
  const portalHost =
    typeof document !== "undefined"
      ? (resolveFloatingPortalContainer(
          effectiveContainer,
          triggerRef.current ?? menuTriggerRef.current,
        ) ?? portal.portalHost)
      : null;
 
  return portalHost ? createPortal(panel, portalHost) : null;
}
 
 