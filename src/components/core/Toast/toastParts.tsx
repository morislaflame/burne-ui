import { forwardRef, type Ref } from "react";

import { CloseButton } from "@/components/core/CloseButton";
import { Loading } from "@/components/core/Loading";
import { Text } from "@/components/core/Text";
import { messageBannerActionCellClass, messageBannerCloseCellClass, messageBannerDescriptionCellClass, messageBannerIndicatorCellClass, messageBannerTitleCellClass } from "@/components/core/utils/messageBannerGridLayout";
import { SEMANTIC_STATUS_ICONS } from "@/components/core/utils/semanticStatusIcons";

import { TOAST_CLOSE_ARIA_LABEL } from "./toastA11y";

import { useToastClassNames, useToastItem } from "./toastContext";
import { TOAST_CLOSE_BUTTON_OFFSET_CLASS, TOAST_COMPOUND_CONTENTS_CLASS, TOAST_DESCRIPTION_CLASS, TOAST_TITLE_CLASS, toastIndicatorClass, toastLoadingColor } from "./toastStyles";
import type {
  ToastActionProps,
  ToastCloseProps,
  ToastContentProps,
  ToastDescriptionProps,
  ToastIndicatorProps,
  ToastMessageProps,
  ToastSimpleBodyProps,
  ToastTitleProps,
} from "./toastTypes";

import { cn } from "@/utils/cn";

export const ToastIndicator = forwardRef<HTMLSpanElement, ToastIndicatorProps>(
  function ToastIndicator({ className, children, ...rest }, ref) {
    const { status, loading, gridSlots, sizePreset } = useToastItem();
    const slotClassNames = useToastClassNames();
    const indicatorClass = toastIndicatorClass(status, sizePreset.iconSvgClass);

    if (children !== undefined) {
      return (
        <span
          ref={ref}
          className={cn(
            indicatorClass,
            messageBannerIndicatorCellClass(gridSlots),
            slotClassNames.indicator,
            className,
          )}
          {...rest}
        >
          {children}
        </span>
      );
    }

    if (loading) {
      return (
        <span
          ref={ref}
          className={cn(
            indicatorClass,
            messageBannerIndicatorCellClass(gridSlots),
            slotClassNames.indicator,
            className,
          )}
          {...rest}
        >
          <Loading size={sizePreset.loadingSize} color={toastLoadingColor(status)} />
        </span>
      );
    }

    if (status === "default") return null;

    const Icon = SEMANTIC_STATUS_ICONS[status as keyof typeof SEMANTIC_STATUS_ICONS];
    if (!Icon) return null;

    return (
      <span
        ref={ref}
        className={cn(
          indicatorClass,
          messageBannerIndicatorCellClass(gridSlots),
          slotClassNames.indicator,
          className,
        )}
        {...rest}
      >
        <Icon aria-hidden />
      </span>
    );
  },
);

ToastIndicator.displayName = "ToastIndicator";

export const ToastMessage = forwardRef<HTMLDivElement, ToastMessageProps>(
  function ToastMessage({ className, ...rest }, ref) {
    const slotClassNames = useToastClassNames();
    return (
      <div
        ref={ref}
        className={cn(TOAST_COMPOUND_CONTENTS_CLASS, slotClassNames.message, className)}
        {...rest}
      />
    );
  },
);

ToastMessage.displayName = "ToastMessage";

export const ToastContent = forwardRef<HTMLDivElement, ToastContentProps>(
  function ToastContent({ className, ...rest }, ref) {
    const slotClassNames = useToastClassNames();
    return (
      <div
        ref={ref}
        className={cn(TOAST_COMPOUND_CONTENTS_CLASS, slotClassNames.content, className)}
        {...rest}
      />
    );
  },
);

ToastContent.displayName = "ToastContent";

export const ToastTitle = forwardRef<HTMLDivElement, ToastTitleProps>(
  function ToastTitle({ className, id: idProp, ...rest }, ref) {
    const { titleId, gridSlots, sizePreset } = useToastItem();
    const slotClassNames = useToastClassNames();

    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="div"
        variant={sizePreset.titleVariant}
        id={idProp ?? titleId}
        className={cn(
          TOAST_TITLE_CLASS,
          messageBannerTitleCellClass(gridSlots),
          slotClassNames.title,
          className,
        )}
        {...rest}
      />
    );
  },
);

ToastTitle.displayName = "ToastTitle";

export const ToastDescription = forwardRef<HTMLDivElement, ToastDescriptionProps>(
  function ToastDescription({ className, id: idProp, ...rest }, ref) {
    const { descriptionId, gridSlots, sizePreset } = useToastItem();
    const slotClassNames = useToastClassNames();

    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="div"
        variant={sizePreset.descVariant}
        id={idProp ?? descriptionId}
        className={cn(
          TOAST_DESCRIPTION_CLASS,
          messageBannerDescriptionCellClass(gridSlots),
          slotClassNames.description,
          className,
        )}
        {...rest}
      />
    );
  },
);

ToastDescription.displayName = "ToastDescription";

export const ToastAction = forwardRef<HTMLDivElement, ToastActionProps>(
  function ToastAction({ className, ...rest }, ref) {
    const { gridSlots } = useToastItem();
    const slotClassNames = useToastClassNames();

    return (
      <div
        ref={ref}
        className={cn(
          messageBannerActionCellClass(gridSlots),
          slotClassNames.action,
          className,
        )}
        {...rest}
      />
    );
  },
);

ToastAction.displayName = "ToastAction";

export const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(
  function ToastClose(
    { className, onClick, "aria-label": ariaLabel = TOAST_CLOSE_ARIA_LABEL, ...rest },
    ref,
  ) {
    const { dismiss, gridSlots } = useToastItem();
    const slotClassNames = useToastClassNames();

    return (
      <CloseButton
        ref={ref}
        size="small"
        variant="ghost"
        aria-label={ariaLabel}
        className={cn(
          TOAST_CLOSE_BUTTON_OFFSET_CLASS,
          messageBannerCloseCellClass(gridSlots),
          slotClassNames.close,
          className,
        )}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) dismiss();
        }}
        {...rest}
      />
    );
  },
);

ToastClose.displayName = "ToastClose";

export function ToastSimpleBody({
  gridSlots,
  title,
  description,
  action,
  onClose,
}: ToastSimpleBodyProps) {
  return (
    <>
      {gridSlots.hasIndicator ? <ToastIndicator /> : null}
      {title != null ? <ToastTitle>{title}</ToastTitle> : null}
      {description != null ? <ToastDescription>{description}</ToastDescription> : null}
      {action != null ? <ToastAction>{action}</ToastAction> : null}
      {onClose != null ? <ToastClose /> : null}
    </>
  );
}
