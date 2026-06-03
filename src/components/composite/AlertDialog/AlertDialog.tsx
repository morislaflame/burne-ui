import { animate, remove } from "animejs";
import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  Fragment,
  isValidElement,
  useCallback,
  useContext,
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

import {
  resolveAlertStatus,
  type AlertStatus,
} from "@/components/core/Alert/Alert";
import {
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/core/Button";
import {
  CloseButton,
  type CloseButtonProps,
} from "@/components/core/CloseButton";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "@/components/core/utils/motionTokens";
import { Text, type TextVariant } from "@/components/core/Text";
import {
  SEMANTIC_STATUS_ICON_TEXT_CLASS,
  SEMANTIC_STATUS_ICONS,
  type SemanticStatus,
} from "@/components/core/utils/semanticStatusIcons";
import { cn } from "@/utils/cn";

/** Ширина и типографика панели. */
export type AlertDialogSize = "small" | "base" | "mid" | "large";

/** Размер `Button` в `AlertDialog.Footer` по размеру модалки (имена ступеней совпадают). */
const FOOTER_BUTTON_SIZE: Record<AlertDialogSize, ButtonSize> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};

/** Размер кнопок футера для заданного `size` модалки (если не используете `AlertDialog.Footer` с авто-подстановкой). */
export function footerButtonSizeForAlertDialog(
  dialogSize: AlertDialogSize,
): ButtonSize {
  return FOOTER_BUTTON_SIZE[dialogSize];
}

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

const ALERT_DIALOG_SIZE: Record<
  AlertDialogSize,
  {
    panelMax: string;
    maxHeight: string;
    headerGap: string;
    headerPad: string;
    bodyPad: string;
    footerPad: string;
    headingBlockGap: string;
    iconClass: string;
    titleVariant: TextVariant;
    descVariant: TextVariant;
    descClassName: string;
    bodyVariant: TextVariant;
  }
> = {
  small: {
    panelMax: "max-w-component-small",
    maxHeight: "max-h-[min(85dvh,26rem)]",
    headerGap: "gap-base",
    headerPad: "px-plus pt-plus pb-base",
    bodyPad: "py-base px-plus",
    footerPad: "py-base px-plus gap-small",
    headingBlockGap: "flex min-w-0 flex-col gap-xsmall",
    iconClass: "icon-base",
    titleVariant: "small",
    descVariant: "small",
    descClassName: "text-muted",
    bodyVariant: "small",
  },
  base: {
    panelMax: "max-w-component-mid",
    maxHeight: "max-h-[min(90dvh,36rem)]",
    headerGap: "gap-plus",
    headerPad: "px-mid pt-mid pb-plus",
    bodyPad: "py-plus px-mid",
    footerPad: "py-plus px-mid gap-base",
    headingBlockGap: "flex min-w-0 flex-col gap-base",
    iconClass: "icon-large",
    titleVariant: "mid",
    descVariant: "base",
    descClassName: "text-muted",
    bodyVariant: "base",
  },
  mid: {
    panelMax: "max-w-component-mid",
    maxHeight: "max-h-[min(90dvh,40rem)]",
    headerGap: "gap-plus",
    headerPad: "px-mid pt-mid pb-mid",
    bodyPad: "py-mid px-mid",
    footerPad: "py-mid px-mid gap-base",
    headingBlockGap: "flex min-w-0 flex-col gap-base",
    iconClass: "icon-xlarge",
    titleVariant: "mid",
    descVariant: "base",
    descClassName: "text-muted",
    bodyVariant: "base",
  },
  large: {
    panelMax: "max-w-component-large",
    maxHeight: "max-h-[min(90dvh,44rem)]",
    headerGap: "gap-plus",
    headerPad: "px-large pt-large pb-mid",
    bodyPad: "py-mid px-large",
    footerPad: "py-mid px-mid gap-plus",
    headingBlockGap: "flex min-w-0 flex-col gap-base",
    iconClass: "icon-2xlarge",
    titleVariant: "large",
    descVariant: "mid",
    descClassName: "text-muted",
    bodyVariant: "mid",
  },
};

const ALERT_DIALOG_SHELL_FILLED =
  "bg-surface text-foreground border border-base shadow-token-lg";

function alertDialogPanelClass(tone: AlertStatus): string {
  if (tone === "outline") {
    return "surface-outline text-foreground shadow-token-lg";
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
      return "text-accent";
  }
}

