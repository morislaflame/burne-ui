import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import type { IconType } from "react-icons";
import { IoHelpCircleOutline } from "react-icons/io5";

import { Text } from "@/components/core/Text";
import {
  useInteractiveHoverLiftContainerHandlers,
  SHADOW_SM,
  SHADOW_MD,
  initElementShadow,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  SEMANTIC_STATUS_ICON_TEXT_CLASS,
  SEMANTIC_STATUS_ICONS,
  type SemanticStatus,
} from "@/components/core/utils/semanticStatusIcons";
import { cn } from "@/utils/cn";

import { AlertContext } from "./alertContext";
import {
  alertHasDescription,
  alertHasTitle,
  hasAlertCompoundChildren,
  resolveAlertAriaDescribedBy,
  resolveAlertAriaLabelledBy,
  resolveAlertLiveRole,
  resolveAlertStatus,
  type AlertLiveRole,
  type AlertStatus,
} from "./alertUtils";

function alertShowsDefaultIndicatorIcon(tone: AlertStatus): boolean {
  return tone !== "default" && tone !== "secondary";
}

/**
 * Компактный Alert: фон по семантике типа (тинты surface).
 * default — плотный surface; outline — `surface-outline`; secondary — `surface-secondary`.
 */
const ALERT_INLINE_SURFACE_CLASSES: Record<AlertStatus, string> = {
  default: "border border-base bg-surface text-foreground",
  outline: "surface-outline text-foreground",
  secondary: "surface-secondary text-foreground",
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
  if (tone === "default" || tone === "secondary") return null;
  if (tone === "outline") return IoHelpCircleOutline;
  return SEMANTIC_STATUS_ICONS[tone as SemanticStatus];
}

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "role"> & {
  status?: AlertStatus;
  /** Live region: `alert` (срочно) или `status` (информативно). По умолчанию — из `status`. */
  role?: AlertLiveRole;
  /** Simple API: заголовок. В compound игнорируется. */
  title?: ReactNode;
  /** Simple API: описание. В compound — `<Alert.Description>`. */
  description?: ReactNode;
  /**
   * Simple API: иконка в `Indicator`.
   * Не задано — дефолт по `status`; `null` — без иконки.
   */
  icon?: ReactNode | null;
  /** Simple API: слот действия справа. В compound — `<Alert.Action>`. */
  action?: ReactNode;
};

type AlertIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  status?: AlertStatus;
};
type AlertContentProps = HTMLAttributes<HTMLDivElement>;
type AlertMessageProps = HTMLAttributes<HTMLDivElement>;
type AlertTitleProps = HTMLAttributes<HTMLDivElement>;
type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>;
type AlertActionProps = HTMLAttributes<HTMLDivElement>;

export function AlertIndicator({
  status,
  className = "",
  children,
  ...rest
}: AlertIndicatorProps) {
  const ctx = useContext(AlertContext);
  const tone = status ?? ctx?.status ?? "default";

  if (children === null) return null;

  const DefaultIcon = alertDefaultIndicatorIcon(tone);
  const inner =
    children !== undefined
      ? children
      : alertShowsDefaultIndicatorIcon(tone) && DefaultIcon !== null
        ? <DefaultIcon aria-hidden />
        : null;

  if (inner === null) return null;

  return (
    <span
      className={cn(
        "shrink-0 [&_svg]:icon-mid",
        alertIndicatorWrapperTextClass(tone),
        className,
      )}
      {...rest}
    >
      {inner}
    </span>
  );
}

AlertIndicator.displayName = "AlertIndicator";

export function AlertContent({ className = "", ...rest }: AlertContentProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-xsmall text-left",
        className,
      )}
      {...rest}
    />
  );
}

AlertContent.displayName = "AlertContent";

export const AlertMessage = forwardRef<HTMLDivElement, AlertMessageProps>(function AlertMessage(
  { className = "", ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("flex min-w-0 flex-1 items-start gap-base", className)}
      {...rest}
    />
  );
});

