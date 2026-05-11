import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  type HTMLAttributes,
} from "react";
import type { IconType } from "react-icons";
import { IoHelpCircleOutline } from "react-icons/io5";

import { useInteractiveHoverLiftContainerHandlers } from "@/components/core/utils/hoverInteractiveLift";
import {
  SEMANTIC_STATUS_ICON_TEXT_CLASS,
  SEMANTIC_STATUS_ICONS,
  type SemanticStatus,
} from "@/components/core/utils/semanticStatusIcons";
import { cn } from "@/utils/cn";

/** Визуальный вариант заливки (без отдельного статуса). */
export type AlertVariant =
  | "default"
  | "outline"
  | "danger"
  | "success"
  | "info";

export type AlertStatus = AlertVariant | "warning";

export function resolveAlertStatus(
  status?: AlertStatus,
  variant?: AlertVariant,
): AlertStatus {
  return status ?? variant ?? "default";
}

function alertShowsDefaultIndicatorIcon(tone: AlertStatus): boolean {
  return tone !== "default";
}

/**
 * Компактный Alert: фон по семантике типа (тинты surface).
 * default — плотный surface; outline — матовое стекло с размытием.
 */
const ALERT_INLINE_OUTLINE =
  "border border-border shadow-none bg-surface/65 text-foreground backdrop-blur-[14px] backdrop-saturate-150 motion-reduce:bg-surface motion-reduce:backdrop-blur-none";

const ALERT_INLINE_SURFACE_CLASSES: Record<AlertStatus, string> = {
  default:
    "border border-border bg-surface text-foreground shadow-sm",
  outline: ALERT_INLINE_OUTLINE,
  danger: "bg-surface-tint-danger text-foreground",
  success: "bg-surface-tint-success text-foreground",
  info: "bg-surface-tint-info text-foreground",
  warning: "bg-surface-tint-warning text-foreground",
};

function alertIndicatorWrapperTextClass(tone: AlertStatus): string {
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

function alertDefaultIndicatorIcon(tone: AlertStatus): IconType | null {
  if (tone === "default") return null;
  if (tone === "outline") return IoHelpCircleOutline;
  return SEMANTIC_STATUS_ICONS[tone as SemanticStatus];
}

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  status?: AlertStatus;
};

type AlertIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  status?: AlertStatus;
};
type AlertContentProps = HTMLAttributes<HTMLDivElement>;
type AlertMessageProps = HTMLAttributes<HTMLDivElement>;
type AlertTitleProps = HTMLAttributes<HTMLDivElement>;
type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>;
type AlertActionProps = HTMLAttributes<HTMLDivElement>;

const AlertStatusContext = createContext<AlertStatus>("default");

function AlertIndicator({
  status,
  className = "",
  children,
  ...rest
}: AlertIndicatorProps) {
  const statusFromContext = useContext(AlertStatusContext);
  const tone = status ?? statusFromContext;

  if (children === null) return null;

  const DefaultIcon = alertDefaultIndicatorIcon(tone);
  const inner =
    children !== undefined
      ? children
      : alertShowsDefaultIndicatorIcon(tone) && DefaultIcon !== null
        ? <DefaultIcon aria-hidden className="size-6" />
        : null;

  if (inner === null) return null;

  return (
    <span
      className={cn(
        "mt-0.5 shrink-0 [&_svg]:size-4",
        alertIndicatorWrapperTextClass(tone),
        className,
      )}
      {...rest}
    >
      {inner}
    </span>
  );
}

function AlertContent({ className = "", ...rest }: AlertContentProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-xsmall",
        className,
      )}
      {...rest}
    />
  );
}

const AlertMessage = forwardRef<HTMLDivElement, AlertMessageProps>(
  function AlertMessage({ className = "", ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex min-w-0 flex-1 items-start gap-3", className)}
        {...rest}
      />
    );
  },
);

function AlertTitle({ className = "", ...rest }: AlertTitleProps) {
  return (
    <div className={cn("font-medium text-sm leading-snug", className)} {...rest} />
  );
}

function AlertDescription({
  className = "",
  ...rest
}: AlertDescriptionProps) {
  return (
    <div
      className={cn("text-sm leading-normal text-muted", className)}
      {...rest}
    />
  );
}

function AlertAction({ className = "", ...rest }: AlertActionProps) {
  return <div className={cn("shrink-0 self-start", className)} {...rest} />;
}

const AlertRoot = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant,
    status,
    className = "",
    children,
    onPointerOver: onPointerOverProp,
    onPointerOut: onPointerOutProp,
    ...rest
  },
  ref,
) {
  const tone = resolveAlertStatus(status, variant);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const liftPointerHandlers = useInteractiveHoverLiftContainerHandlers(rootRef, true);

  return (
    <AlertStatusContext.Provider value={tone}>
      <div
        ref={setRootRef}
        role="status"
        className={cn(
          "flex w-fit max-w-component-base items-start gap-plus rounded-xl py-plus px-mid",
          ALERT_INLINE_SURFACE_CLASSES[tone],
          className,
        )}
        onPointerOver={(e) => {
          onPointerOverProp?.(e);
          if (!e.defaultPrevented) liftPointerHandlers.onPointerOver(e);
        }}
        onPointerOut={(e) => {
          onPointerOutProp?.(e);
          liftPointerHandlers.onPointerOut(e);
        }}
        {...rest}
      >
        {children}
      </div>
    </AlertStatusContext.Provider>
  );
});

export const Alert = Object.assign(AlertRoot, {
  Indicator: AlertIndicator,
  Message: AlertMessage,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
  Action: AlertAction,
});

export type {
  AlertIndicatorProps,
  AlertContentProps,
  AlertMessageProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertActionProps,
};
