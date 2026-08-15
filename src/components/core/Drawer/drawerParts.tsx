import { Children, cloneElement, forwardRef, isValidElement, useCallback, useLayoutEffect, useMemo, useRef, type ForwardedRef, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactElement, type Ref } from "react";
import { createPortal } from "react-dom";

import { CloseButton } from "@/components/core/CloseButton";
import { Text } from "@/components/core/Text";
import { burneLightThemePortalProps, useBurneLightTheme, usePortalThemeAnchor } from "@/components/core/utils/burneLightTheme";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
import { mergeForwardedRef, mergeRefs } from "@/components/core/utils/mergeRefs";
import { isContainedPortal, resolvePortalContainer } from "@/components/core/utils/portalContainer";
import { focusElement } from "@/components/core/utils/focusElement";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { runOpenAfterSqueeze, useOpeningRef } from "@/components/core/utils/runOpenAfterSqueeze";
import { mergeMotionSlotMaps, useMotionPart } from "@/components/core/utils/slotMotion";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";

import {
  drawerHandleAriaLabel,
  isDrawerHandleActivateKey,
} from "./drawerA11y";
import { partitionDrawerChildren, injectFooterButtonSize } from "./drawerAPI";
import { DRAWER_MOTION_DEFAULTS, useDrawerModalMotion } from "./drawerAnimations";
import { DrawerMotionProvider, DrawerProvider, useDrawer, useDrawerClassNames, useDrawerMotionScope, useOptionalDrawerMotionScope } from "./drawerContext";
import { DRAWER_CLOSE_CLASS, DRAWER_FOOTER_CLASS, DRAWER_HEADER_CLASS, DRAWER_HEADING_BLOCK_CLASS, DRAWER_TITLE_CLASS, DRAWER_TRIGGER_BASE_CLASS, drawerBodyClass, drawerContentClass, drawerGlossContentWrapClass, drawerGlossPanelClass, drawerHandleClass, drawerHandleGripClass, drawerNativeClass, drawerOverlayClass, drawerOverlayEnterStyle, drawerPanelClass } from "./drawerStyles";
import type {
  DrawerBackdropProps,
  DrawerBodyProps,
  DrawerCloseProps,
  DrawerContentProps,
  DrawerContextValue,
  DrawerDescriptionProps,
  DrawerFooterProps,
  DrawerHandleProps,
  DrawerHeaderProps,
  DrawerHeadingBlockProps,
  DrawerPanelProps,
  DrawerPanelSegment,
  DrawerPortalShellProps,
  DrawerTitleProps,
  DrawerTriggerProps,
  DrawerVariant,
} from "./drawerTypes";
import { useDrawerHandleDrag } from "./useDrawerHandleDrag";

import { cn } from "@/utils/cn";

export function DrawerBackdropInner(_props: DrawerBackdropProps) {
  return null;
}

DrawerBackdropInner.displayName = "DrawerBackdrop";

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  function DrawerContent({ className, motion, ...rest }, ref) {
    const slotClassNames = useDrawerClassNames();
    const { setRef } = useMotionPart<HTMLDivElement>({
      scope: useOptionalDrawerMotionScope(),
      slot: "content",
      motion,
      forwardedRef: ref,
    });

    return (
      <div
        ref={setRef}
        className={drawerContentClass(
          cn(slotClassNames.content, className),
        )}
        {...rest}
      />
    );
  },
);

DrawerContent.displayName = "DrawerContent";

function DrawerPanelSegment({
  segment,
  variant,
}: {
  segment: DrawerPanelSegment;
  variant: DrawerVariant;
}) {
  const slotClassNames = useDrawerClassNames();

  if (segment.kind === "handle") {
    return segment.node;
  }

  if (variant === "gloss") {
    return (
      <div className={drawerGlossContentWrapClass(slotClassNames.glossContent)}>
        <DrawerContent>{segment.children}</DrawerContent>
      </div>
    );
  }

  return <DrawerContent>{segment.children}</DrawerContent>;
}