function alertDialogDefaultHeaderIcon(tone: AlertStatus): IconType | null {
  if (tone === "default" || tone === "secondary") return null;
  if (tone === "outline") return IoHelpCircleOutline;
  return SEMANTIC_STATUS_ICONS[tone as SemanticStatus];
}

/** Основная кнопка действия в футере модалки в тон окна. */
export function primaryButtonVariantForAlertTone(
  tone: AlertStatus,
): ButtonVariant {
  switch (tone) {
    case "danger":
      return "danger";
    case "success":
      return "success";
    case "info":
      return "info";
    case "warning":
      return "warning";
    default:
      return "default";
  }
}

function readBurneLightTheme(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.brnTheme === "light";
}

export type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
  /** Как у `Alert`: default, outline, secondary, danger, success, info, warning. */
  status?: AlertStatus;
  /** По умолчанию `m`. */
  size?: AlertDialogSize;
};

type AlertDialogContextValue = {
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (v: boolean) => void;
  onOpenChange: (open: boolean) => void;
  tone: AlertStatus;
  size: AlertDialogSize;
  sizePreset: (typeof ALERT_DIALOG_SIZE)["base"];
  /** Размер кнопок по умолчанию в `AlertDialog.Footer` (см. `footerButtonSizeForAlertDialog`). */
  footerButtonSize: ButtonSize;
};

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

/** Контекст открытого `AlertDialog`: тон, размер, `footerButtonSize` для кнопок футера. */
export function useAlertDialog(): AlertDialogContextValue {
  const ctx = useContext(AlertDialogContext);
  if (!ctx)
    throw new Error("Компоненты AlertDialog.* должны быть внутри <AlertDialog>.");
  return ctx;
}

export type AlertDialogHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Для тона `default` иконки нет по умолчанию — передайте узел, если нужна.
   * Для остальных тонов по умолчанию показывается иконка тона; `null` — скрыть.
   */
  icon?: ReactNode | null;
  /** Кнопка закрытия справа в шапке. По умолчанию `true`. */
  showClose?: boolean;
};

export type AlertDialogTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type AlertDialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type AlertDialogBodyProps = HTMLAttributes<HTMLDivElement>;
export type AlertDialogFooterProps = HTMLAttributes<HTMLDivElement>;

export type AlertDialogCloseProps = CloseButtonProps;

const AlertDialogClose = forwardRef<
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

function AlertDialogHeader({
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

const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
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

function AlertDialogDescription({
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

function AlertDialogHeadingBlock({
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

function AlertDialogBody({
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

function AlertDialogFooter({
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
        "flex shrink-0 flex-wrap items-center justify-end border-t border-base",
        sizePreset.footerPad,
        className,
      )}
      {...rest}
    >
      {footerChildren}
    </div>
  );
}

const AlertDialogRoot = function AlertDialog({
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
  const [mounted, setMounted] = useState(open);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const setHasDescriptionStable = useCallback((v: boolean) => {
    setHasDescription(v);
  }, []);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

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
      if (!cancelled) setMounted(false);
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !mounted) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (prefersReducedInteractiveHoverLift()) {
      overlay.style.opacity = "1";
      panel.style.opacity = "1";
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
  }, [open, mounted]);

  useLayoutEffect(() => {
    if (!open || !mounted || !panelRef.current) return;
    panelRef.current.focus();
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
    footerButtonSize: FOOTER_BUTTON_SIZE[size],
  };

  if (typeof document === "undefined") return null;
  if (!mounted) return null;

  const lightUi = readBurneLightTheme();

  return createPortal(
    <AlertDialogContext.Provider value={ctxValue}>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-mid"
        role="presentation"
        {...(lightUi ? { "data-theme": "light" as const } : {})}
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
          role="alertdialog"
          aria-modal={open ? true : undefined}
          aria-hidden={!open}
          aria-labelledby={titleId}
          aria-describedby={hasDescription ? descriptionId : undefined}
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
      </div>
    </AlertDialogContext.Provider>,
    document.body,
  );
};

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Header: AlertDialogHeader,
  HeadingBlock: AlertDialogHeadingBlock,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Body: AlertDialogBody,
  Footer: AlertDialogFooter,
  Close: AlertDialogClose,
});
