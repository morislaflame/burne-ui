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
  shadowSm,
  shadowMd,
  initElementShadow,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  SEMANTIC_STATUS_ICONS,
  type SemanticStatus,
} from "@/components/core/utils/semanticStatusIcons";
import {
  messageBannerActionCellClass,
  messageBannerDescriptionCellClass,
  messageBannerGridClass,
  messageBannerIndicatorCellClass,
  messageBannerTitleCellClass,
  type MessageBannerGridSlots,
} from "@/components/core/utils/messageBannerGridLayout";
import { cn } from "@/utils/cn";

import { AlertContext } from "./alertContext";
import {
  alertHasAction,
  alertHasDescription,
  alertHasIndicator,
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
 * Компактный Alert.
 */
const ALERT_INLINE_SURFACE_CLASSES: Record<AlertStatus, string> = {
  default: "bg-surface border-token text-foreground",
  outline: "bg-transparent border-token text-foreground",
  secondary: "bg-secondary border-token text-secondary-foreground",
  danger: "bg-surface-tint-danger border-token text-foreground ",
  success: "bg-surface-tint-success border-token text-foreground",
  info: "bg-surface-tint-info border-token text-foreground",
  warning: "bg-surface-tint-warning border-token text-foreground",
};

function alertIndicatorWrapperTextClass(tone: AlertStatus): string {
  switch (tone) {
    case "danger":
      return "text-danger";
    case "success":
      return "text-success";
    case "info":
      return "text-info";
    case "warning":
      return "text-warning";
    default:
      return "text-primary";
  }
}

function alertDefaultIndicatorIcon(tone: AlertStatus): IconType | null {
  if (tone === "default" || tone === "secondary") return null;
  if (tone === "outline") return IoHelpCircleOutline;
  return SEMANTIC_STATUS_ICONS[tone as SemanticStatus];
}

function alertShowsIndicator(
  tone: AlertStatus,
  icon: ReactNode | null | undefined,
  isCompound: boolean,
  compoundHasIndicator: boolean,
): boolean {
  if (isCompound) return compoundHasIndicator;
  if (icon === null) return false;
  if (icon !== undefined) return true;
  return alertShowsDefaultIndicatorIcon(tone) && alertDefaultIndicatorIcon(tone) !== null;
}

function resolveAlertGridSlots(
  tone: AlertStatus,
  icon: ReactNode | null | undefined,
  action: ReactNode | undefined,
  isCompound: boolean,
  children: ReactNode,
  hasTitle: boolean,
  hasDescription: boolean,
): MessageBannerGridSlots {
  return {
    hasIndicator: alertShowsIndicator(
      tone,
      icon,
      isCompound,
      alertHasIndicator(children),
    ),
    hasTitle,
    hasDescription,
    hasAction: isCompound ? alertHasAction(children) : action != null,
    hasClose: false,
  };
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
  const gridSlots = ctx?.gridSlots;

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
        "[&_svg]:icon-large",
        alertIndicatorWrapperTextClass(tone),
        gridSlots && messageBannerIndicatorCellClass(gridSlots),
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
  return <div className={cn("contents", className)} {...rest} />;
}

AlertContent.displayName = "AlertContent";

export const AlertMessage = forwardRef<HTMLDivElement, AlertMessageProps>(function AlertMessage(
  { className = "", ...rest },
  ref,
) {
  return <div ref={ref} className={cn("contents", className)} {...rest} />;
});

AlertMessage.displayName = "AlertMessage";

export function AlertTitle({ className = "", id: idProp, ...rest }: AlertTitleProps) {
  const ctx = useContext(AlertContext);
  return (
    <Text
      as="div"
      id={idProp ?? ctx?.titleId}
      variant="base"
      className={cn(
        "font-medium",
        ctx?.gridSlots && messageBannerTitleCellClass(ctx.gridSlots),
        className,
      )}
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
      className={cn(
        "text-muted",
        ctx?.gridSlots && messageBannerDescriptionCellClass(ctx.gridSlots),
        className,
      )}
      {...rest}
    />
  );
}

AlertDescription.displayName = "AlertDescription";

export function AlertAction({ className = "", ...rest }: AlertActionProps) {
  const ctx = useContext(AlertContext);
  return (
    <div
      className={cn(
        ctx?.gridSlots && messageBannerActionCellClass(ctx.gridSlots),
        className,
      )}
      {...rest}
    />
  );
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

  const gridSlots = useMemo(
    () =>
      resolveAlertGridSlots(
        tone,
        icon,
        action,
        isCompound,
        children,
        hasTitle,
        hasDescription,
      ),
    [
      action,
      children,
      hasDescription,
      hasTitle,
      icon,
      isCompound,
      tone,
    ],
  );

  const liveRole = resolveAlertLiveRole(tone, roleProp);
  const ariaLabelledBy =
    ariaLabelledByProp ??
    resolveAlertAriaLabelledBy(titleId, descriptionId, hasTitle, hasDescription);
  const ariaDescribedBy =
    ariaDescribedByProp ??
    resolveAlertAriaDescribedBy(descriptionId, hasTitle, hasDescription);

  const contextValue = useMemo(
    () => ({ status: tone, titleId, descriptionId, gridSlots }),
    [descriptionId, gridSlots, titleId, tone],
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
    initElementShadow(rootRef.current, shadowSm());
  }, []);

  const liftPointerHandlers = useInteractiveHoverLiftContainerHandlers(
    rootRef,
    true,
    undefined,
    undefined,
    { idle: shadowSm(), hover: shadowMd() },
  );

  return (
    <AlertContext.Provider value={contextValue}>
      <div
        ref={setRootRef}
        role={liveRole}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={cn(
          messageBannerGridClass(gridSlots),
          "w-fit max-w-component-base rounded-mid py-plus px-large animate-shadow",
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
            {gridSlots.hasIndicator ? (
              <AlertIndicator>{icon}</AlertIndicator>
            ) : null}
            {title != null ? <AlertTitle>{title}</AlertTitle> : null}
            {description != null ? (
              <AlertDescription>{description}</AlertDescription>
            ) : null}
            {children}
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
