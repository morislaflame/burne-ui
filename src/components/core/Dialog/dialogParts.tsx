import { Children, cloneElement, forwardRef, isValidElement, useCallback, useLayoutEffect, useRef, type ForwardedRef, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactElement, type Ref } from "react";
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

import { useDialogModalMotion, DIALOG_MOTION_DEFAULTS } from "./dialogAnimations";
import { useDialog, useDialogClassNames, useDialogMotionScope, useOptionalDialogMotionScope, DialogMotionProvider } from "./dialogContext";
import { DIALOG_CLOSE_CLASS, DIALOG_FOOTER_CLASS, DIALOG_GLOSS_CONTENT_CLASS, DIALOG_HEADER_CLASS, DIALOG_HEADING_BLOCK_CLASS, DIALOG_TITLE_CLASS, DIALOG_TRIGGER_BASE_CLASS, dialogBodyClass, dialogContentClass, dialogGlossPanelClass, dialogNativeClass, dialogOverlayClass, dialogOverlayEnterStyle, dialogPanelClass } from "./dialogStyles";
import type {
  DialogBodyProps,
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogHeadingBlockProps,
  DialogPanelProps,
  DialogPortalShellProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "./dialogTypes";
import { useDialogFooterState } from "./useDialogFooterState";

import { cn } from "@/utils/cn";

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent({ className, motion, ...rest }, ref) {
    const slotClassNames = useDialogClassNames();
    const { setRef } = useMotionPart<HTMLDivElement>({
      scope: useOptionalDialogMotionScope(),
      slot: "content",
      motion,
      forwardedRef: ref,
    });

    return (
      <div
        ref={setRef}
        className={dialogContentClass(
          cn(slotClassNames.content, className),
        )}
        {...rest}
      />
    );
  },
);