AlertMessage.displayName = "AlertMessage";

export function AlertTitle({ className = "", id: idProp, ...rest }: AlertTitleProps) {
  const ctx = useContext(AlertContext);
  return (
    <Text
      as="div"
      id={idProp ?? ctx?.titleId}
      variant="base"
      className={cn("font-medium", className)}
      {...rest}
    />
  );
}

AlertTitle.displayName = "AlertTitle";

export function AlertDescription({
  className = "",
  id: idProp,
  ...rest
}: AlertDescriptionProps) {
  const ctx = useContext(AlertContext);
  return (
    <Text
      as="div"
      id={idProp ?? ctx?.descriptionId}
      variant="small"
      className={cn("text-muted", className)}
      {...rest}
    />
  );
}

AlertDescription.displayName = "AlertDescription";

export function AlertAction({ className = "", ...rest }: AlertActionProps) {
  return <div className={cn("shrink-0 self-start", className)} {...rest} />;
}

AlertAction.displayName = "AlertAction";

export const AlertRoot = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    status,
    role: roleProp,
    title,
    description,
    icon,
    action,
    className = "",
    children,
    onPointerOver: onPointerOverProp,
    onPointerOut: onPointerOutProp,
    "aria-labelledby": ariaLabelledByProp,
    "aria-describedby": ariaDescribedByProp,
    ...rest
  },
  ref,
) {
  const tone = resolveAlertStatus(status);
  const autoId = useId();
  const titleId = `${autoId}-title`;
  const descriptionId = `${autoId}-description`;
  const rootRef = useRef<HTMLDivElement | null>(null);

  const isCompound = hasAlertCompoundChildren(children);
  const hasTitle = useMemo(
    () => title != null || alertHasTitle(children),
    [children, title],
  );
  const hasDescription = useMemo(
    () => description != null || alertHasDescription(children),
    [children, description],
  );

  const liveRole = resolveAlertLiveRole(tone, roleProp);
  const ariaLabelledBy =
    ariaLabelledByProp ??
    resolveAlertAriaLabelledBy(titleId, descriptionId, hasTitle, hasDescription);
  const ariaDescribedBy =
    ariaDescribedByProp ??
    resolveAlertAriaDescribedBy(descriptionId, hasTitle, hasDescription);

  const contextValue = useMemo(
    () => ({ status: tone, titleId, descriptionId }),
    [descriptionId, titleId, tone],
  );

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  useEffect(() => {
    initElementShadow(rootRef.current, SHADOW_SM());
  }, []);

  const liftPointerHandlers = useInteractiveHoverLiftContainerHandlers(
    rootRef,
    true,
    undefined,
    undefined,
    { idle: SHADOW_SM(), hover: SHADOW_MD() },
  );

  return (
    <AlertContext.Provider value={contextValue}>
      <div
        ref={setRootRef}
        role={liveRole}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "flex w-fit max-w-component-base items-start gap-base rounded-mid py-plus px-mid text-left animate-shadow",
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
        {isCompound ? (
          children
        ) : (
          <>
            <AlertMessage>
              {icon !== null ? <AlertIndicator>{icon}</AlertIndicator> : null}
              <AlertContent>
                {title != null ? <AlertTitle>{title}</AlertTitle> : null}
                {description != null ? (
                  <AlertDescription>{description}</AlertDescription>
                ) : null}
                {children}
              </AlertContent>
            </AlertMessage>
            {action != null ? <AlertAction>{action}</AlertAction> : null}
          </>
        )}
      </div>
    </AlertContext.Provider>
  );
});

AlertRoot.displayName = "AlertRoot";

export type {
  AlertIndicatorProps,
  AlertContentProps,
  AlertMessageProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertActionProps,
};

export type { AlertStatus, AlertLiveRole } from "./alertUtils";
