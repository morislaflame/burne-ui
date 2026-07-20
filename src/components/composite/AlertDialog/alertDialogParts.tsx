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
import {
  messageBannerCloseCellClass,
  messageBannerDescriptionCellClass,
  messageBannerGridClass,
  messageBannerIndicatorCellClass,
  messageBannerTitleCellClass,
} from "@/components/core/utils/messageBannerGridLayout";

import {
  alertDialogDefaultHeaderIcon,
  alertDialogHasClose,
  alertDialogHasIndicator,
  alertDialogShowsDefaultHeaderIcon,
  injectFooterButtonSize,
  resolveAlertDialogHeaderGridSlots,
} from "./alertDialogAPI";
import { useAlertDialogModalMotion } from "./alertDialogAnimations";
import {
  AlertDialogHeaderProvider,
  useAlertDialog,
  useAlertDialogClassNames,
  useAlertDialogHeaderContext,
  useOptionalAlertDialogHeaderContext,
} from "./alertDialogContext";
import {
  ALERT_DIALOG_CLOSE_CLASS,
  ALERT_DIALOG_FOOTER_CLASS,
  ALERT_DIALOG_GLOSS_CONTENT_CLASS,
  ALERT_DIALOG_HEADER_CLASS,
  alertDialogHeaderIconWrapperClass,
  ALERT_DIALOG_HEADING_BLOCK_CLASS,
  ALERT_DIALOG_TITLE_CLASS,
  ALERT_DIALOG_INDICATOR_CLASS,
  ALERT_DIALOG_NATIVE_CLASS,
  alertDialogBodyClass,
  alertDialogContentClass,
  alertDialogGlossPanelClass,
  alertDialogOverlayClass,
  alertDialogOverlayEnterStyle,
  alertDialogPanelClass,
} from "./alertDialogStyles";
import type {
  AlertDialogBodyProps,
  AlertDialogCloseProps,
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

export function AlertDialogContent({ className, ...rest }: AlertDialogContentProps) {
  const slotClassNames = useAlertDialogClassNames();

  return (
    <div
      className={alertDialogContentClass(
        cn(slotClassNames.content, className),
      )}
      {...rest}
    />
  );
}

AlertDialogContent.displayName = "AlertDialogContent";

export const AlertDialogClose = forwardRef<HTMLButtonElement, AlertDialogCloseProps>(
  function AlertDialogClose({ className, onClick, ...rest }, ref) {
    const { onOpenChange } = useAlertDialog();
    const headerCtx = useOptionalAlertDialogHeaderContext();
    const slotClassNames = useAlertDialogClassNames();

    return (
      <CloseButton
        ref={ref}
        variant="secondary"
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

export function AlertDialogIndicator({
  className,
  children,
  ...rest
}: AlertDialogIndicatorProps) {
  const { variant, status, sizePreset, gridSlots, headerIcon } =
    useAlertDialogHeaderContext("AlertDialog.Indicator");
  const slotClassNames = useAlertDialogClassNames();

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
}

AlertDialogIndicator.displayName = "AlertDialogIndicator";

export function AlertDialogHeader({
  icon,
  showClose = true,
  className,
  children,
  ...rest
}: AlertDialogHeaderProps) {
  const { variant, status, sizePreset } = useAlertDialog();
  const slotClassNames = useAlertDialogClassNames();
  const compoundHasIndicator = alertDialogHasIndicator(children);
  const compoundHasClose = alertDialogHasClose(children);

  const gridSlots = useMemo(
    () => resolveAlertDialogHeaderGridSlots(variant, status, icon, showClose, children),
    [children, icon, showClose, status, variant],
  );

  const headerCtx = useMemo(
    () => ({ variant, status, sizePreset, gridSlots, headerIcon: icon }),
    [gridSlots, icon, sizePreset, status, variant],
  );

  const showAutoIndicator = gridSlots.hasIndicator && !compoundHasIndicator;
  const showAutoClose = showClose && !compoundHasClose;

  return (
    <AlertDialogHeaderProvider value={headerCtx}>
      <div
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
}

AlertDialogHeader.displayName = "AlertDialogHeader";

export const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  function AlertDialogTitle({ className, id, ...rest }, ref) {
    const { titleId, sizePreset } = useAlertDialog();
    const headerCtx = useOptionalAlertDialogHeaderContext();
    const slotClassNames = useAlertDialogClassNames();

    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="h2"
        variant={sizePreset.titleVariant}
        id={id ?? titleId}
        className={cn(
          ALERT_DIALOG_TITLE_CLASS,
          headerCtx && messageBannerTitleCellClass(headerCtx.gridSlots),
          slotClassNames.title,
          className,
        )}
        {...rest}
      />
    );
  },
);

AlertDialogTitle.displayName = "AlertDialogTitle";

export function AlertDialogDescription({
  className,
  id,
  ...rest
}: AlertDialogDescriptionProps) {
  const { descriptionId, setHasDescription, sizePreset } = useAlertDialog();
  const headerCtx = useOptionalAlertDialogHeaderContext();
  const slotClassNames = useAlertDialogClassNames();

  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <Text
      as="p"
      variant={sizePreset.descVariant}
      id={id ?? descriptionId}
      className={cn(
        sizePreset.descClassName,
        headerCtx && messageBannerDescriptionCellClass(headerCtx.gridSlots),
        slotClassNames.description,
        className,
      )}
      {...rest}
    />
  );
}

AlertDialogDescription.displayName = "AlertDialogDescription";

export function AlertDialogHeadingBlock({
  className,
  ...rest
}: AlertDialogHeadingBlockProps) {
  const slotClassNames = useAlertDialogClassNames();

  return (
    <div
      className={cn(
        ALERT_DIALOG_HEADING_BLOCK_CLASS,
        slotClassNames.headingBlock,
        className,
      )}
      {...rest}
    />
  );
}

AlertDialogHeadingBlock.displayName = "AlertDialogHeadingBlock";

export function AlertDialogBody({ className, children, ...rest }: AlertDialogBodyProps) {
  const { sizePreset } = useAlertDialog();
  const slotClassNames = useAlertDialogClassNames();

  return (
    <div
      className={alertDialogBodyClass(
        sizePreset.bodyPadding,
        cn(slotClassNames.body, className),
      )}
      {...rest}
    >
      <Text variant={sizePreset.bodyVariant} as="div">
        {children}
      </Text>
    </div>
  );
}

AlertDialogBody.displayName = "AlertDialogBody";

export function AlertDialogFooter({ className, children, ...rest }: AlertDialogFooterProps) {
  const { footerButtonSize, sizePreset } = useAlertDialog();
  const slotClassNames = useAlertDialogClassNames();
  const footerChildren = useMemo(
    () => injectFooterButtonSize(children, footerButtonSize),
    [children, footerButtonSize],
  );

  return (
    <div
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
}

AlertDialogFooter.displayName = "AlertDialogFooter";

// ─── AlertDialog.Trigger ──────────────────────────────────────────────────────

export const AlertDialogTrigger = forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  function AlertDialogTrigger(
    { children, asChild, className, onClick, onPointerDown, ...rest },
    forwardedRef,
  ) {
    const { open, onOpenChange } = useAlertDialog();
    const slotClassNames = useAlertDialogClassNames();
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
      [open, openingRef, onOpenChange],
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
          className?: string;
          onPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void;
          onClick?: (e: ReactMouseEvent<HTMLElement>) => void;
          "aria-haspopup"?: string;
          "aria-expanded"?: boolean;
        }>;
        return cloneElement(child, {
          ref: ((node: HTMLElement | null) => {
            triggerRef.current = node;
          }) as unknown as Ref<HTMLElement>,
          className: cn(
            slotClassNames.trigger,
            child.props.className,
            className,
          ),
          onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
            handlePointerDown(e);
            child.props.onPointerDown?.(e);
            onPointerDown?.(e as ReactPointerEvent<HTMLButtonElement>);
          },
          onClick: (e: ReactMouseEvent<HTMLElement>) => {
            child.props.onClick?.(e);
            handleClick(e);
          },
          "aria-haspopup": "dialog" as const,
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
        className={cn(slotClassNames.trigger, className)}
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

AlertDialogTrigger.displayName = "AlertDialog.Trigger";

// ─── AlertDialog.Panel ────────────────────────────────────────────────────────

export function AlertDialogPanel({ className, themeAnchor, children }: AlertDialogPanelProps) {
  const {
    open,
    titleId,
    descriptionId,
    hasDescription,
    variant,
    sizePreset,
  } = useAlertDialog();

  const motion = useAlertDialogModalMotion({ open, variant });

  const portalThemeAnchor = usePortalThemeAnchor(open, themeAnchor ?? null);
  const lightUi = useBurneLightTheme(portalThemeAnchor);
  const portalTheme = burneLightThemePortalProps(portalThemeAnchor);

  if (typeof document === "undefined" || !motion.mounted) return null;

  return createPortal(
    <AlertDialogPortalShell
      className={className}
      variant={variant}
      sizePreset={sizePreset}
      portalTheme={portalTheme}
      lightUi={lightUi}
      titleId={titleId}
      descriptionId={descriptionId}
      hasDescription={hasDescription}
      dialogRef={motion.dialogRef}
      overlayRef={motion.overlayRef}
      panelRef={motion.panelRef}
      bindGlossPanelRef={motion.bindGlossPanelRef}
    >
      {children}
    </AlertDialogPortalShell>,
    document.body,
  );
}

AlertDialogPanel.displayName = "AlertDialog.Panel";

// ─── AlertDialogPortalShell ───────────────────────────────────────────────────

export function AlertDialogPortalShell({
  children,
  className,
  variant,
  sizePreset,
  portalTheme,
  lightUi,
  titleId,
  descriptionId,
  hasDescription,
  dialogRef,
  overlayRef,
  panelRef,
  bindGlossPanelRef,
}: AlertDialogPortalShellProps) {
  const isGloss = variant === "gloss";
  const slotClassNames = useAlertDialogClassNames();

  return (
    <dialog
      {...portalTheme}
      ref={dialogRef}
      role="alertdialog"
      onCancel={(e) => e.preventDefault()}
      aria-labelledby={titleId}
      aria-describedby={hasDescription ? descriptionId : undefined}
      className={cn(
        ALERT_DIALOG_NATIVE_CLASS,
        slotClassNames.dialog,
      )}
    >
      <div
        ref={overlayRef}
        className={alertDialogOverlayClass(lightUi, slotClassNames.overlay)}
        style={alertDialogOverlayEnterStyle()}
        aria-hidden
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={alertDialogPanelClass({
          variant,
          sizePreset,
          className,
          slotClass: slotClassNames.panel,
        })}
      >
        {isGloss ? (
          <div
            ref={bindGlossPanelRef}
            className={alertDialogGlossPanelClass(
              sizePreset.maxHeight,
              slotClassNames.glossPanel,
            )}
          >
            <div
              className={alertDialogContentClass(
                cn(
                  ALERT_DIALOG_GLOSS_CONTENT_CLASS,
                  slotClassNames.glossContent,
                ),
              )}
            >
              {children}
            </div>
          </div>
        ) : (
          <AlertDialogContent>{children}</AlertDialogContent>
        )}
      </div>
    </dialog>
  );
}
