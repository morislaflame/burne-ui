import { animate, remove } from "animejs";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type { IconType } from "react-icons";
import { IoHelpCircleOutline } from "react-icons/io5";

import {
  resolveAlertStatus,
  type AlertStatus,
  type AlertVariant,
} from "@/components/core/Alert/Alert";
import type { ButtonVariant } from "@/components/core/Button";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "@/components/core/utils/motionTokens";
import {
  SEMANTIC_STATUS_ICON_TEXT_CLASS,
  SEMANTIC_STATUS_ICONS,
  type SemanticStatus,
} from "@/components/core/utils/semanticStatusIcons";
import { cn } from "@/utils/cn";

/** Ширина и типографика панели. */
export type AlertDialogSize =
  | "small"
  | "base"
  | "large"
  | "xlarge";

const ALERT_DIALOG_SIZE: Record<
  AlertDialogSize,
  {
    panelMax: string;
    maxHeight: string;
    headerGap: string;
    headerPad: string;
    bodyPad: string;
    bodyText: string;
    footerPad: string;
    headingBlockGap: string;
    title: string;
    desc: string;
    iconClass: string;
  }
> = {
  small: {
    panelMax: "max-w-sm",
    maxHeight: "max-h-[min(85dvh,26rem)]",
    headerGap: "gap-2",
    headerPad: "px-3 pt-3 pb-2",
    bodyPad: "py-base px-plus",
    bodyText: "text-xs text-foreground leading-normal",
    footerPad: "py-base px-plus gap-small",
    headingBlockGap: "flex min-w-0 flex-col gap-xsmall",
    title: "text-xs font-medium leading-snug text-foreground",
    desc: "text-xs leading-normal text-muted",
    iconClass: "icon-base",
  },
  base: {
    panelMax: "max-w-lg",
    maxHeight: "max-h-[min(90dvh,36rem)]",
    headerGap: "gap-3",
    headerPad: "px-4 pt-4 pb-3",
    bodyPad: "py-plus px-mid",
    bodyText: "text-sm text-foreground leading-normal",
    footerPad: "py-plus px-mid gap-base",
    headingBlockGap: "flex min-w-0 flex-col gap-base",
    title: "text-mid text-foreground",
    desc: "text-sm leading-normal text-muted",
    iconClass: "icon-mid",
  },
  large: {
    panelMax: "max-w-2xl",
    maxHeight: "max-h-[min(90dvh,44rem)]",
    headerGap: "gap-3.5",
    headerPad: "px-5 pt-5 pb-4",
    bodyPad: "py-mid px-large",
    bodyText: "text-base text-foreground",
    footerPad: "py-mid px-large gap-base",
    headingBlockGap: "flex min-w-0 flex-col gap-base",
    title: "text-base text-foreground",
    desc: "text-base text-muted",
    iconClass: "icon-large",
  },
  xlarge: {
    panelMax: "max-w-4xl",
    maxHeight: "max-h-[min(92dvh,52rem)]",
    headerGap: "gap-4",
    headerPad: "px-6 pt-6 pb-5",
    bodyPad: "py-large px-xlarge",
    bodyText: "text-lg text-foreground leading-normal",
    footerPad: "py-large px-xlarge gap-[0.625rem]",
    headingBlockGap: "flex min-w-0 flex-col gap-[0.625rem]",
    title: "text-lg font-medium leading-snug text-foreground",
    desc: "text-lg leading-normal text-muted",
    iconClass: "icon-xlarge",
  },
};

/** Панель: один нейтральный фон для заполненных тонов; outline — размытие. */
const ALERT_DIALOG_INLINE_OUTLINE =
  "border border-border shadow-none bg-surface/65 text-foreground backdrop-blur-[14px] backdrop-saturate-150 motion-reduce:bg-surface motion-reduce:backdrop-blur-none";

const ALERT_DIALOG_SHELL_FILLED =
  "bg-surface text-foreground border border-border shadow-sm";

function alertDialogPanelClass(tone: AlertStatus): string {
  if (tone === "outline") {
    return ALERT_DIALOG_INLINE_OUTLINE;
  }
  return ALERT_DIALOG_SHELL_FILLED.replace("shadow-sm", "shadow-lg");
}

function alertDialogShowsDefaultHeaderIcon(tone: AlertStatus): boolean {
  return tone !== "default";
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
  if (tone === "default") return null;
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
  /** Как у `Alert`: default, outline, danger, success, info и `warning` через `status`. */
  variant?: AlertVariant;
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
};

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

function useAlertDialog() {
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
};

export type AlertDialogTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type AlertDialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type AlertDialogBodyProps = HTMLAttributes<HTMLDivElement>;
export type AlertDialogFooterProps = HTMLAttributes<HTMLDivElement>;

function AlertDialogHeader({
  icon,
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
            "shrink-0 leading-none [&_svg]:block",
            iconColor,
          )}
        >
          {iconSlot}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  function AlertDialogTitle({ className = "", id, ...rest }, ref) {
    const { titleId, sizePreset } = useAlertDialog();
    return (
      <h2
        ref={ref}
        id={id ?? titleId}
        className={cn("min-w-0", sizePreset.title, className)}
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
    <p
      id={id ?? descriptionId}
      className={cn(sizePreset.desc, className)}
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
        "min-w-0 flex-1",
        className,
      )}
      {...rest}
    />
  );
}

function AlertDialogBody({ className = "", ...rest }: AlertDialogBodyProps) {
  const { sizePreset } = useAlertDialog();
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto",
        sizePreset.bodyPad,
        sizePreset.bodyText,
        className,
      )}
      {...rest}
    />
  );
}

function AlertDialogFooter({ className = "", ...rest }: AlertDialogFooterProps) {
  const { sizePreset } = useAlertDialog();
  return (
    <div
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-end border-t border-border",
        sizePreset.footerPad,
        className,
      )}
      {...rest}
    />
  );
}

const AlertDialogRoot = function AlertDialog({
  open,
  onOpenChange,
  children,
  className = "",
  variant,
  status,
  size = "base",
}: AlertDialogProps) {
  const tone = resolveAlertStatus(status, variant);
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
  };

  if (typeof document === "undefined") return null;
  if (!mounted) return null;

  const lightUi = readBurneLightTheme();

  return createPortal(
    <AlertDialogContext.Provider value={ctxValue}>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
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
            "relative z-10 flex min-h-0 w-full flex-col overflow-hidden rounded-xl outline-none",
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
});
