import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type Ref,
} from "react";
import { createPortal } from "react-dom";

import { CloseButton } from "@/components/core/CloseButton";
import { Text } from "@/components/core/Text";
import {
  burneLightThemePortalProps,
  useBurneLightTheme,
  usePortalThemeAnchor,
} from "@/components/core/utils/burneLightTheme";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import {
  runOpenAfterSqueeze,
  useOpeningRef,
} from "@/components/core/utils/runOpenAfterSqueeze";

import { drawerHandleAriaLabel, DRAWER_CLOSE_DEFAULT_ARIA_LABEL } from "./drawerA11y";
import { partitionDrawerChildren } from "./drawerAPI";
import { useDrawerModalMotion } from "./drawerAnimations";
import { DrawerProvider, useDrawer, useDrawerClassNames } from "./drawerContext";
import {
  DRAWER_CLOSE_CLASS,
  DRAWER_DESCRIPTION_CLASS,
  DRAWER_FOOTER_CLASS,
  DRAWER_FOOTER_PADDING,
  DRAWER_HEADER_CLASS,
  DRAWER_HEADER_PADDING,
  DRAWER_HEADING_BLOCK_CLASS,
  DRAWER_NATIVE_CLASS,
  DRAWER_TITLE_CLASS,
  drawerBodyClass,
  drawerContentClass,
  drawerGlossContentWrapClass,
  drawerGlossPanelClass,
  drawerHandleClass,
  drawerHandleGripClass,
  drawerOverlayClass,
  drawerOverlayEnterStyle,
  drawerPanelClass,
} from "./drawerStyles";
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

export function DrawerContent({ className, ...rest }: DrawerContentProps) {
  const slotClassNames = useDrawerClassNames();

  return (
    <div
      className={drawerContentClass(
        cn(slotClassNames.content, className),
      )}
      {...rest}
    />
  );
}

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
  const { onPointerDown: dragPD } = useDrawerHandleDrag(
    panelRef,
    overlayRef,
    placement,
    () => onOpenChange(false),
    false,
    skipCloseAnimRef,
  );

  return (
    <div
      aria-label={drawerHandleAriaLabel(placement)}
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
        aria-hidden
        className={drawerHandleGripClass({
          placement,
          slotClass: slotClassNames.handleGrip,
        })}
      />
    </div>
  );
}

DrawerHandleInner.displayName = "DrawerHandle";

export function DrawerHeader({ className, ...rest }: DrawerHeaderProps) {
  const slotClassNames = useDrawerClassNames();

  return (
    <div
      className={cn(
        DRAWER_HEADER_CLASS,
        DRAWER_HEADER_PADDING,
        slotClassNames.header,
        className,
      )}
      {...rest}
    />
  );
}

DrawerHeader.displayName = "DrawerHeader";

export function DrawerHeadingBlock({
  className,
  ...rest
}: DrawerHeadingBlockProps) {
  const slotClassNames = useDrawerClassNames();

  return (
    <div
      className={cn(
        DRAWER_HEADING_BLOCK_CLASS,
        slotClassNames.headingBlock,
        className,
      )}
      {...rest}
    />
  );
}

DrawerHeadingBlock.displayName = "DrawerHeadingBlock";

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  function DrawerTitle({ className, id, ...rest }, ref) {
    const { titleId } = useDrawer();
    const slotClassNames = useDrawerClassNames();

    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="h2"
        variant="mid"
        id={id ?? titleId}
        className={cn(
          DRAWER_TITLE_CLASS,
          slotClassNames.title,
          className,
        )}
        {...rest}
      />
    );
  },
);

DrawerTitle.displayName = "DrawerTitle";

export function DrawerDescription({
  className,
  id,
  ...rest
}: DrawerDescriptionProps) {
  const { descriptionId, setHasDescription } = useDrawer();
  const slotClassNames = useDrawerClassNames();

  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <Text
      as="p"
      variant="base"
      id={id ?? descriptionId}
      className={cn(
        DRAWER_DESCRIPTION_CLASS,
        slotClassNames.description,
        className,
      )}
      {...rest}
    />
  );
}

DrawerDescription.displayName = "DrawerDescription";