DialogContent.displayName = "DialogContent";

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  function DialogHeader({ className, motion, ...rest }, ref) {
    const { sizePreset } = useDialog();
    const slotClassNames = useDialogClassNames();
    const { setRef } = useMotionPart<HTMLDivElement>({
      scope: useOptionalDialogMotionScope(),
      slot: "header",
      motion,
      forwardedRef: ref,
    });

    return (
      <div
        ref={setRef}
        className={cn(
          DIALOG_HEADER_CLASS,
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

DialogHeader.displayName = "DialogHeader";

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle(
    { className, id, motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
    const { titleId, setHasTitle, sizePreset } = useDialog();
    const slotClassNames = useDialogClassNames();
    const { setRef, pointerHandlers } = useMotionPart<HTMLHeadingElement>({
      scope: useOptionalDialogMotionScope(),
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
          DIALOG_TITLE_CLASS,
          sizePreset.titleClassName,
          slotClassNames.title,
          className,
        )}
        {...rest}
        {...pointerHandlers}
      />
    );
  },
);

DialogTitle.displayName = "DialogTitle";

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(function DialogDescription(
  { className, id, motion, onPointerOver, onPointerOut, ...rest },
  ref,
) {
  const { descriptionId, setHasDescription, sizePreset } = useDialog();
  const slotClassNames = useDialogClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLParagraphElement>({
    scope: useOptionalDialogMotionScope(),
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
      {...rest}
      {...pointerHandlers}
    />
  );
});

DialogDescription.displayName = "DialogDescription";

export function DialogHeadingBlock({
  className,
  ...rest
}: DialogHeadingBlockProps) {
  const { sizePreset } = useDialog();
  const slotClassNames = useDialogClassNames();

  return (
    <div
      className={cn(
        DIALOG_HEADING_BLOCK_CLASS,
        sizePreset.headingGap,
        slotClassNames.headingBlock,
        className,
      )}
      {...rest}
    />
  );
}

DialogHeadingBlock.displayName = "DialogHeadingBlock";

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose(
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
    const { onOpenChange, sizePreset } = useDialog();
    const slotClassNames = useDialogClassNames();
    const { setRef } = useMotionPart<HTMLButtonElement>({
      scope: useOptionalDialogMotionScope(),
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
          DIALOG_CLOSE_CLASS,
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

DialogClose.displayName = "DialogClose";

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  function DialogBody({ className, ...rest }, ref) {
    const { sizePreset } = useDialog();
    const slotClassNames = useDialogClassNames();

    return (
      <div
        ref={ref}
        className={dialogBodyClass(
          sizePreset.bodyPadding,
          cn(slotClassNames.body, className),
        )}
        {...rest}
      />
    );
  },
);

DialogBody.displayName = "DialogBody";

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  function DialogFooter({ className, children, motion, ...rest }, ref) {
    const { sizePreset } = useDialog();
    const slotClassNames = useDialogClassNames();
    const footerChildren = useDialogFooterState(children);
    const { setRef } = useMotionPart<HTMLDivElement>({
      scope: useOptionalDialogMotionScope(),
      slot: "footer",
      motion,
      forwardedRef: ref,
    });

    return (
      <div
        ref={setRef}
        className={cn(
          DIALOG_FOOTER_CLASS,
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

DialogFooter.displayName = "DialogFooter";

// ─── Dialog.Trigger ──────────────────────────────────────────────────────────

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger({ children, asChild, className, onClick, onPointerDown, onKeyDown, ...rest }, forwardedRef) {
    const { open, onOpenChange } = useDialog();
    const slotClassNames = useDialogClassNames();
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
        // Call e.preventDefault() BEFORE the child's handler so that
        // Button's useFirstLevelInteractiveMotion sees defaultPrevented = true
        // and skips its own animation (we drive it from here instead).
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
        // Suppress native click + child Button keyboard squeeze — Trigger drives open.
        e.preventDefault();
        runOpenAfterSqueeze({ triggerRef, openingRef, setOpen: () => onOpenChange(true), config });
      },
      [onKeyDown, open, openingRef, onOpenChange, triggerRef, config],
    );

    const handleClick = useCallback(
      (e: ReactMouseEvent<HTMLElement>) => {
        onClick?.(e as ReactMouseEvent<HTMLButtonElement>);
        if (e.defaultPrevented) return;
        // Pointer path opens via pointerDown; keyboard via keydown + preventDefault.
        // Keep click fallback only if neither path started opening.
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
              className: cn(DIALOG_TRIGGER_BASE_CLASS, slotClassNames.trigger, className),
              // Host runs before child so e.preventDefault() suppresses Button animation
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
        className={cn(DIALOG_TRIGGER_BASE_CLASS, slotClassNames.trigger, className)}
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

DialogTrigger.displayName = "Dialog.Trigger";

// ─── Dialog.Panel ─────────────────────────────────────────────────────────────

export const DialogPanel = forwardRef<HTMLDivElement, DialogPanelProps>(
  function DialogPanel({ motion, ...props }, forwardedRef) {
    const parentScope = useOptionalDialogMotionScope();
    const merged = mergeMotionSlotMaps(parentScope?.getRootMotion(), motion);
    return (
      <DialogMotionProvider motion={merged} defaults={DIALOG_MOTION_DEFAULTS}>
        <DialogPanelHost {...props} forwardedRef={forwardedRef} />
      </DialogMotionProvider>
    );
  },
);

DialogPanel.displayName = "Dialog.Panel";

function DialogPanelHost({
  variant = "default",
  dismissOnBackdrop = true,
  className,
  style,
  themeAnchor,
  portalContainer: portalContainerProp,
  children,
  forwardedRef,
  ...rest
}: Omit<DialogPanelProps, "motion"> & { forwardedRef?: ForwardedRef<HTMLDivElement> }) {
  const {
    open,
    onOpenChange,
    titleId,
    descriptionId,
    hasTitle,
    hasDescription,
    sizePreset,
    portalContainer: portalContainerFromRoot,
  } = useDialog();
  const motionScope = useDialogMotionScope();

  const portalHost = resolvePortalContainer(
    portalContainerProp ?? portalContainerFromRoot,
  );
  const contained = isContainedPortal(portalHost);

  const motion = useDialogModalMotion({
    open,
    onOpenChange,
    variant,
    dismissOnBackdrop,
    contained,
    motionScope,
  });

  const portalThemeAnchor = usePortalThemeAnchor(open, themeAnchor ?? null);
  const lightUi = useBurneLightTheme(portalThemeAnchor);
  const portalTheme = burneLightThemePortalProps(portalThemeAnchor);

  if (typeof document === "undefined" || !motion.showPortal || !portalHost) return null;

  return createPortal(
    <DialogPortalShell
      className={className}
      style={style}
      variant={variant}
      sizePreset={sizePreset}
      portalTheme={portalTheme}
      lightUi={lightUi}
      titleId={titleId}
      descriptionId={descriptionId}
      hasTitle={hasTitle}
      hasDescription={hasDescription}
      dialogRef={motion.dialogRef}
      overlayRef={motion.overlayRef}
      panelRef={motion.panelRef}
      panelForwardedRef={forwardedRef}
      panelRest={rest}
      bindGlossPanelRef={motion.bindGlossPanelRef}
      onBackdropMouseDown={motion.handleBackdropPointerDown}
      onDialogClose={() => onOpenChange(false)}
      onDialogCancel={(e) => {
        e.preventDefault();
        onOpenChange(false);
      }}
      contained={contained}
    >
      {children}
    </DialogPortalShell>,
    portalHost,
  );
}

// ─── DialogPortalShell ───────────────────────────────────────────────────────

export function DialogPortalShell({
  children,
  className,
  style,
  variant,
  sizePreset,
  portalTheme,
  lightUi,
  titleId,
  descriptionId,
  hasTitle,
  hasDescription,
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
}: DialogPortalShellProps) {
  const isGloss = variant === "gloss";
  const slotClassNames = useDialogClassNames();
  const motionScope = useOptionalDialogMotionScope();

  return (
    <dialog
      {...portalTheme}
      ref={dialogRef}
      onClose={onDialogClose}
      onCancel={onDialogCancel}
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={hasDescription ? descriptionId : undefined}
      className={cn(dialogNativeClass(contained), slotClassNames.dialog)}
    >
      <div
        ref={mergeRefs(overlayRef, (node) => motionScope?.registerTarget("overlay", node))}
        className={dialogOverlayClass(lightUi, slotClassNames.overlay)}
        style={dialogOverlayEnterStyle()}
        aria-hidden
        onMouseDown={onBackdropMouseDown}
      />
      <div
        ref={mergeRefs(panelRef, panelForwardedRef, (node) => motionScope?.registerTarget("panel", node))}
        tabIndex={-1}
        className={dialogPanelClass({
          variant,
          sizePreset,
          className,
          slotClass: slotClassNames.panel,
        })}
        style={style}
        {...panelRest}
      >
        {isGloss ? (
          <div
            ref={bindGlossPanelRef}
            className={dialogGlossPanelClass({
              maxHeight: sizePreset.maxHeight,
              rounded: sizePreset.rounded,
              slotClass: slotClassNames.glossPanel,
            })}
          >
            <div
              className={dialogContentClass(
                cn(
                  DIALOG_GLOSS_CONTENT_CLASS,
                  slotClassNames.glossContent,
                ),
                true,
              )}
            >
              {children}
            </div>
          </div>
        ) : (
          <DialogContent>{children}</DialogContent>
        )}
      </div>
    </dialog>
  );
}
