import { forwardRef } from "react";

import { CloseButton } from "@/components/core/CloseButton";
import { Loading } from "@/components/core/Loading";
import { Text } from "@/components/core/Text";
import {
  messageBannerActionCellClass,
  messageBannerCloseCellClass,
  messageBannerDescriptionCellClass,
  messageBannerIndicatorCellClass,
  messageBannerTitleCellClass,
} from "@/components/core/utils/messageBannerGridLayout";
import {
  SEMANTIC_STATUS_ICONS,
} from "@/components/core/utils/semanticStatusIcons";

import { TOAST_CLOSE_ARIA_LABEL } from "./toastA11y";
import { mergeToastSlotClass } from "./toastAPI";
import {
  useToastClassNames,
  useToastItem,
} from "./toastContext";
import {
  TOAST_CLOSE_BUTTON_OFFSET_CLASS,
  TOAST_COMPOUND_CONTENTS_CLASS,
  TOAST_DESCRIPTION_CLASS,
  TOAST_TITLE_CLASS,
  toastIndicatorClass,
  toastLoadingColor,
} from "./toastStyles";
import type {
  ToastActionButtonProps,
  ToastCloseButtonProps,
  ToastContentProps,
  ToastDescriptionProps,
  ToastIndicatorProps,
  ToastMessageProps,
  ToastSimpleBodyProps,
  ToastTitleProps,
} from "./toastTypes";

export function ToastIndicator({ className, children, ...rest }: ToastIndicatorProps) {
  const { status, isLoading, gridSlots, sizePreset } = useToastItem();
  const slotClassNames = useToastClassNames();
  const indicatorClass = toastIndicatorClass(status, sizePreset.iconSvgClass);

  if (children !== undefined) {
    return (
      <span
        className={mergeToastSlotClass(
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

  if (isLoading) {
    return (
      <span
        className={mergeToastSlotClass(
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
      className={mergeToastSlotClass(
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
}

ToastIndicator.displayName = "ToastIndicator";

export function ToastMessage({ className, ...rest }: ToastMessageProps) {
  const slotClassNames = useToastClassNames();
  return (
    <div
      className={mergeToastSlotClass(TOAST_COMPOUND_CONTENTS_CLASS, slotClassNames.message, className)}
      {...rest}
    />
  );
}

ToastMessage.displayName = "ToastMessage";

export function ToastContent({ className, ...rest }: ToastContentProps) {
  const slotClassNames = useToastClassNames();
  return (
    <div
      className={mergeToastSlotClass(TOAST_COMPOUND_CONTENTS_CLASS, slotClassNames.content, className)}
      {...rest}
    />
  );
}

ToastContent.displayName = "ToastContent";

export function ToastTitle({ className, id: idProp, ...rest }: ToastTitleProps) {
  const { titleId, gridSlots, sizePreset } = useToastItem();
  const slotClassNames = useToastClassNames();

  return (
    <Text
      as="div"
      variant={sizePreset.titleVariant}
      id={idProp ?? titleId}
      className={mergeToastSlotClass(
        TOAST_TITLE_CLASS,
        messageBannerTitleCellClass(gridSlots),
        slotClassNames.title,
        className,
      )}
      {...rest}
    />
  );
}

ToastTitle.displayName = "ToastTitle";

export function ToastDescription({ className, id: idProp, ...rest }: ToastDescriptionProps) {
  const { descriptionId, gridSlots, sizePreset } = useToastItem();
  const slotClassNames = useToastClassNames();

  return (
    <Text
      as="div"
      variant={sizePreset.descVariant}
      id={idProp ?? descriptionId}
      className={mergeToastSlotClass(
        TOAST_DESCRIPTION_CLASS,
        messageBannerDescriptionCellClass(gridSlots),
        slotClassNames.description,
        className,
      )}
      {...rest}
    />
  );
}

ToastDescription.displayName = "ToastDescription";

export function ToastActionButton({ className, ...rest }: ToastActionButtonProps) {
  const { gridSlots } = useToastItem();
  const slotClassNames = useToastClassNames();

  return (
    <div
      className={mergeToastSlotClass(
        messageBannerActionCellClass(gridSlots),
        slotClassNames.action,
        className,
      )}
      {...rest}
    />
  );
}

ToastActionButton.displayName = "ToastActionButton";

export const ToastCloseButton = forwardRef<HTMLButtonElement, ToastCloseButtonProps>(
  function ToastCloseButton(
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
        className={mergeToastSlotClass(
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

ToastCloseButton.displayName = "ToastCloseButton";

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
      {action != null ? <ToastActionButton>{action}</ToastActionButton> : null}
      {onClose != null ? <ToastCloseButton /> : null}
    </>
  );
}
