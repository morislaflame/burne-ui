import { Children, cloneElement, forwardRef, isValidElement, useCallback, useLayoutEffect, useMemo, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactElement, type Ref, type ForwardedRef } from "react";
import { createPortal } from "react-dom";
 
import { Button } from "@/components/core/Button";
import { CloseButton } from "@/components/core/CloseButton";
import { Text } from "@/components/core/Text";
import { burneLightThemePortalProps, useBurneLightTheme, usePortalThemeAnchor } from "@/components/core/utils/burneLightTheme";
import { dataOpenState, dataVariantProps } from "@/components/core/utils/dataContract";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { isContainedPortal, isOwnNativeDialogEvent, resolvePortalContainer } from "@/components/core/utils/portalContainer";
import { useApplySkinPortal } from "@/skins/skinContext";
import { useStudioSlotRef } from "@/studio/studioModeContext";
import { focusElement } from "@/components/core/utils/focusElement";
import { messageBannerCloseCellClass, messageBannerDescriptionCellClass, messageBannerGridClass, messageBannerIndicatorCellClass, messageBannerTitleCellClass } from "@/components/core/utils/messageBannerGridLayout";
import { useOverlayTriggerSlot } from "@/components/core/utils/overlayTriggerSqueeze";
import { mergeMotionSlotMaps, mergeMotionRootSiblings, useMotionPart } from "@/components/core/utils/slotMotion";
 
import { ALERT_DIALOG_ROLE, alertDialogDescribedBy, alertDialogLabelledBy, alertDialogTriggerA11y } from "./alertDialogA11y";
import { alertDialogDefaultHeaderIcon, alertDialogHasClose, alertDialogHasIndicator, alertDialogShowsDefaultHeaderIcon, injectFooterButtonSize, resolveAlertDialogHeaderGridSlots } from "./alertDialogAPI";
import { ALERT_DIALOG_MOTION_DEFAULTS, useAlertDialogModalMotion } from "./alertDialogAnimations";
import { AlertDialogHeaderProvider, AlertDialogMotionProvider, useAlertDialog, useAlertDialogClassNames, useAlertDialogHeaderContext, useAlertDialogMotionScope, useOptionalAlertDialogHeaderContext, useOptionalAlertDialogMotionScope } from "./alertDialogContext";
import { ALERT_DIALOG_CLOSE_CLASS, ALERT_DIALOG_FOOTER_CLASS, ALERT_DIALOG_HEADER_CLASS, alertDialogHeaderIconWrapperClass, ALERT_DIALOG_HEADING_BLOCK_CLASS, ALERT_DIALOG_TITLE_CLASS, ALERT_DIALOG_INDICATOR_CLASS, ALERT_DIALOG_TRIGGER_BASE_CLASS, alertDialogBodyClass, alertDialogContentClass, alertDialogNativeClass, alertDialogOverlayClass, alertDialogOverlayEnterStyle, alertDialogPanelClass } from "./alertDialogStyles";
import type {
  AlertDialogActionProps,
  AlertDialogBodyProps,
  AlertDialogCloseProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogHeadingBlockProps,
  AlertDialogIndicatorProps,
  AlertDialogPanelProps,
  AlertDialogPortalShellProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
} from "./alertDialogTypes";
 
import { cn } from "@/utils/cn";
 
export const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  function AlertDialogContent({ className, motion, ...rest }, ref) {
    const slotClassNames = useAlertDialogClassNames();
    const { setRef } = useMotionPart<HTMLDivElement>({
      scope: useOptionalAlertDialogMotionScope(),
      slot: "content",
      motion,
      forwardedRef: ref,
    });
 
    return (
      <div
        ref={setRef}
        className={alertDialogContentClass(
          cn(slotClassNames.content, className),
        )}
        {...rest}
      />
    );
  },
);
 
AlertDialogContent.displayName = "AlertDialogContent";
 
export const AlertDialogClose = forwardRef<HTMLButtonElement, AlertDialogCloseProps>(
  function AlertDialogClose({ className, onClick, size, motion, ...rest }, ref) {
    const { onOpenChange, sizePreset } = useAlertDialog();
    const headerCtx = useOptionalAlertDialogHeaderContext();
    const slotClassNames = useAlertDialogClassNames();
    const { setRef } = useMotionPart<HTMLButtonElement>({
      scope: useOptionalAlertDialogMotionScope(),
      slot: "close",
      motion,
      forwardedRef: ref,
    });
 
    return (
      <CloseButton
        ref={setRef}
        variant="secondary"
        size={size ?? sizePreset.closeButtonSize}
        className={cn(
          ALERT_DIALOG_CLOSE_CLASS,
          headerCtx && messageBannerCloseCellClass(headerCtx.gridSlots),
          slotClassNames.close,
          className,
        )}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) onOpenChange(false);
        }}
        {...rest}
      />
    );
  },
);
 
