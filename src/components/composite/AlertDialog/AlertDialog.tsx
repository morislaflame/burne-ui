import { animate, remove } from "animejs";
import {
  Children,
  cloneElement,
  forwardRef,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import type { IconType } from "react-icons";
import { IoHelpCircleOutline } from "react-icons/io5";

import { resolveAlertStatus, type AlertStatus } from "@/components/core/Alert/alertUtils";
import {
  Button,
  type ButtonProps,
  type ButtonSize,
} from "@/components/core/Button";
import { CloseButton } from "@/components/core/CloseButton";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "@/components/core/utils/motionTokens";
import { Text } from "@/components/core/Text";
import {
  SEMANTIC_STATUS_ICON_TEXT_CLASS,
  SEMANTIC_STATUS_ICONS,
  type SemanticStatus,
} from "@/components/core/utils/semanticStatusIcons";
import { cn } from "@/utils/cn";

import { footerButtonSizeForAlertDialog } from "./alertDialogFooterUtils";
import { ALERT_DIALOG_SIZE } from "./alertDialogSizePresets";
import type {
  AlertDialogBodyProps,
  AlertDialogCloseProps,
  AlertDialogContextValue,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogProps,
  AlertDialogTitleProps,
} from "./alertDialogTypes";
import { AlertDialogContext, useAlertDialog } from "./useAlertDialog";

export type {
  AlertDialogBodyProps,
  AlertDialogCloseProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogProps,
  AlertDialogSize,
  AlertDialogTitleProps,
} from "./alertDialogTypes";

function injectFooterButtonSize(
  children: ReactNode,
  buttonSize: ButtonSize,
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    if (child.type === Button) {
      const props = child.props as ButtonProps;
      return cloneElement(child as ReactElement<ButtonProps>, {
        size: props.size ?? buttonSize,
      });
    }
    if (child.type === Fragment) {
      const f = child as ReactElement<{ children?: ReactNode }>;
      return (
        <Fragment key={f.key ?? undefined}>
          {injectFooterButtonSize(f.props.children, buttonSize)}
        </Fragment>
      );
    }
    return child;
  });
}

const ALERT_DIALOG_SHELL_FILLED =
  "bg-surface text-foreground border-token shadow-token-lg";

function alertDialogPanelClass(tone: AlertStatus): string {
  if (tone === "outline") {
    return "bordered-transparent text-foreground shadow-token-lg";
  }
  if (tone === "secondary") {
    return "surface-secondary text-foreground shadow-token-lg";
  }
  return ALERT_DIALOG_SHELL_FILLED;
}

function alertDialogShowsDefaultHeaderIcon(tone: AlertStatus): boolean {
  return tone !== "default" && tone !== "secondary";
}

function alertDialogHeaderIconWrapperClass(tone: AlertStatus): string {
  switch (tone) {
    case "danger":
      return SEMANTIC_STATUS_ICON_TEXT_CLASS.danger;
    case "success":
      return SEMANTIC_STATUS_ICON_TEXT_CLASS.success;
    case "info":
      return SEMANTIC_STATUS_ICON_TEXT_CLASS.info;
    case "warning":
      return SEMANTIC_STATUS_ICON_TEXT_CLASS.warning;
    default:
      return "text-primary";
  }
}

function alertDialogDefaultHeaderIcon(tone: AlertStatus): IconType | null {
  if (tone === "default" || tone === "secondary") return null;
  if (tone === "outline") return IoHelpCircleOutline;
  return SEMANTIC_STATUS_ICONS[tone as SemanticStatus];
}

function readBurneLightTheme(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.brnTheme === "light";
}

export const AlertDialogClose = forwardRef<
  HTMLButtonElement,
  AlertDialogCloseProps
>(function AlertDialogClose(
  { className = "", onClick, ...rest },
  ref,
) {
  const { onOpenChange } = useAlertDialog();
  return (
    <CloseButton
      ref={ref}
      className={cn("shrink-0 self-start", className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onOpenChange(false);
      }}
      {...rest}
    />
  );
});

AlertDialogClose.displayName = "AlertDialog.Close";

export function AlertDialogHeader({
  icon,
  showClose = true,
  className = "",
  children,
  ...rest
}: AlertDialogHeaderProps) {
  const { tone, sizePreset } = useAlertDialog();
  const iconColor = alertDialogHeaderIconWrapperClass(tone);
  const HeaderDefaultIcon = alertDialogDefaultHeaderIcon(tone);

  let iconSlot: ReactNode | null;
  if (icon === null) iconSlot = null;
  else if (icon !== undefined) iconSlot = icon;
  else if (
    alertDialogShowsDefaultHeaderIcon(tone) &&
    HeaderDefaultIcon !== null
  )
    iconSlot = (
      <HeaderDefaultIcon aria-hidden className={sizePreset.iconClass} />
    );
  else iconSlot = null;

  return (
    <div
      className={cn(
        "flex shrink-0 items-start",
        sizePreset.headerGap,
        sizePreset.headerPad,
        className,
      )}
      {...rest}
    >
      {iconSlot !== null ? (
        <span
          className={cn(
            "shrink-0 [&_svg]:block",
            iconColor,
          )}
        >
          {iconSlot}
        </span>
      ) : null}
      <div className="min-w-0 flex-1 text-left">{children}</div>
      {showClose ? <AlertDialogClose /> : null}
    </div>
  );
}

