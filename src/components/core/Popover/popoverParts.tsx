import { Children, cloneElement, forwardRef, isValidElement, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ForwardedRef, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactElement, type Ref } from "react";
import { createPortal } from "react-dom";
 
import { Field } from "@/components/core/Field";
import { Text } from "@/components/core/Text";
import { burneLightThemePortalProps } from "@/components/core/utils/burneLightTheme";
import { dataOpenState, dataVariantProps } from "@/components/core/utils/dataContract";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
import { OverlayLayerProvider } from "@/components/core/utils/overlayLayer";
import { resolveFloatingPortalContainer } from "@/components/core/utils/portalContainer";
import { isRtlElement } from "@/components/core/utils/readingDirection";
import { useApplySkinPortal, useSkinRegistryRevision } from "@/skins/skinContext";
import { useOverlayTriggerSlot } from "@/components/core/utils/overlayTriggerSqueeze";
import { mergeMotionSlotMaps, mergeMotionRootSiblings, useMotionPart } from "@/components/core/utils/slotMotion";
import { TOOLTIP_ARROW_CLASS } from "@/components/core/Tooltip/tooltipPosition";
 
import { resolvePopoverDescribedBy, resolvePopoverLabelledBy, popoverTriggerA11y } from "./popoverA11y";
import { mergePopoverRefs, partitionPopoverContentChildren, POPOVER_ARROW_DISPLAY_NAME } from "./popoverAPI";
import { resolvePopoverContentAlign, resolvePopoverMotionDefaults, usePopoverContentLifecycle } from "./popoverAnimations";
import { PopoverResolvedSideProvider, PopoverContentChromeProvider, PopoverMotionProvider, useOptionalPopoverMotionScope, usePopoverClassNames, usePopoverContext, usePopoverContentChrome, usePopoverMotionScope, usePopoverResolvedSide } from "./popoverContext";
import { POPOVER_DEFAULT_OFFSET, popoverArrowClass, popoverBodyClass, popoverContentClass, popoverDefaultPanelClass, popoverHeaderClass, popoverDescriptionVariant, popoverTitleClass, popoverTitleVariant, popoverTriggerClass, POPOVER_PANEL_RELATIVE_CLASS } from "./popoverStyles";
import type {
  PopoverArrowProps,
  PopoverBodyProps,
  PopoverContentProps,
  PopoverHeaderProps,
  PopoverDescriptionProps,
  PopoverTitleProps,
  PopoverTriggerProps,
} from "./popoverTypes";
 
import { cn } from "@/utils/cn";
 
