import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type Ref,
  type ReactElement,
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

import { DIALOG_CLOSE_DEFAULT_ARIA_LABEL } from "./dialogA11y";
import { mergeDialogSlotClass } from "./dialogAPI";
import { useDialogModalMotion } from "./dialogAnimations";
import { useDialog, useDialogClassNames } from "./dialogContext";
import {
  DIALOG_CLOSE_CLASS,
  DIALOG_DESCRIPTION_CLASS,
  DIALOG_FOOTER_CLASS,
  DIALOG_GLOSS_CONTENT_CLASS,
  DIALOG_GLOSS_PANEL_CLASS,
  DIALOG_HEADER_CLASS,
  DIALOG_HEADING_BLOCK_CLASS,
  DIALOG_NATIVE_CLASS,
  DIALOG_TITLE_CLASS,
  dialogBodyClass,
  dialogContentClass,
  dialogOverlayClass,
  dialogOverlayEnterStyle,
  dialogPanelClass,
} from "./dialogStyles";
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

export function DialogContent({ className, ...rest }: DialogContentProps) {
  const slotClassNames = useDialogClassNames();

  return (
    <div
      className={dialogContentClass(
        mergeDialogSlotClass(slotClassNames.content, className),
      )}
      {...rest}
    />
  );
}

DialogContent.displayName = "DialogContent";

export function DialogHeader({ className, ...rest }: DialogHeaderProps) {
  const slotClassNames = useDialogClassNames();

  return (
    <div
      className={mergeDialogSlotClass(
        DIALOG_HEADER_CLASS,
        slotClassNames.header,
        className,
      )}
      {...rest}
    />
  );
}

DialogHeader.displayName = "DialogHeader";

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ className, id, ...rest }, ref) {
    const { titleId } = useDialog();
    const slotClassNames = useDialogClassNames();

    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="h2"
        variant="mid"
        id={id ?? titleId}
        className={mergeDialogSlotClass(
          DIALOG_TITLE_CLASS,
          slotClassNames.title,
          className,
        )}
        {...rest}
      />
    );
  },
);

DialogTitle.displayName = "DialogTitle";

export function DialogDescription({
  className,
  id,
  ...rest
}: DialogDescriptionProps) {
  const { descriptionId, setHasDescription } = useDialog();
  const slotClassNames = useDialogClassNames();

  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <Text
      as="p"
      variant="base"
      id={id ?? descriptionId}
      className={mergeDialogSlotClass(
        DIALOG_DESCRIPTION_CLASS,
        slotClassNames.description,
        className,
      )}
      {...rest}
    />
  );
}

DialogDescription.displayName = "DialogDescription";

