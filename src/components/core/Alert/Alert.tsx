import { forwardRef } from "react";

import { messageBannerGridClass } from "@/components/core/utils/messageBannerGridLayout";
import { cn } from "@/utils/cn";

import { AlertClassNamesProvider, AlertContext } from "./alertContext";
import { ALERT_ROOT_SHELL_CLASS } from "./alertStyles";
import type { AlertProps } from "./alertTypes";
import { AlertSimpleContent } from "./alertSimpleContent";
import { useAlertAnimations } from "./alertAnimations";
import { useAlertRootState } from "./useAlertRootState";

export type {
  AlertActionProps,
  AlertContentProps,
  AlertDescriptionProps,
  AlertIndicatorProps,
  AlertMessageProps,
  AlertTitleProps,
  AlertSimpleContentProps,
  AlertVariant,
  AlertStatus,
  AlertLiveRole,
  AlertClassNames,
  AlertProps,
} from "./alertTypes";

export const AlertRoot = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant = "default",
    status,
    role: roleProp,
    title,
    description,
    icon,
    action,
    classNames,
    hoverLift = true,
    className = "",
    children,
    onPointerOver,
    onPointerOut,
    "aria-labelledby": ariaLabelledByProp,
    "aria-describedby": ariaDescribedByProp,
    ...rest
  },
  ref,
) {
  const {
    isCompound,
    gridSlots,
    liveRole,
    ariaLabelledBy,
    ariaDescribedBy,
    contextValue,
  } = useAlertRootState({
    variant,
    status,
    role: roleProp,
    title,
    description,
    icon,
    action,
    children,
    ariaLabelledByProp,
    ariaDescribedByProp,
  });

  const { setRootRef, surfaceClass, pointerHandlers } = useAlertAnimations({
    variant: contextValue.variant,
    status: contextValue.status,
    hoverLift,
    ref,
    onPointerOver,
    onPointerOut,
  });

  return (
    <AlertContext.Provider value={contextValue}>
      <AlertClassNamesProvider classNames={classNames}>
        <div
          ref={setRootRef}
          role={liveRole}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          className={cn(
            messageBannerGridClass(gridSlots),
            ALERT_ROOT_SHELL_CLASS,
            surfaceClass,
            classNames?.root,
            className,
          )}
          {...pointerHandlers}
          {...rest}
        >
          {isCompound ? (
            children
          ) : (
            <AlertSimpleContent
              gridSlots={gridSlots}
              title={title}
              description={description}
              icon={icon}
              action={action}
            >
              {children}
            </AlertSimpleContent>
          )}
        </div>
      </AlertClassNamesProvider>
    </AlertContext.Provider>
  );
});

AlertRoot.displayName = "AlertRoot";

export {
  AlertAction,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertMessage,
  AlertTitle,
} from "./alertParts";