export const DrawerClose = forwardRef<HTMLButtonElement, DrawerCloseProps>(
  function DrawerClose(
    {
      className,
      onClick,
      "aria-label": ariaLabel = DRAWER_CLOSE_DEFAULT_ARIA_LABEL,
      ...rest
    },
    ref,
  ) {
    const { onOpenChange } = useDrawer();
    const slotClassNames = useDrawerClassNames();

    return (
      <CloseButton
        ref={ref}
        variant="secondary"
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

export function DrawerBody({ className, ...rest }: DrawerBodyProps) {
  const slotClassNames = useDrawerClassNames();

  return (
    <div
      className={drawerBodyClass(
        cn(slotClassNames.body, className),
      )}
      {...rest}
    />
  );
}

DrawerBody.displayName = "DrawerBody";

export function DrawerFooter({ className, ...rest }: DrawerFooterProps) {
  const slotClassNames = useDrawerClassNames();

  return (
    <div
      className={cn(
        DRAWER_FOOTER_CLASS,
        DRAWER_FOOTER_PADDING,
        slotClassNames.footer,
        className,
      )}
      {...rest}
    />
  );
}

DrawerFooter.displayName = "DrawerFooter";

// ─── Drawer.Trigger ──────────────────────────────────────────────────────────

export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  function DrawerTrigger({ children, asChild, onClick, onPointerDown, ...rest }, forwardedRef) {
    const { open, onOpenChange } = useDrawer();
    const triggerRef = useRef<HTMLElement | null>(null);
    const openingRef = useOpeningRef();

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
        triggerRef.current?.focus({ preventScroll: true });
        runOpenAfterSqueeze({ triggerRef, openingRef, setOpen: () => onOpenChange(true) });
      },
      [open, openingRef, triggerRef, onOpenChange],
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
        const child = onlyChild as ReactElement<{
          ref?: Ref<HTMLElement>;
          onPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void;
          onClick?: (e: ReactMouseEvent<HTMLElement>) => void;
          "aria-haspopup"?: string;
          "aria-expanded"?: boolean;
        }>;
        return cloneElement(child, {
          ref: ((node: HTMLElement | null) => { triggerRef.current = node; }) as unknown as Ref<HTMLElement>,
          onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
            handlePointerDown(e);
            child.props.onPointerDown?.(e);
            onPointerDown?.(e as ReactPointerEvent<HTMLButtonElement>);
          },
          onClick: (e: ReactMouseEvent<HTMLElement>) => {
            child.props.onClick?.(e);
            handleClick(e);
          },
          "aria-haspopup": "dialog",
          "aria-expanded": open,
        });
      }
    }

    return (
      <button
        type="button"
        ref={setRefs}
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerDown={(e) => {
          onPointerDown?.(e);
          handlePointerDown(e);
        }}
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

export function DrawerPanel({
  extent = "default",
  variant = "default",
  className,
  themeAnchor,
  children,
}: DrawerPanelProps) {
  const baseCtx = useDrawer();
  const { open, onOpenChange, placement } = baseCtx;

  const { backdropIsDismissable, panelSegments } = useMemo(
    () => partitionDrawerChildren(children),
    [children],
  );

  const motion = useDrawerModalMotion({
    open,
    onOpenChange,
    variant,
    placement,
    backdropIsDismissable,
  });

  const portalThemeAnchor = usePortalThemeAnchor(open, themeAnchor ?? null);
  const lightUi = useBurneLightTheme(portalThemeAnchor);
  const portalTheme = burneLightThemePortalProps(portalThemeAnchor);

  // Full context with actual motion refs — overrides the placeholder context from DrawerRoot.
  const fullContextValue: DrawerContextValue = useMemo(
    () => ({
      ...baseCtx,
      overlayRef: motion.overlayRef,
      panelRef: motion.panelRef,
      skipCloseAnimRef: motion.skipCloseAnimRef,
    }),
    [baseCtx, motion.overlayRef, motion.panelRef, motion.skipCloseAnimRef],
  );

  if (typeof document === "undefined" || !motion.showPortal) return null;

  return createPortal(
    // Provide full context (with real motion refs) for children inside the portal.
    <DrawerProvider value={fullContextValue}>
      <DrawerPortalShell
        className={className}
        variant={variant}
        placement={placement}
        extent={extent}
        portalTheme={portalTheme}
        lightUi={lightUi}
        titleId={baseCtx.titleId}
        descriptionId={baseCtx.descriptionId}
        hasDescription={baseCtx.hasDescription}
        backdropIsDismissable={backdropIsDismissable}
        panelSegments={panelSegments}
        dialogRef={motion.dialogRef}
        overlayRef={motion.overlayRef}
        panelRef={motion.panelRef}
        bindGlossPanelRef={motion.bindGlossPanelRef}
        onBackdropMouseDown={motion.handleBackdropMouseDown}
        onDialogClose={() => onOpenChange(false)}
        onDialogCancel={(e) => {
          e.preventDefault();
          onOpenChange(false);
        }}
      />
    </DrawerProvider>,
    document.body,
  );
}

DrawerPanel.displayName = "Drawer.Panel";

// ─── DrawerPortalShell ───────────────────────────────────────────────────────

export function DrawerPortalShell({
  className,
  variant,
  placement,
  extent,
  portalTheme,
  lightUi,
  titleId,
  descriptionId,
  hasDescription,
  backdropIsDismissable,
  panelSegments,
  dialogRef,
  overlayRef,
  panelRef,
  bindGlossPanelRef,
  onBackdropMouseDown,
  onDialogClose,
  onDialogCancel,
}: DrawerPortalShellProps) {
  const slotClassNames = useDrawerClassNames();

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
      aria-labelledby={titleId}
      aria-describedby={hasDescription ? descriptionId : undefined}
      className={cn(DRAWER_NATIVE_CLASS, slotClassNames.dialog)}
    >
      <div
        ref={overlayRef}
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
        ref={panelRef}
        tabIndex={-1}
        className={drawerPanelClass({
          variant,
          placement,
          extent,
          className,
          slotClass: slotClassNames.panel,
        })}
      >
        {variant === "gloss" ? (
          <div
            ref={bindGlossPanelRef}
            className={drawerGlossPanelClass({
              placement,
              extent,
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