AlertDialogClose.displayName = "AlertDialogClose";
 
export const AlertDialogIndicator = forwardRef<HTMLSpanElement, AlertDialogIndicatorProps>(
  function AlertDialogIndicator({ className, children, motion, ...rest }, ref) {
  const { variant, status, sizePreset, gridSlots, headerIcon } =
    useAlertDialogHeaderContext("AlertDialog.Indicator");
  const slotClassNames = useAlertDialogClassNames();
  const { setRef } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalAlertDialogMotionScope(),
    slot: "indicator",
    motion,
    forwardedRef: ref,
  });
 
  if (children === null) return null;
 
  const DefaultIcon = alertDialogDefaultHeaderIcon(variant, status);
  const inner =
    children !== undefined
      ? children
      : headerIcon !== undefined
        ? headerIcon
        : alertDialogShowsDefaultHeaderIcon(variant, status) && DefaultIcon !== null
          ? <DefaultIcon aria-hidden className={sizePreset.iconClass} />
          : null;
 
  if (inner === null) return null;
 
  return (
    <span
      ref={setRef}
      className={cn(
        ALERT_DIALOG_INDICATOR_CLASS,
        alertDialogHeaderIconWrapperClass(status),
        messageBannerIndicatorCellClass(gridSlots),
        slotClassNames.indicator,
        className,
      )}
      {...rest}
    >
      {inner}
    </span>
  );
  },
);
 
AlertDialogIndicator.displayName = "AlertDialogIndicator";
 
export const AlertDialogHeader = forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  function AlertDialogHeader({
  icon,
  showClose = true,
  className,
  children,
  motion,
  ...rest
}, ref) {
  const { variant, status, sizePreset } = useAlertDialog();
  const slotClassNames = useAlertDialogClassNames();
  const { setRef } = useMotionPart<HTMLDivElement>({
    scope: useOptionalAlertDialogMotionScope(),
    slot: "header",
    motion,
    forwardedRef: ref,
  });
  const { gridSlots, compoundHasIndicator, compoundHasClose } = useMemo(() => {
    const compoundHasIndicator = alertDialogHasIndicator(children);
    const compoundHasClose = alertDialogHasClose(children);
    return {
      compoundHasIndicator,
      compoundHasClose,
      gridSlots: resolveAlertDialogHeaderGridSlots(
        variant,
        status,
        icon,
        showClose,
        children,
        compoundHasIndicator,
        compoundHasClose,
      ),
    };
  }, [children, icon, showClose, status, variant]);
 
  const headerCtx = useMemo(
    () => ({ variant, status, sizePreset, gridSlots, headerIcon: icon }),
    [gridSlots, icon, sizePreset, status, variant],
  );
 
  const showAutoIndicator = gridSlots.hasIndicator && !compoundHasIndicator;
  const showAutoClose = showClose && !compoundHasClose;
 
  return (
    <AlertDialogHeaderProvider value={headerCtx}>
      <div
        ref={setRef}
        className={cn(
          ALERT_DIALOG_HEADER_CLASS,
          sizePreset.headerPadding,
          messageBannerGridClass(gridSlots, sizePreset.headerGap),
          slotClassNames.header,
          className,
        )}
        {...rest}
      >
        {showAutoIndicator ? <AlertDialogIndicator /> : null}
        {children}
        {showAutoClose ? <AlertDialogClose /> : null}
      </div>
    </AlertDialogHeaderProvider>
  );
  },
);
 
AlertDialogHeader.displayName = "AlertDialogHeader";
 
export const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  function AlertDialogTitle(
    { className, id, motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
    const { titleId, setHasTitle, sizePreset } = useAlertDialog();
    const headerCtx = useOptionalAlertDialogHeaderContext();
    const slotClassNames = useAlertDialogClassNames();
    const { setRef, pointerHandlers } = useMotionPart<HTMLHeadingElement>({
      scope: useOptionalAlertDialogMotionScope(),
      slot: "title",
      motion,
      forwardedRef: ref,
      pointerPhases: true,
      onPointerOver,
      onPointerOut,
    });
 
    useLayoutEffect(() => {
      setHasTitle(true);
      return () => setHasTitle(false);
    }, [setHasTitle]);
 
    return (
      <Text
        ref={setRef as Ref<HTMLElement>}
        as="h2"
        textStyle={sizePreset.titleVariant}
        id={id ?? titleId}
        className={cn(
          ALERT_DIALOG_TITLE_CLASS,
          sizePreset.titleClassName,
          headerCtx && messageBannerTitleCellClass(headerCtx.gridSlots),
          slotClassNames.title,
          className,
        )}
        {...rest}
        {...pointerHandlers}
      />
    );
  },
);
 
