import { forwardRef, useLayoutEffect, type Ref } from "react";

import { CloseButton } from "@/components/core/CloseButton";
import { Text } from "@/components/core/Text";

import { DIALOG_CLOSE_DEFAULT_ARIA_LABEL } from "./dialogA11y";
import { mergeDialogSlotClass } from "./dialogAPI";
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
  DialogPortalShellProps,
  DialogTitleProps,
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