export const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  function AlertDialogTitle({ className = "", id, ...rest }, ref) {
    const { titleId, sizePreset } = useAlertDialog();
    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="h2"
        variant={sizePreset.titleVariant}
        id={id ?? titleId}
        {...rest}
      />
    );
  },
);

export function AlertDialogDescription({
  className = "",
  id,
  ...rest
}: AlertDialogDescriptionProps) {
  const { descriptionId, setHasDescription, sizePreset } = useAlertDialog();
  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <Text
      as="p"
      variant={sizePreset.descVariant}
      id={id ?? descriptionId}
      className={cn(sizePreset.descClassName, className)}
      {...rest}
    />
  );
}

export function AlertDialogHeadingBlock({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { sizePreset } = useAlertDialog();
  return (
    <div
      className={cn(
        sizePreset.headingBlockGap,
        "min-w-0 flex-1 text-left",
        className,
      )}
      {...rest}
    />
  );
}

export function AlertDialogBody({
  className = "",
  children,
  ...rest
}: AlertDialogBodyProps) {
  const { sizePreset } = useAlertDialog();
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto text-left",
        sizePreset.bodyPad,
        className,
      )}
      {...rest}
    >
      <Text
        variant={sizePreset.bodyVariant}
        as="div"
      >
        {children}
      </Text>
    </div>
  );
}

export function AlertDialogFooter({
  className = "",
  children,
  ...rest
}: AlertDialogFooterProps) {
  const { sizePreset, footerButtonSize } = useAlertDialog();
  const footerChildren = useMemo(
    () => injectFooterButtonSize(children, footerButtonSize),
    [children, footerButtonSize],
  );
  return (
    <div
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-end border-t-token",
        sizePreset.footerPad,
        className,
      )}
      {...rest}
    >
      {footerChildren}
    </div>
  );
}

export const AlertDialogRoot = function AlertDialog({
  open,
  onOpenChange,
  children,
  className = "",
  status,
  size = "base",
}: AlertDialogProps) {
  const tone = resolveAlertStatus(status);
  const sizePreset = ALERT_DIALOG_SIZE[size];

  const titleId = useId();
  const descriptionId = useId();
  const [hasDescription, setHasDescription] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const setHasDescriptionStable = useCallback((v: boolean) => {
    setHasDescription(v);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  useEffect(() => {
    if (open || !mounted) return;

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    let cancelled = false;

    const finishClose = () => {
      if (!cancelled) {
        dialogRef.current?.close();
        setMounted(false);
      }
    };

    if (!overlay || !panel) {
      finishClose();
      return undefined;
    }

    if (prefersReducedInteractiveHoverLift()) {
      finishClose();
      return undefined;
    }

    remove(overlay);
    remove(panel);
    const animOverlay = animate(overlay, {
      opacity: [1, 0],
      duration: 200,
      ease: MOTION_INTERACTIVE_EASE,
    });
    const animPanel = animate(panel, {
      opacity: [1, 0],
      scale: [1, 0.97],
      duration: MOTION_INTERACTIVE_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });

    void Promise.all([
      Promise.resolve(animOverlay),
      Promise.resolve(animPanel),
    ]).then(finishClose);

    return () => {
      cancelled = true;
      remove(overlay);
      remove(panel);
    };
  }, [open, mounted]);

  useLayoutEffect(() => {
    if (!open) return;
    if (!mounted) {
      setMounted(true);
      return;
    }

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (prefersReducedInteractiveHoverLift()) {
      overlay.style.opacity = "1";
      panel.style.opacity = "1";
      panel.focus();
      return;
    }

    remove(overlay);
    remove(panel);
    animate(overlay, {
      opacity: [0, 1],
      duration: 200,
      ease: MOTION_INTERACTIVE_EASE,
    });
    animate(panel, {
      opacity: [0, 1],
      scale: [0.97, 1],
      duration: MOTION_INTERACTIVE_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });
    panel.focus();
  }, [open, mounted]);

  const ctxValue: AlertDialogContextValue = {
    titleId,
    descriptionId,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange,
    tone,
    size,
    sizePreset,
    footerButtonSize: footerButtonSizeForAlertDialog(size),
  };

  if (typeof document === "undefined") return null;
  if (!mounted) return null;

  const lightUi = readBurneLightTheme();

  return createPortal(
    <AlertDialogContext.Provider value={ctxValue}>
      <dialog
        ref={dialogRef}
        role="alertdialog"
        onCancel={(e) => e.preventDefault()}
        aria-labelledby={titleId}
        aria-describedby={hasDescription ? descriptionId : undefined}
        className="fixed inset-0 z-[100] m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-mid open:flex"
      >
        <div
          ref={overlayRef}
          className={cn(
            "absolute inset-0",
            lightUi
              ? "bg-[color-mix(in_oklab,var(--color-foreground)_14%,transparent)] backdrop-blur-[14px] backdrop-saturate-150 motion-reduce:backdrop-blur-none"
              : "bg-[color-mix(in_oklab,black_58%,transparent)]",
          )}
          style={{ opacity: prefersReducedInteractiveHoverLift() ? 1 : 0 }}
          aria-hidden
        />
        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            "relative z-10 flex min-h-0 w-full flex-col overflow-hidden rounded-mid text-left outline-none",
            sizePreset.panelMax,
            sizePreset.maxHeight,
            alertDialogPanelClass(tone),
            className,
          )}
          style={
            prefersReducedInteractiveHoverLift()
              ? undefined
              : { opacity: 0 }
          }
        >
          {children}
        </div>
      </dialog>
    </AlertDialogContext.Provider>,
    document.body,
  );
};