AlertDialogTitle.displayName = "AlertDialogTitle";
 
export const AlertDialogDescription = forwardRef<
  HTMLParagraphElement,
  AlertDialogDescriptionProps
>(function AlertDialogDescription(
  { className, id, motion, onPointerOver, onPointerOut, ...rest },
  ref,
) {
  const { descriptionId, setHasDescription, sizePreset } = useAlertDialog();
  const headerCtx = useOptionalAlertDialogHeaderContext();
  const slotClassNames = useAlertDialogClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLParagraphElement>({
    scope: useOptionalAlertDialogMotionScope(),
    slot: "description",
    motion,
    forwardedRef: ref,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
 
  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);
 
  return (
    <Text
      ref={setRef as Ref<HTMLElement>}
      as="p"
      textStyle={sizePreset.descVariant}
      id={id ?? descriptionId}
      className={cn(
        sizePreset.descClassName,
        headerCtx && messageBannerDescriptionCellClass(headerCtx.gridSlots),
        slotClassNames.description,
        className,
      )}
      {...rest}
      {...pointerHandlers}
    />
  );
});
 
AlertDialogDescription.displayName = "AlertDialogDescription";
 
export const AlertDialogHeadingBlock = forwardRef(function AlertDialogHeadingBlock({
  className,
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: AlertDialogHeadingBlockProps, ref: ForwardedRef<HTMLDivElement>) {
  const slotClassNames = useAlertDialogClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    forwardedRef: ref,
    scope: useOptionalAlertDialogMotionScope(),
    slot: "headingBlock",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
 
  return (
    <div
      ref={setRef}
      className={cn(
        ALERT_DIALOG_HEADING_BLOCK_CLASS,
        slotClassNames.headingBlock,
        className,
      )}
      {...rest}
      {...pointerHandlers}
    />
  );
});
 
AlertDialogHeadingBlock.displayName = "AlertDialogHeadingBlock";
 
export const AlertDialogBody = forwardRef<HTMLDivElement, AlertDialogBodyProps>(
  function AlertDialogBody(
    { className, children, motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
    const { sizePreset } = useAlertDialog();
    const slotClassNames = useAlertDialogClassNames();
    const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
      scope: useOptionalAlertDialogMotionScope(),
      slot: "body",
      motion,
      forwardedRef: ref,
      pointerPhases: true,
      onPointerOver,
      onPointerOut,
    });
 
    return (
      <div
        ref={setRef}
        className={alertDialogBodyClass(
          sizePreset.bodyPadding,
          cn(slotClassNames.body, className),
        )}
        {...rest}
        {...pointerHandlers}
      >
        <Text textStyle={sizePreset.bodyVariant} as="div">
          {children}
        </Text>
      </div>
    );
  },
);
 
AlertDialogBody.displayName = "AlertDialogBody";
 
export const AlertDialogFooter = forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  function AlertDialogFooter({ className, children, motion, ...rest }, ref) {
  const { footerButtonSize, sizePreset } = useAlertDialog();
  const slotClassNames = useAlertDialogClassNames();
  const footerChildren = useMemo(
    () => injectFooterButtonSize(children, footerButtonSize),
    [children, footerButtonSize],
  );
  const { setRef } = useMotionPart<HTMLDivElement>({
    scope: useOptionalAlertDialogMotionScope(),
    slot: "footer",
    motion,
    forwardedRef: ref,
  });
 
  return (
    <div
      ref={setRef}
      className={cn(
        ALERT_DIALOG_FOOTER_CLASS,
        sizePreset.footerPadding,
        slotClassNames.footer,
        className,
      )}
      {...rest}
    >
      {footerChildren}
    </div>
  );
  },
);
 
AlertDialogFooter.displayName = "AlertDialogFooter";

export const AlertDialogOverlay = forwardRef(function AlertDialogOverlay(
  _props: AlertDialogOverlayProps,
  _ref,
) {
  return null;
});

AlertDialogOverlay.displayName = "AlertDialog.Overlay";