export function DrawerHandleInner({
  className,
  onPointerDown,
  onKeyDown,
  motion,
  ...rest
}: DrawerHandleProps) {
  const {
    onOpenChange,
    placement,
    overlayRef,
    panelRef,
    skipCloseAnimRef,
  } = useDrawer();
  const slotClassNames = useDrawerClassNames();
  const labels = useBurneLabels();
  const close = () => onOpenChange(false);
  const { onPointerDown: dragPD } = useDrawerHandleDrag(
    panelRef,
    overlayRef,
    placement,
    close,
    false,
    skipCloseAnimRef,
  );
  const { setRef } = useMotionPart<HTMLDivElement>({
    scope: useOptionalDrawerMotionScope(),
    slot: "handle",
    motion,
  });

  return (
    <div
      ref={setRef}
      className={drawerHandleClass({
        placement,
        slotClass: slotClassNames.handle,
        className,
      })}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        dragPD(e);
      }}
      {...rest}
    >
      <span
        role="button"
        tabIndex={0}
        aria-label={drawerHandleAriaLabel(placement, labels)}
        className={drawerHandleGripClass({
          placement,
          slotClass: slotClassNames.handleGrip,
        })}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented) return;
          if (!isDrawerHandleActivateKey(e.key)) return;
          e.preventDefault();
          close();
        }}
      />
    </div>
  );
}

DrawerHandleInner.displayName = "DrawerHandle";

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  function DrawerHeader({ className, motion, ...rest }, ref) {
    const { sizePreset } = useDrawer();
    const slotClassNames = useDrawerClassNames();
    const { setRef } = useMotionPart<HTMLDivElement>({
      scope: useOptionalDrawerMotionScope(),
      slot: "header",
      motion,
      forwardedRef: ref,
    });

    return (
      <div
        ref={setRef}
        className={cn(
          DRAWER_HEADER_CLASS,
          sizePreset.headerGap,
          sizePreset.headerPadding,
          slotClassNames.header,
          className,
        )}
        {...rest}
      />
    );
  },
);

DrawerHeader.displayName = "DrawerHeader";

export function DrawerHeadingBlock({
  className,
  ...rest
}: DrawerHeadingBlockProps) {
  const { sizePreset } = useDrawer();
  const slotClassNames = useDrawerClassNames();

  return (
    <div
      className={cn(
        DRAWER_HEADING_BLOCK_CLASS,
        sizePreset.headingGap,
        slotClassNames.headingBlock,
        className,
      )}
      {...rest}
    />
  );
}

DrawerHeadingBlock.displayName = "DrawerHeadingBlock";

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  function DrawerTitle({ className, id, motion, onPointerOver, onPointerOut, ...rest }, ref) {
    const { titleId, setHasTitle, sizePreset } = useDrawer();
    const slotClassNames = useDrawerClassNames();
    const { setRef, pointerHandlers } = useMotionPart<HTMLHeadingElement>({
      scope: useOptionalDrawerMotionScope(),
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
        variant={sizePreset.titleVariant}
        id={id ?? titleId}
        className={cn(
          DRAWER_TITLE_CLASS,
          sizePreset.titleClassName,
          slotClassNames.title,
          className,
        )}
        {...pointerHandlers}
        {...rest}
      />
    );
  },
);

DrawerTitle.displayName = "DrawerTitle";