export function DialogHeadingBlock({
  className,
  ...rest
}: DialogHeadingBlockProps) {
  const slotClassNames = useDialogClassNames();

  return (
    <div
      className={mergeDialogSlotClass(
        DIALOG_HEADING_BLOCK_CLASS,
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
      "aria-label": ariaLabel = DIALOG_CLOSE_DEFAULT_ARIA_LABEL,
      ...rest
    },
    ref,
  ) {
    const { onOpenChange } = useDialog();
    const slotClassNames = useDialogClassNames();

    return (
      <CloseButton
        ref={ref}
        size="small"
        variant="secondary"
        aria-label={ariaLabel}
        className={mergeDialogSlotClass(
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

export function DialogBody({ className, ...rest }: DialogBodyProps) {
  const slotClassNames = useDialogClassNames();

  return (
    <div
      className={dialogBodyClass(
        mergeDialogSlotClass(slotClassNames.body, className),
      )}
      {...rest}
    />
  );
}

DialogBody.displayName = "DialogBody";

export function DialogFooter({ className, ...rest }: DialogFooterProps) {
  const slotClassNames = useDialogClassNames();

  return (
    <div
      className={mergeDialogSlotClass(
        DIALOG_FOOTER_CLASS,
        slotClassNames.footer,
        className,
      )}
      {...rest}
    />
  );
}

DialogFooter.displayName = "DialogFooter";

// ─── Dialog.Trigger ──────────────────────────────────────────────────────────

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger({ children, asChild, onClick, onPointerDown, ...rest }, forwardedRef) {
    const { open, onOpenChange } = useDialog();
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
        // Call e.preventDefault() BEFORE the child's handler so that
        // Button's useFirstLevelInteractiveMotion sees defaultPrevented = true
        // and skips its own animation (we drive it from here instead).
        e.preventDefault();
        runOpenAfterSqueeze({ triggerRef, openingRef, setOpen: () => onOpenChange(true) });
      },
      [open, openingRef, triggerRef, onOpenChange],
    );

    const handleClick = useCallback(
      (e: ReactMouseEvent<HTMLElement>) => {
        onClick?.(e as ReactMouseEvent<HTMLButtonElement>);
        if (e.defaultPrevented) return;
        // Keyboard activation (Enter/Space) doesn't generate pointerDown —
        // open immediately as fallback when openingRef hasn't been set.
        if (!open && !openingRef.current) onOpenChange(true);
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
          // Trigger runs FIRST so e.preventDefault() suppresses child Button animation
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

DialogTrigger.displayName = "Dialog.Trigger";

// ─── Dialog.Panel ─────────────────────────────────────────────────────────────

export function DialogPanel({
  variant = "default",
  dismissOnBackdrop = true,
  className,
  themeAnchor,
  children,
}: DialogPanelProps) {
  const { open, onOpenChange, titleId, descriptionId, hasDescription } = useDialog();

  const motion = useDialogModalMotion({ open, onOpenChange, variant, dismissOnBackdrop });

  const portalThemeAnchor = usePortalThemeAnchor(open, themeAnchor ?? null);
  const lightUi = useBurneLightTheme(portalThemeAnchor);
  const portalTheme = burneLightThemePortalProps(portalThemeAnchor);

  if (typeof document === "undefined" || !motion.mounted) return null;

  // Context (DialogProvider, DialogClassNamesProvider) flows through the React
  // component tree, not the DOM tree — so portal children inherit it correctly.
  return createPortal(
    <DialogPortalShell
      className={className}
      variant={variant}
      portalTheme={portalTheme}
      lightUi={lightUi}
      titleId={titleId}
      descriptionId={descriptionId}
      hasDescription={hasDescription}
      dialogRef={motion.dialogRef}
      overlayRef={motion.overlayRef}
      panelRef={motion.panelRef}
      bindGlossPanelRef={motion.bindGlossPanelRef}
      onBackdropMouseDown={motion.handleBackdropPointerDown}
      onDialogClose={() => onOpenChange(false)}
    >
      {children}
    </DialogPortalShell>,
    document.body,
  );
}

DialogPanel.displayName = "Dialog.Panel";

// ─── DialogPortalShell ───────────────────────────────────────────────────────

export function DialogPortalShell({
  children,
  className,
  variant,
  portalTheme,
  lightUi,
  titleId,
  descriptionId,
  hasDescription,
  dialogRef,
  overlayRef,
  panelRef,
  bindGlossPanelRef,
  onBackdropMouseDown,
  onDialogClose,
}: DialogPortalShellProps) {
  const slotClassNames = useDialogClassNames();

  return (
    <dialog
      {...portalTheme}
      ref={dialogRef}
      onClose={onDialogClose}
      aria-labelledby={titleId}
      aria-describedby={hasDescription ? descriptionId : undefined}
      className={mergeDialogSlotClass(DIALOG_NATIVE_CLASS, slotClassNames.dialog)}
    >
      <div
        ref={overlayRef}
        className={dialogOverlayClass(lightUi, slotClassNames.overlay)}
        style={dialogOverlayEnterStyle()}
        aria-hidden
        onMouseDown={onBackdropMouseDown}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={dialogPanelClass({
          variant,
          className,
          slotClass: slotClassNames.panel,
        })}
      >
        {variant === "gloss" ? (
          <div
            ref={bindGlossPanelRef}
            className={mergeDialogSlotClass(
              DIALOG_GLOSS_PANEL_CLASS,
              slotClassNames.glossPanel,
            )}
          >
            <div
              className={dialogContentClass(
                mergeDialogSlotClass(
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
