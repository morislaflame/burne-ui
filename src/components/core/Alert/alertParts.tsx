import { forwardRef, useContext } from "react";

import { Text } from "@/components/core/Text";
import { messageBannerActionCellClass, messageBannerDescriptionCellClass, messageBannerIndicatorCellClass, messageBannerTitleCellClass } from "@/components/core/utils/messageBannerGridLayout";
import { messageBannerSizePreset } from "@/components/core/utils/sizeLayout";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { cn } from "@/utils/cn";

import { AlertContext, useAlertClassNames, useOptionalAlertMotionScope } from "./alertContext";
import { alertDefaultIndicatorIcon, alertShowsDefaultIndicatorIcon } from "./alertAPI";
import { alertIndicatorClass, ALERT_COMPOUND_CONTENTS_CLASS, ALERT_DESCRIPTION_CLASS, alertTitleClass } from "./alertStyles";
import type {
  AlertActionProps,
  AlertContentProps,
  AlertDescriptionProps,
  AlertIndicatorProps,
  AlertMessageProps,
  AlertTitleProps,
} from "./alertTypes";

export const AlertIndicator = forwardRef<HTMLSpanElement, AlertIndicatorProps>(
  function AlertIndicator(
    {
      status: statusProp,
      className = "",
      children,
      motion,
      onPointerOver,
      onPointerOut,
      ...rest
    },
    ref,
  ) {
    const ctx = useContext(AlertContext);
    const slotClassNames = useAlertClassNames();
    const variant = ctx?.variant ?? "default";
    const status = statusProp ?? ctx?.status ?? "default";
    const sizePreset = ctx?.sizePreset ?? messageBannerSizePreset("base");
    const gridSlots = ctx?.gridSlots;
    const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
      scope: useOptionalAlertMotionScope(),
      slot: "indicator",
      motion,
      forwardedRef: ref,
      pointerPhases: true,
      onPointerOver,
      onPointerOut,
    });

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
        ref={setRef}
        className={cn(
          alertIndicatorClass(status, sizePreset.iconSvgClass),
          gridSlots && messageBannerIndicatorCellClass(gridSlots),
          slotClassNames.indicator,
          className,
        )}
        {...rest}
        {...pointerHandlers}
      >
        {inner}
      </span>
    );
  },
);

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

export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(function AlertTitle(
  { className = "", id: idProp, motion, onPointerOver, onPointerOut, ...rest },
  ref,
) {
  const ctx = useContext(AlertContext);
  const slotClassNames = useAlertClassNames();
  const sizePreset = ctx?.sizePreset ?? messageBannerSizePreset("base");
  const status = ctx?.status ?? "default";
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalAlertMotionScope(),
    slot: "title",
    motion,
    forwardedRef: ref,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
  return (
    <Text
      as="div"
      ref={setRef}
      id={idProp ?? ctx?.titleId}
      variant={sizePreset.titleVariant}
      className={cn(
        alertTitleClass(status),
        ctx?.gridSlots && messageBannerTitleCellClass(ctx.gridSlots),
        slotClassNames.title,
        className,
      )}
      {...rest}
      {...pointerHandlers}
    />
  );
});

AlertTitle.displayName = "AlertTitle";

export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(
  function AlertDescription(
    { className = "", id: idProp, motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
    const ctx = useContext(AlertContext);
    const slotClassNames = useAlertClassNames();
    const sizePreset = ctx?.sizePreset ?? messageBannerSizePreset("base");
    const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
      scope: useOptionalAlertMotionScope(),
      slot: "description",
      motion,
      forwardedRef: ref,
      pointerPhases: true,
      onPointerOver,
      onPointerOut,
    });
    return (
      <Text
        as="div"
        ref={setRef}
        id={idProp ?? ctx?.descriptionId}
        variant={sizePreset.descVariant}
        className={cn(
          ALERT_DESCRIPTION_CLASS,
          ctx?.gridSlots && messageBannerDescriptionCellClass(ctx.gridSlots),
          slotClassNames.description,
          className,
        )}
        {...rest}
        {...pointerHandlers}
      />
    );
  },
);

AlertDescription.displayName = "AlertDescription";

export const AlertAction = forwardRef<HTMLDivElement, AlertActionProps>(function AlertAction(
  { className = "", motion, onPointerOver, onPointerOut, ...rest },
  ref,
) {
  const ctx = useContext(AlertContext);
  const slotClassNames = useAlertClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalAlertMotionScope(),
    slot: "action",
    motion,
    forwardedRef: ref,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
  return (
    <div
      ref={setRef}
      className={cn(
        ctx?.gridSlots && messageBannerActionCellClass(ctx.gridSlots),
        slotClassNames.action,
        className,
      )}
      {...rest}
      {...pointerHandlers}
    />
  );
});

AlertAction.displayName = "AlertAction";

export { AlertSimpleContent } from "./alertSimpleContent";