export const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  function DrawerDescription(
    { className, id, motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
    const { descriptionId, setHasDescription, sizePreset } = useDrawer();
    const slotClassNames = useDrawerClassNames();
    const { setRef, pointerHandlers } = useMotionPart<HTMLParagraphElement>({
      scope: useOptionalDrawerMotionScope(),
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
        variant={sizePreset.descVariant}
        id={id ?? descriptionId}
        className={cn(
          sizePreset.descClassName,
          slotClassNames.description,
          className,
        )}
        {...pointerHandlers}
        {...rest}
      />
    );
  },
);

DrawerDescription.displayName = "DrawerDescription";

export const DrawerClose = forwardRef<HTMLButtonElement, DrawerCloseProps>(
  function DrawerClose(
    {
      className,
      onClick,
      size,
      "aria-label": ariaLabel,
      motion,
      ...rest
    },
    ref,
  ) {
    const { onOpenChange, sizePreset } = useDrawer();
    const slotClassNames = useDrawerClassNames();
    const { setRef } = useMotionPart<HTMLButtonElement>({
      scope: useOptionalDrawerMotionScope(),
      slot: "close",
      motion,
      forwardedRef: ref,
    });

    return (
      <CloseButton
        ref={setRef}
        variant="secondary"
        size={size ?? sizePreset.closeButtonSize}
        aria-label={ariaLabel}
        className={cn(
          DRAWER_CLOSE_CLASS,
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

DrawerClose.displayName = "DrawerClose";

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  function DrawerBody({ className, ...rest }, ref) {
    const { sizePreset } = useDrawer();
    const slotClassNames = useDrawerClassNames();

    return (
      <div
        ref={ref}
        className={drawerBodyClass(
          sizePreset.bodyPadding,
          cn(slotClassNames.body, className),
        )}
        {...rest}
      />
    );
  },
);

DrawerBody.displayName = "DrawerBody";

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  function DrawerFooter({ className, children, motion, ...rest }, ref) {
    const { sizePreset, footerButtonSize } = useDrawer();
    const slotClassNames = useDrawerClassNames();
    const sizedChildren = useMemo(
      () => injectFooterButtonSize(children, footerButtonSize),
      [children, footerButtonSize],
    );
    const { setRef } = useMotionPart<HTMLDivElement>({
      scope: useOptionalDrawerMotionScope(),
      slot: "footer",
      motion,
      forwardedRef: ref,
    });

    return (
      <div
        ref={setRef}
        className={cn(
          DRAWER_FOOTER_CLASS,
          sizePreset.footerPadding,
          slotClassNames.footer,
          className,
        )}
        {...rest}
      >
        {sizedChildren}
      </div>
    );
  },
);

DrawerFooter.displayName = "DrawerFooter";

// ─── Drawer.Trigger ──────────────────────────────────────────────────────────

export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  function DrawerTrigger({ children, asChild, className, onClick, onPointerDown, onKeyDown, ...rest }, forwardedRef) {
    const { open, onOpenChange } = useDrawer();
    const slotClassNames = useDrawerClassNames();
    const triggerRef = useRef<HTMLElement | null>(null);
    const openingRef = useOpeningRef();
    const config = useMotionConfig();

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        mergeForwardedRef(forwardedRef, node);
      },
      [forwardedRef],
    );

    const handlePointerDown = useCallback(
      (e: ReactPointerEvent<HTMLElement>) => {
        if (open || openingRef.current || e.button !== 0) return;
        e.preventDefault();
        focusElement(triggerRef.current);
        runOpenAfterSqueeze({ triggerRef, openingRef, setOpen: () => onOpenChange(true), config });
      },
      [open, openingRef, triggerRef, onOpenChange, config],
    );

    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent<HTMLElement>) => {
        onKeyDown?.(e as ReactKeyboardEvent<HTMLButtonElement>);
        if (e.defaultPrevented || open || openingRef.current) return;
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        runOpenAfterSqueeze({ triggerRef, openingRef, setOpen: () => onOpenChange(true), config });
      },
      [onKeyDown, open, openingRef, onOpenChange, triggerRef, config],
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
              className: cn(DRAWER_TRIGGER_BASE_CLASS, slotClassNames.trigger, className),
              onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
                handlePointerDown(e);
                onPointerDown?.(e as ReactPointerEvent<HTMLButtonElement>);
              },
              onKeyDown: handleKeyDown,
              onClick: handleClick,
              "aria-haspopup": "dialog",
              "aria-expanded": open,
            },
            mergeRefs((node: HTMLElement | null) => {
              triggerRef.current = node;
            }, forwardedRef),
            { runBeforeChild: ["onPointerDown", "onKeyDown"] },
          ),
        );
      }
    }

    return (
      <button
        type="button"
        ref={setRefs}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(DRAWER_TRIGGER_BASE_CLASS, slotClassNames.trigger, className)}
        onPointerDown={(e) => {
          onPointerDown?.(e);
          handlePointerDown(e);
        }}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

DrawerTrigger.displayName = "Drawer.Trigger";

// ─── Drawer.Panel ─────────────────────────────────────────────────────────────

export const DrawerPanel = forwardRef<HTMLDivElement, DrawerPanelProps>(
  function DrawerPanel({ motion, ...props }, forwardedRef) {
    const parentScope = useOptionalDrawerMotionScope();
    const { placement } = useDrawer();
    const merged = mergeMotionSlotMaps(parentScope?.getRootMotion(), motion);
    return (
      <DrawerMotionProvider
        motion={merged}
        defaults={DRAWER_MOTION_DEFAULTS}
        params={{ placement }}
      >
        <DrawerPanelHost {...props} forwardedRef={forwardedRef} />
      </DrawerMotionProvider>
    );
  },
);

DrawerPanel.displayName = "Drawer.Panel";

