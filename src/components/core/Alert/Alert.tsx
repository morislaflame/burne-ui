import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  type HTMLAttributes,
} from "react";

import { useInteractiveHoverLiftOnContainer } from "../utils/hoverInteractiveLift";
import {
  ALERT_INLINE_SURFACE_CLASSES,
  ALERT_TONE_ICONS,
  alertToneIconTextClass,
  alertToneShowsDefaultIcon,
  resolveAlertStatus,
  type AlertStatus,
  type AlertVariant,
} from "../utils/alertTone";

export type { AlertStatus, AlertVariant };

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
  const Icon = ALERT_TONE_ICONS[tone];
  const toneClass = alertToneIconTextClass(tone);

  if (children === null) return null;

  const inner =
    children !== undefined
      ? children
      : alertToneShowsDefaultIcon(tone)
        ? <Icon aria-hidden className="size-4" />
        : null;

  if (inner === null) return null;

  return (
    <span
      className={[
        "mt-0.5 shrink-0 [&_svg]:size-4",
        toneClass,
        className,
      ].join(" ")}
      {...rest}
    >
      {inner}
    </span>
  );
}

function AlertContent({ className = "", ...rest }: AlertContentProps) {
  return <div className={["min-w-0 flex-1", className].join(" ")} {...rest} />;
}

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
        "text-sm leading-normal text-b-muted",
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

  useInteractiveHoverLiftOnContainer(rootRef, rootRef, true);

  return (
    <AlertStatusContext.Provider value={tone}>
      <div
        ref={setRootRef}
        role="status"
        className={[
          "flex w-fit max-w-[42rem] items-start gap-3 rounded-xl py-3 px-4",
          ALERT_INLINE_SURFACE_CLASSES[tone],
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
