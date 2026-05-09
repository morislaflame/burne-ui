import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  type HTMLAttributes,
} from "react";

import { useInteractiveHoverLiftOnContainer } from "../utils/hoverInteractiveLift";

export type AlertVariant =
  | "default"
  | "outline"
  | "destructive"
  | "success"
  | "info";

export type AlertStatus =
  | AlertVariant
  | "accent"
  | "danger"
  | "warning";

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  /** Визуальный вариант алерта. */
  variant?: AlertVariant;
  /** Алиас для variant: accent/danger/warning + базовые варианты. */
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

function resolveStatus(status?: AlertStatus, variant?: AlertVariant): AlertStatus {
  return status ?? variant ?? "default";
}

const ALERT_VARIANT: Record<AlertStatus, string> = {
  default: "border-b-border bg-b-surface text-b-text shadow-sm",
  outline: "border-b-border bg-transparent text-b-text",
  destructive:
    "border-transparent bg-[color-mix(in_oklab,var(--b-color-destructive)_16%,var(--b-color-surface))] text-b-text",
  danger:
    "border-transparent bg-[color-mix(in_oklab,var(--b-color-destructive)_16%,var(--b-color-surface))] text-b-text",
  success:
    "border-transparent bg-[color-mix(in_oklab,#22c55e_16%,var(--b-color-surface))] text-b-text",
  info:
    "border-transparent bg-[color-mix(in_oklab,#0ea5e9_16%,var(--b-color-surface))] text-b-text",
  accent:
    "border-transparent bg-[color-mix(in_oklab,var(--b-color-accent)_18%,var(--b-color-surface))] text-b-text",
  warning:
    "border-transparent bg-[color-mix(in_oklab,#f59e0b_16%,var(--b-color-surface))] text-b-text",
};

function AlertIndicator({
  status,
  className = "",
  children,
  ...rest
}: AlertIndicatorProps) {
  const statusFromContext = useContext(AlertStatusContext);
  const tone = status ?? statusFromContext;
  const toneClass =
    tone === "danger" || tone === "destructive"
      ? "text-b-destructive"
      : tone === "success"
        ? "text-[#22c55e]"
        : tone === "warning"
          ? "text-[#f59e0b]"
          : "text-b-accent";

  return (
    <span
      className={[
        "mt-0.5 shrink-0 [&_svg]:size-4",
        toneClass,
        className,
      ].join(" ")}
      {...rest}
    >
      {children ?? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      )}
    </span>
  );
}

function AlertContent({ className = "", ...rest }: AlertContentProps) {
  return <div className={["min-w-0 flex-1", className].join(" ")} {...rest} />;
}

/** Оборачивает `Indicator` + `Content` — разметочный блок (hover scale на всём корне алерта). */
const AlertMessage = forwardRef<HTMLDivElement, AlertMessageProps>(
  function AlertMessage({ className = "", ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={["flex min-w-0 flex-1 items-start gap-3", className].join(" ")}
        {...rest}
      />
    );
  },
);

function AlertTitle({ className = "", ...rest }: AlertTitleProps) {
  return (
    <div
      className={[
        "font-medium text-sm leading-snug",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

function AlertDescription({ className = "", ...rest }: AlertDescriptionProps) {
  return (
    <div
      className={[
        "mt-1 text-sm leading-normal text-b-muted",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

function AlertAction({ className = "", ...rest }: AlertActionProps) {
  return <div className={["shrink-0 self-start", className].join(" ")} {...rest} />;
}

const AlertRoot = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant,
    status,
    className = "",
    children,
    ...rest
  },
  ref,
) {
  const tone = resolveStatus(status, variant);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  useInteractiveHoverLiftOnContainer(rootRef, rootRef, true);

  return (
    <AlertStatusContext.Provider value={tone}>
      <div
        ref={setRootRef}
        role="status"
        className={[
          "flex w-fit max-w-[42rem] items-start gap-3 rounded-xl border py-3 px-4",
          ALERT_VARIANT[tone],
          className,
        ].join(" ")}
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