function DrawerPanelHost({
  extent = "default",
  variant = "default",
  className,
  style,
  themeAnchor,
  portalContainer: portalContainerProp,
  children,
  forwardedRef,
  ...rest
}: Omit<DrawerPanelProps, "motion"> & { forwardedRef?: ForwardedRef<HTMLDivElement> }) {
  const baseCtx = useDrawer();
  const {
    open,
    onOpenChange,
    placement,
    portalContainer: portalContainerFromRoot,
  } = baseCtx;
  const motionScope = useDrawerMotionScope();

  const { backdropIsDismissable, panelSegments } = useMemo(
    () => partitionDrawerChildren(children),
    [children],
  );

  const portalHost = resolvePortalContainer(
    portalContainerProp ?? portalContainerFromRoot,
  );
  const contained = isContainedPortal(portalHost);

  const motion = useDrawerModalMotion({
    open,
    onOpenChange,
    variant,
    placement,
    backdropIsDismissable,
    contained,
    motionScope,
  });

  const portalThemeAnchor = usePortalThemeAnchor(open, themeAnchor ?? null);
  const lightUi = useBurneLightTheme(portalThemeAnchor);
  const portalTheme = burneLightThemePortalProps(portalThemeAnchor);

  const fullContextValue: DrawerContextValue = useMemo(
    () => ({
      ...baseCtx,
      overlayRef: motion.overlayRef,
      panelRef: motion.panelRef,
      skipCloseAnimRef: motion.skipCloseAnimRef,
    }),
    [baseCtx, motion.overlayRef, motion.panelRef, motion.skipCloseAnimRef],
  );

  if (typeof document === "undefined" || !motion.showPortal || !portalHost) return null;

  return createPortal(
    <DrawerProvider value={fullContextValue}>
      <DrawerPortalShell
        className={className}
        style={style}
        variant={variant}
        placement={placement}
        extent={extent}
        portalTheme={portalTheme}
        lightUi={lightUi}
        titleId={baseCtx.titleId}
        descriptionId={baseCtx.descriptionId}
        hasTitle={baseCtx.hasTitle}
        hasDescription={baseCtx.hasDescription}
        backdropIsDismissable={backdropIsDismissable}
        panelSegments={panelSegments}
        dialogRef={motion.dialogRef}
        overlayRef={motion.overlayRef}
        panelRef={motion.panelRef}
        panelForwardedRef={forwardedRef}
        panelRest={rest}
        bindGlossPanelRef={motion.bindGlossPanelRef}
        onBackdropMouseDown={motion.handleBackdropMouseDown}
        onDialogClose={() => onOpenChange(false)}
        onDialogCancel={(e) => {
          e.preventDefault();
          onOpenChange(false);
        }}
        contained={contained}
      />
    </DrawerProvider>,
    portalHost,
  );
}

// ─── DrawerPortalShell ───────────────────────────────────────────────────────

export function DrawerPortalShell({
  className,
  style,
  variant,
  placement,
  extent,
  portalTheme,
  lightUi,
  titleId,
  descriptionId,
  hasTitle,
  hasDescription,
  backdropIsDismissable,
  panelSegments,
  dialogRef,
  overlayRef,
  panelRef,
  panelForwardedRef,
  panelRest,
  bindGlossPanelRef,
  onBackdropMouseDown,
  onDialogClose,
  onDialogCancel,
  contained = false,
}: DrawerPortalShellProps) {
  const slotClassNames = useDrawerClassNames();
  const { size } = useDrawer();
  const motionScope = useOptionalDrawerMotionScope();

  const panelNodes = panelSegments.map((segment, index) => (
    <DrawerPanelSegment
      key={segment.kind === "handle" ? `handle-${index}` : `content-${index}`}
      segment={segment}
      variant={variant}
    />
  ));

  return (
    <dialog
      {...portalTheme}
      ref={dialogRef}
      onClose={onDialogClose}
      onCancel={onDialogCancel}
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={hasDescription ? descriptionId : undefined}
      className={cn(drawerNativeClass(contained), slotClassNames.dialog)}
    >
      <div
        ref={mergeRefs(overlayRef, (node) => motionScope?.registerTarget("overlay", node))}
        className={drawerOverlayClass({
          lightUi,
          dismissable: backdropIsDismissable,
          slotClass: slotClassNames.overlay,
        })}
        style={drawerOverlayEnterStyle()}
        aria-hidden
        onMouseDown={onBackdropMouseDown}
      />
      <div
        ref={mergeRefs(panelRef, panelForwardedRef, (node) => motionScope?.registerTarget("panel", node))}
        tabIndex={-1}
        className={drawerPanelClass({
          variant,
          placement,
          extent,
          size,
          className,
          slotClass: slotClassNames.panel,
        })}
        style={style}
        {...panelRest}
      >
        {variant === "gloss" ? (
          <div
            ref={bindGlossPanelRef}
            className={drawerGlossPanelClass({
              placement,
              extent,
              size,
              slotClass: slotClassNames.glossPanel,
            })}
          >
            {panelNodes}
          </div>
        ) : (
          panelNodes
        )}
      </div>
    </dialog>
  );
}