export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger(
    {
      className = "",
      children,
      asChild = true,
      motion,
      onClick,
      onPointerDown,
      onPointerOver,
      onPointerOut,
      onPointerUp,
      onKeyDown,
      ...rest
    },
    ref,
  ) {
    const { open, setOpen, triggerRef, popoverId } =
      usePopoverContext("Popover.Trigger");
    const slotClassNames = usePopoverClassNames();
    const { part, openingRef, openAfterSqueeze } = useOverlayTriggerSlot<HTMLButtonElement>({
      scope: useOptionalPopoverMotionScope(),
      slot: "trigger",
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    const setPartRef = part.setRef;
    const mergedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        setPartRef(node);
        triggerRef.current = node;
      },
      [setPartRef, triggerRef],
    );
 
    const openedFromPointerDownRef = useRef(false);

    useEffect(() => {
      if (!open) openedFromPointerDownRef.current = false;
    }, [open]);

    const handlePointerDown = useCallback(
      (e: ReactPointerEvent<HTMLElement>) => {
        if (open || openingRef.current || e.button !== 0) return;
        e.preventDefault();
        openedFromPointerDownRef.current = true;
        openAfterSqueeze(() => setOpen(true));
      },
      [open, openingRef, openAfterSqueeze, setOpen],
    );
 
    const handleClick = useCallback(
      (event: ReactMouseEvent<HTMLElement>) => {
        onClick?.(event as ReactMouseEvent<HTMLButtonElement>);
        if (event.defaultPrevented) return;
        if (openedFromPointerDownRef.current) {
          openedFromPointerDownRef.current = false;
          return;
        }
        if (open) setOpen(false);
        else if (!openingRef.current) setOpen(true);
      },
      [onClick, open, openingRef, setOpen],
    );
 
    const handleKeyDown = useCallback(
      (event: ReactKeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (open) setOpen(false);
          else {
            openAfterSqueeze(() => setOpen(true));
          }
        }
      },
      [onKeyDown, open, openAfterSqueeze, setOpen],
    );
 
    const onlyChild =
      Children.count(children) === 1 && isValidElement(children) ? children : null;
 
    if (asChild && onlyChild) {
      const child = onlyChild as ReactElement;
      const triggerA11y = popoverTriggerA11y(open, popoverId);
 
      return cloneElement(
        child,
        mergeAsChildProps(
          child,
          {
            ...rest,
            className: cn(slotClassNames.trigger, className),
            onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
              handlePointerDown(e);
              part.pointerHandlers.onPointerDown(e as ReactPointerEvent<HTMLButtonElement>);
            },
            onPointerOver: part.pointerHandlers.onPointerOver,
            onPointerOut: part.pointerHandlers.onPointerOut,
            onPointerUp: part.pointerHandlers.onPointerUp,
            onClick: handleClick,
            onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
              handleKeyDown(event as ReactKeyboardEvent<HTMLButtonElement>);
            },
            ...triggerA11y,
            "data-state": dataOpenState(open),
          },
          mergedRef,
          { runBeforeChild: ["onPointerDown", "onKeyDown"] },
        ),
      );
    }
 
    const triggerA11y = popoverTriggerA11y(open, popoverId);
 
    return (
      <button
        type="button"
        ref={mergedRef}
        className={popoverTriggerClass({
          slotClass: slotClassNames.trigger,
          className,
        })}
        {...triggerA11y}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest}
        {...part.pointerHandlers}
        onPointerDown={(e) => {
          part.pointerHandlers.onPointerDown(e);
          handlePointerDown(e);
        }}
        data-state={dataOpenState(open)}
      >
        {children}
      </button>
    );
  },
);
 
PopoverTrigger.displayName = "PopoverTrigger";
 
export const PopoverArrow = forwardRef<HTMLSpanElement, PopoverArrowProps>(
  function PopoverArrow(
    { className, motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
    const resolvedSide = usePopoverResolvedSide();
    const { variant } = usePopoverContext("Popover.Arrow");
    const slotClassNames = usePopoverClassNames();
    const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
      scope: useOptionalPopoverMotionScope(),
      slot: "arrow",
      motion,
      pointerPhases: true,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
    });

    return (
      <span
        ref={setRef}
        aria-hidden
        className={popoverArrowClass({
          variant,
          resolvedSide,
          arrowSideClass: TOOLTIP_ARROW_CLASS[resolvedSide],
          slotClass: slotClassNames.arrow,
          className,
        })}
        {...rest}
        {...pointerHandlers}
      />
    );
  },
);
 
PopoverArrow.displayName = POPOVER_ARROW_DISPLAY_NAME;
 