export const AlertDialogAction = forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  function AlertDialogAction(props, ref) {
    return <Button ref={ref} {...props} />;
  },
);

AlertDialogAction.displayName = "AlertDialog.Action";

export const AlertDialogCancel = forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  function AlertDialogCancel({ onClick, ...rest }, ref) {
    const { onOpenChange } = useAlertDialog();
    return (
      <Button
        ref={ref}
        variant="outline"
        {...rest}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) onOpenChange(false);
        }}
      />
    );
  },
);

AlertDialogCancel.displayName = "AlertDialog.Cancel";
 
// ─── AlertDialog.Trigger ──────────────────────────────────────────────────────
 
export const AlertDialogTrigger = forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  function AlertDialogTrigger(
    {
      children,
      asChild = true,
      className,
      motion,
      onClick,
      onPointerDown,
      onPointerOver,
      onPointerOut,
      onPointerUp,
      onKeyDown,
      ...rest
    },
    forwardedRef,
  ) {
    const { open, onOpenChange } = useAlertDialog();
    const slotClassNames = useAlertDialogClassNames();
    const { part, openingRef, openAfterSqueeze } = useOverlayTriggerSlot<HTMLButtonElement>({
      scope: useOptionalAlertDialogMotionScope(),
      slot: "trigger",
      motion,
      forwardedRef,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    const handlePointerDown = useCallback(
      (e: ReactPointerEvent<HTMLElement>) => {
        if (open || openingRef.current || e.button !== 0) return;
        e.preventDefault();
        focusElement(part.targetRef.current);
        openAfterSqueeze(() => onOpenChange(true));
      },
      [open, openingRef, openAfterSqueeze, onOpenChange, part.targetRef],
    );
 
    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent<HTMLElement>) => {
        onKeyDown?.(e as ReactKeyboardEvent<HTMLButtonElement>);
        if (e.defaultPrevented || open || openingRef.current) return;
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        openAfterSqueeze(() => onOpenChange(true));
      },
      [onKeyDown, open, openingRef, openAfterSqueeze, onOpenChange],
    );
 
    const handleClick = useCallback(
      (e: ReactMouseEvent<HTMLElement>) => {
        onClick?.(e as ReactMouseEvent<HTMLButtonElement>);
        if (e.defaultPrevented) return;
        if (!open && !openingRef.current) {
          onOpenChange(true);
        }
      },
      [onClick, open, openingRef, onOpenChange],
    );
 
    if (asChild && isValidElement(children)) {
      const onlyChild = Children.count(children) === 1 ? children : null;
      if (onlyChild) {
        const child = onlyChild as ReactElement;
        return cloneElement(
          child,
          mergeAsChildProps(
            child,
            {
              ...rest,
              className: cn(ALERT_DIALOG_TRIGGER_BASE_CLASS, slotClassNames.trigger, className),
              onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
                handlePointerDown(e);
                part.pointerHandlers.onPointerDown(e as ReactPointerEvent<HTMLButtonElement>);
              },
              onPointerOver: part.pointerHandlers.onPointerOver,
              onPointerOut: part.pointerHandlers.onPointerOut,
              onPointerUp: part.pointerHandlers.onPointerUp,
              onKeyDown: handleKeyDown,
              onClick: handleClick,
              ...alertDialogTriggerA11y(open),
              "data-state": dataOpenState(open),
            },
            part.setRef,
            { runBeforeChild: ["onPointerDown", "onKeyDown"] },
          ),
        );
      }
    }
 
    const triggerA11y = alertDialogTriggerA11y(open);
 
    return (
      <button
        type="button"
        ref={part.setRef}
        {...triggerA11y}
        className={cn(ALERT_DIALOG_TRIGGER_BASE_CLASS, slotClassNames.trigger, className)}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
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
 
AlertDialogTrigger.displayName = "AlertDialog.Trigger";
 
// ─── AlertDialog.Panel ────────────────────────────────────────────────────────
 
export function AlertDialogPanel({ motion, motionController, motionState, motionPayload, playInitialState, ...props }: AlertDialogPanelProps) {
  const parentScope = useOptionalAlertDialogMotionScope();
  const mergedSlots = mergeMotionSlotMaps(parentScope?.getRootMotion(), motion);
  const siblings = mergeMotionRootSiblings(
    { events: parentScope?.getEvents(), states: parentScope?.getStates() },
    motion,
  );
  const merged = { ...mergedSlots, ...siblings };
  return (
    <AlertDialogMotionProvider
      motion={merged}
      defaults={ALERT_DIALOG_MOTION_DEFAULTS}
      controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
    >
      <AlertDialogPanelHost {...props} />
    </AlertDialogMotionProvider>
  );
}
 
AlertDialogPanel.displayName = "AlertDialog.Panel";
 
function AlertDialogPanelHost({
  className,
  themeAnchor,
  portalContainer: portalContainerProp,
  children,
}: Omit<AlertDialogPanelProps, "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState">) {
  const {
    open,
    titleId,
    descriptionId,
    hasTitle,
    hasDescription,
    variant,
    sizePreset,
    closeOnEscape,
    closeOnInteractOutside,
    onEscapeKeyDown,
    onInteractOutside,
    initialFocus,
    onOpenChange,
    portalContainer: portalContainerFromRoot,
  } = useAlertDialog();
  const motionScope = useAlertDialogMotionScope();
 
  const portalHost = resolvePortalContainer(
    portalContainerProp ?? portalContainerFromRoot,
  );
  const contained = isContainedPortal(portalHost);
 
  const motion = useAlertDialogModalMotion({
    open,
    onOpenChange,
    variant,
    closeOnEscape,
    closeOnInteractOutside,
    onEscapeKeyDown,
    onInteractOutside,
    initialFocus,
    contained,
    motionScope,
  });
 
  const portalThemeAnchor = usePortalThemeAnchor(open, themeAnchor ?? null);
  const lightUi = useBurneLightTheme(portalThemeAnchor);
  const portalTheme = burneLightThemePortalProps(portalThemeAnchor);
 
  if (typeof document === "undefined" || !motion.showPortal || !portalHost) return null;
 
  return createPortal(
    <AlertDialogPortalShell
      open={open}
      className={className}
      variant={variant}
      sizePreset={sizePreset}
      portalTheme={portalTheme}
      lightUi={lightUi}
      titleId={titleId}
      descriptionId={descriptionId}
      hasTitle={hasTitle}
      hasDescription={hasDescription}
      onDialogCancel={motion.handleDialogCancel}
      onBackdropMouseDown={motion.handleBackdropPointerDown}
      dialogRef={motion.dialogRef}
      overlayRef={motion.overlayRef}
      panelRef={motion.panelRef}
      contained={contained}
    >
      {children}
    </AlertDialogPortalShell>,
    portalHost,
  );
}
 
// ─── AlertDialogPortalShell ───────────────────────────────────────────────────
 
export function AlertDialogPortalShell({
  open,
  children,
  className,
  variant,
  sizePreset,
  portalTheme,
  lightUi,
  titleId,
  descriptionId,
  hasTitle,
  hasDescription,
  onDialogCancel,
  onBackdropMouseDown,
  dialogRef,
  overlayRef,
  panelRef,
  contained = false,
}: AlertDialogPortalShellProps) {
  const slotClassNames = useAlertDialogClassNames();
  const { size, status } = useAlertDialog();
  const motionScope = useOptionalAlertDialogMotionScope();
  const studioPanelRef = useStudioSlotRef<HTMLDivElement>("alertDialog.panel", motionScope);
  useApplySkinPortal(dialogRef);

  return (
    <dialog
      {...portalTheme}
      ref={dialogRef}
      data-state={dataOpenState(open)}
      role={ALERT_DIALOG_ROLE}
      onCancel={(e) => {
        if (!isOwnNativeDialogEvent(e)) return;
        e.preventDefault();
        onDialogCancel(e);
      }}
      aria-labelledby={alertDialogLabelledBy(hasTitle, titleId)}
      aria-describedby={alertDialogDescribedBy(hasDescription, descriptionId)}
      className={cn(
        alertDialogNativeClass(contained),
        slotClassNames.dialog,
      )}
    >
      <div
        ref={mergeRefs(overlayRef, (node) => motionScope?.registerTarget("overlay", node))}
        className={alertDialogOverlayClass(lightUi, slotClassNames.overlay)}
        style={alertDialogOverlayEnterStyle()}
        aria-hidden
        onMouseDown={onBackdropMouseDown}
      />
      <div
        ref={mergeRefs(panelRef, studioPanelRef, (node) => motionScope?.registerTarget("panel", node))}
        tabIndex={-1}
        className={alertDialogPanelClass({
          variant,
          sizePreset,
          className,
          slotClass: slotClassNames.panel,
        })}
        {...dataVariantProps({ size, variant, status })}
      >
        <AlertDialogContent>{children}</AlertDialogContent>
      </div>
    </dialog>
  );
}
