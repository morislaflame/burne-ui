import { forwardRef, useContext } from "react";

import { Text } from "@/components/core/Text";
import {
  messageBannerActionCellClass,
  messageBannerDescriptionCellClass,
  messageBannerIndicatorCellClass,
  messageBannerTitleCellClass,
} from "@/components/core/utils/messageBannerGridLayout";
import { cn } from "@/utils/cn";

import { AlertContext, useAlertClassNames } from "./alertContext";
import {
  alertDefaultIndicatorIcon,
  alertShowsDefaultIndicatorIcon,
} from "./alertAPI";
import {
  alertIndicatorClass,
  ALERT_COMPOUND_CONTENTS_CLASS,
  ALERT_DESCRIPTION_CLASS,
  ALERT_TITLE_CLASS,
} from "./alertStyles";
import type {
  AlertActionProps,
  AlertContentProps,
  AlertDescriptionProps,
  AlertIndicatorProps,
  AlertMessageProps,
  AlertTitleProps,
} from "./alertTypes";

export function AlertIndicator({
  status: statusProp,
  className = "",
  children,
  ...rest
}: AlertIndicatorProps) {
  const ctx = useContext(AlertContext);
  const slotClassNames = useAlertClassNames();
  const variant = ctx?.variant ?? "default";
  const status = statusProp ?? ctx?.status ?? "default";
  const gridSlots = ctx?.gridSlots;

  if (children === null) return null;

  const DefaultIcon = alertDefaultIndicatorIcon(variant, status);
  const inner =
    children !== undefined
      ? children
      : alertShowsDefaultIndicatorIcon(variant, status) && DefaultIcon !== null
        ? <DefaultIcon aria-hidden />
        : null;

  if (inner === null) return null;

  return (
    <span
      className={cn(
        alertIndicatorClass(status),
        gridSlots && messageBannerIndicatorCellClass(gridSlots),
        slotClassNames.indicator,
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
  const slotClassNames = useAlertClassNames();
  return <div className={cn(ALERT_COMPOUND_CONTENTS_CLASS, slotClassNames.content, className)} {...rest} />;
}

AlertContent.displayName = "AlertContent";

export const AlertMessage = forwardRef<HTMLDivElement, AlertMessageProps>(function AlertMessage(
  { className = "", ...rest },
  ref,
) {
  const slotClassNames = useAlertClassNames();
  return (
    <div
      ref={ref}
      className={cn(ALERT_COMPOUND_CONTENTS_CLASS, slotClassNames.message, className)}
      {...rest}
    />
  );
});

AlertMessage.displayName = "AlertMessage";

export function AlertTitle({ className = "", id: idProp, ...rest }: AlertTitleProps) {
  const ctx = useContext(AlertContext);
  const slotClassNames = useAlertClassNames();
  return (
    <Text
      as="div"
      id={idProp ?? ctx?.titleId}
      variant="base"
      className={cn(
        ALERT_TITLE_CLASS,
        ctx?.gridSlots && messageBannerTitleCellClass(ctx.gridSlots),
        slotClassNames.title,
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
  const slotClassNames = useAlertClassNames();
  return (
    <Text
      as="div"
      id={idProp ?? ctx?.descriptionId}
      variant="small"
      className={cn(
        ALERT_DESCRIPTION_CLASS,
        ctx?.gridSlots && messageBannerDescriptionCellClass(ctx.gridSlots),
        slotClassNames.description,
        className,
      )}
      {...rest}
    />
  );
}

AlertDescription.displayName = "AlertDescription";

export function AlertAction({ className = "", ...rest }: AlertActionProps) {
  const ctx = useContext(AlertContext);
  const slotClassNames = useAlertClassNames();
  return (
    <div
      className={cn(
        ctx?.gridSlots && messageBannerActionCellClass(ctx.gridSlots),
        slotClassNames.action,
        className,
      )}
      {...rest}
    />
  );
}

AlertAction.displayName = "AlertAction";

export { AlertSimpleContent } from "./alertSimpleContent";