export const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  function PopoverHeader({ className, children, motion, ...rest }, ref) {
    const { size } = usePopoverContext("Popover.Header");
    const { unstyled } = usePopoverContentChrome();
    const slotClassNames = usePopoverClassNames();
    const { setRef } = useMotionPart<HTMLDivElement>({
      scope: useOptionalPopoverMotionScope(),
      slot: "header",
      motion,
      forwardedRef: ref,
    });
 
    return (
      <div
        ref={setRef}
        className={popoverHeaderClass({
          size,
          unstyled,
          slotClass: slotClassNames.header,
          className,
        })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
 
PopoverHeader.displayName = "PopoverHeader";
 
export const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>(
  function PopoverTitle({ className, children, id: idProp, motion, onPointerOver, onPointerOut, onPointerDown, onPointerUp, ...rest }, ref) {
    const { labelId, size } = usePopoverContext("Popover.Title");
    const slotClassNames = usePopoverClassNames();
    const { setRef, pointerHandlers } = useMotionPart<HTMLHeadingElement>({
      scope: useOptionalPopoverMotionScope(),
      slot: "title",
      motion,
      forwardedRef: ref,
      pointerPhases: true,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <Text
        ref={setRef as Ref<HTMLElement>}
        as="h2"
        textStyle={popoverTitleVariant(size)}
        id={idProp ?? labelId}
        className={popoverTitleClass({
          size,
          slotClass: slotClassNames.title,
          className,
        })}
        {...rest}
        {...pointerHandlers}
      >
        {children}
      </Text>
    );
  },
);
 
PopoverTitle.displayName = "PopoverTitle";
 
export const PopoverDescription = forwardRef<HTMLElement, PopoverDescriptionProps>(
  function PopoverDescription(
    { className, children, textStyle, motion, onPointerOver, onPointerOut, onPointerDown, onPointerUp, ...rest },
    ref,
  ) {
    const { hintId, size } = usePopoverContext("Popover.Description");
    const slotClassNames = usePopoverClassNames();
    const { setRef, pointerHandlers } = useMotionPart<HTMLElement>({
      scope: useOptionalPopoverMotionScope(),
      slot: "description",
      motion,
      forwardedRef: ref,
      pointerPhases: true,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <Field.Hint
        ref={setRef}
        as="p"
        id={hintId}
        textStyle={textStyle ?? popoverDescriptionVariant(size)}
        className={cn(slotClassNames.description, className)}
        {...rest}
        {...pointerHandlers}
      >
        {children}
      </Field.Hint>
    );
  },
);
 
PopoverDescription.displayName = "PopoverDescription";
 
export const PopoverBody = forwardRef<HTMLDivElement, PopoverBodyProps>(
  function PopoverBody({ className, children, motion, ...rest }, ref) {
    const { size } = usePopoverContext("Popover.Body");
    const { unstyled } = usePopoverContentChrome();
    const slotClassNames = usePopoverClassNames();
    const { setRef } = useMotionPart<HTMLDivElement>({
      scope: useOptionalPopoverMotionScope(),
      slot: "body",
      motion,
      forwardedRef: ref,
    });
 
    return (
      <div
        ref={setRef}
        className={popoverBodyClass({
          size,
          unstyled,
          slotClass: slotClassNames.body,
          className,
        })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
 
PopoverBody.displayName = "PopoverBody";
 
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent({ motion, motionController, motionState, motionPayload, playInitialState, ...props }, forwardedRef) {
    const parentScope = useOptionalPopoverMotionScope();
    const { variant } = usePopoverContext("Popover.Content");
    const skinRevision = useSkinRegistryRevision();
    const motionDefaults = useMemo(() => {
      void skinRevision;
      return resolvePopoverMotionDefaults(variant);
    }, [skinRevision, variant]);
    const mergedSlots = mergeMotionSlotMaps(parentScope?.getRootMotion(), motion);
    const siblings = mergeMotionRootSiblings(
      { events: parentScope?.getEvents(), states: parentScope?.getStates() },
      motion,
    );
    const merged = { ...mergedSlots, ...siblings };
    return (
      <PopoverMotionProvider
        motion={merged}
        defaults={motionDefaults}
        controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
      >
        <PopoverContentHost {...props} forwardedRef={forwardedRef} />
      </PopoverMotionProvider>
    );
  },
);
 
PopoverContent.displayName = "PopoverContent";
 
function PopoverContentHost({
  className = "",
  children,
  showArrow = false,
  offset: offsetProp,
  gap: gapProp,
  matchAnchorWidth = false,
  align: alignProp,
  side: sideProp,
  collisionPadding: collisionPaddingProp,
  avoidCollisions: avoidCollisionsProp,
  unstyled = false,
  contentRole = "dialog",
  portalContainer: portalContainerProp,
  forwardedRef,
  ...rest
}: Omit<PopoverContentProps, "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"> & { forwardedRef?: ForwardedRef<HTMLDivElement> }) {
  const {
    open,
    popoverId,
    size,
    variant,
    side: sideFromRoot,
    align: alignFromRoot,
    offset: offsetFromRoot,
    collisionPadding: collisionPaddingFromRoot,
    avoidCollisions: avoidCollisionsFromRoot,
    labelConnected,
    hintConnected,
    labelId,
    hintId,
    triggerRef,
    anchorRef,
    contentRef,
    layerId,
    portalContainer: portalContainerFromRoot,
  } = usePopoverContext("Popover.Content");
  const slotClassNames = usePopoverClassNames();
  const align = resolvePopoverContentAlign({ alignProp: alignProp ?? alignFromRoot, matchAnchorWidth });
  const side = sideProp ?? sideFromRoot;
  const offset = offsetProp ?? offsetFromRoot ?? POPOVER_DEFAULT_OFFSET;
  const collisionPadding = collisionPaddingProp ?? collisionPaddingFromRoot;
  const avoidCollisions = avoidCollisionsProp ?? avoidCollisionsFromRoot;
  const gapPropSet = gapProp !== undefined;
  const contentGap = gapProp ?? "base";
  const motionScope = usePopoverMotionScope();
  const { setRef: setContentPartRef } = useMotionPart<HTMLDivElement>({
    scope: motionScope,
    slot: "content",
    studioSlot: "popover.panel",
  });

  const { customArrow, panelChildren } = useMemo(
    () => partitionPopoverContentChildren(children),
    [children],
  );

  const {
    setPanelRef,
    portalMounted,
    portalHost: lifecyclePortalHost,
    resolvedSide,
  } = usePopoverContentLifecycle({
    open,
    side,
    offset,
    align,
    collisionPadding,
    avoidCollisions,
    matchAnchorWidth,
    showArrow,
    contentRef,
    triggerRef,
    anchorRef,
    portalContainer: portalContainerProp ?? portalContainerFromRoot,
    motionScope,
  });

  const skinRef = useRef<HTMLDivElement>(null);
  useApplySkinPortal(skinRef, portalMounted);
  const setSurfaceRef = useCallback(
    (node: HTMLDivElement | null) => {
      skinRef.current = node;
      setPanelRef(node);
    },
    [setPanelRef],
  );

  const [portalMeta, setPortalMeta] = useState<{
    theme?: "light" | "dark";
    dir?: "rtl" | "ltr";
  }>({});

  const syncPortalMeta = useCallback(() => {
    const triggerThemeAncestor = triggerRef.current?.closest?.("[data-theme]");
    const themeEl =
      triggerThemeAncestor && triggerThemeAncestor !== document.documentElement
        ? triggerRef.current
        : (anchorRef?.current ?? triggerRef.current);
    const nextTheme = burneLightThemePortalProps(themeEl)["data-theme"];

    const dirEl = triggerRef.current ?? anchorRef?.current;
    const dirAncestor = dirEl?.closest?.("[dir]");
    const rawDir =
      dirAncestor && dirAncestor !== document.documentElement
        ? dirAncestor.getAttribute("dir")
        : null;
    const nextDir: "rtl" | "ltr" | undefined =
      rawDir === "rtl" || rawDir === "ltr"
        ? rawDir
        : dirEl instanceof HTMLElement && isRtlElement(dirEl)
          ? "rtl"
          : undefined;

    setPortalMeta((prev) =>
      prev.theme === nextTheme && prev.dir === nextDir
        ? prev
        : { theme: nextTheme, dir: nextDir },
    );
  }, [anchorRef, triggerRef]);

  useLayoutEffect(() => {
    if (!open && !portalMounted) return;
    syncPortalMeta();
  }, [open, portalMounted, syncPortalMeta]);

  useEffect(() => {
    if (!open && !portalMounted) return;
    syncPortalMeta();
    const onSync = () => syncPortalMeta();
    window.addEventListener("scroll", onSync, { capture: true, passive: true });
    return () => window.removeEventListener("scroll", onSync, true);
  }, [open, portalMounted, syncPortalMeta]);
 
  if (!portalMounted) return null;
  if (typeof document === "undefined") return null;

  const effectiveContainer = portalContainerProp ?? portalContainerFromRoot;
  const dialogAnchor =
    anchorRef?.current?.closest?.("dialog[open]:not(.portal-contained)")
      ? anchorRef.current
      : (triggerRef.current ?? anchorRef?.current ?? null);
  const portalHost =
    resolveFloatingPortalContainer(effectiveContainer, dialogAnchor) ??
    lifecyclePortalHost;
  if (!portalHost) return null;

  const triggerThemeAncestor = triggerRef.current?.closest?.("[data-theme]");
  const themeAnchor =
    triggerThemeAncestor && triggerThemeAncestor !== document.documentElement
      ? triggerRef.current
      : (anchorRef?.current ?? triggerRef.current);
  const liveTheme = burneLightThemePortalProps(themeAnchor)["data-theme"] ?? portalMeta.theme;
  const portalTheme = liveTheme ? { "data-theme": liveTheme } : {};

  const dirSource = triggerRef.current ?? anchorRef?.current;
  const dirAncestor = dirSource?.closest?.("[dir]");
  const liveDirAttr =
    dirAncestor && dirAncestor !== document.documentElement
      ? dirAncestor.getAttribute("dir")
      : null;
  const portalDir =
    liveDirAttr === "rtl" || liveDirAttr === "ltr"
      ? liveDirAttr
      : (portalMeta.dir ??
          (dirSource instanceof HTMLElement && isRtlElement(dirSource) ? "rtl" : undefined));
 
  const describedBy = resolvePopoverDescribedBy({
    contentRole,
    labelConnected,
    hintConnected,
    labelId,
    hintId,
  });
 
  const labelledBy = resolvePopoverLabelledBy({
    contentRole,
    labelConnected,
    labelId,
  });
 
  const node = (
    <OverlayLayerProvider layerId={layerId}>
      <PopoverResolvedSideProvider value={resolvedSide}>
        <PopoverContentChromeProvider unstyled={unstyled}>
          <div
            ref={setSurfaceRef}
            tabIndex={-1}
            dir={portalDir}
            {...portalTheme}
            id={popoverId}
            role={contentRole}
            aria-modal={contentRole === "dialog" ? false : undefined}
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            className={popoverContentClass({
              resolvedSide,
              showArrow,
            })}
            {...rest}
            {...dataVariantProps({ size, variant })}
            data-side={resolvedSide}
            data-align={align}
            data-state={dataOpenState(open)}
          >
            <div
              className={cn(
                POPOVER_PANEL_RELATIVE_CLASS,
                slotClassNames.panelRelative,
              )}
            >
              {showArrow ? (customArrow ?? <PopoverArrow />) : null}
              <div
                ref={mergePopoverRefs(setContentPartRef, forwardedRef)}
                className={popoverDefaultPanelClass({
                  variant,
                  size,
                  unstyled,
                  contentGap,
                  gapPropSet,
                  slotClass: slotClassNames.panel,
                  contentSlot: slotClassNames.content,
                  className,
                })}
              >
                {panelChildren}
              </div>
            </div>
          </div>
        </PopoverContentChromeProvider>
      </PopoverResolvedSideProvider>
    </OverlayLayerProvider>
  );
 
  return createPortal(node, portalHost);
}
 