import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from "react";

import { messageBannerGridClass, type MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import { alertRootShellClass } from "@/components/core/utils/sizeLayout";
import { cn } from "@/utils/cn";
import type { ShadowLevel } from "@/tokens/shadows";

import { AlertClassNamesProvider, AlertContext, AlertMotionProvider } from "./alertContext";
import { AlertSimpleContent } from "./alertSimpleContent";
import { resolveAlertMotionDefaults, useAlertAnimations } from "./alertAnimations";
import { useAlertRootState } from "./useAlertRootState";
import type {
  AlertClassNames,
  AlertLiveRole,
  AlertMotion,
  AlertProps,
  AlertSize,
  AlertStatus,
  AlertVariant,
} from "./alertTypes";

export type {
  AlertActionProps,
  AlertContentProps,
  AlertDescriptionProps,
  AlertIndicatorProps,
  AlertMessageProps,
  AlertSimpleContentProps,
  AlertVariant,
  AlertStatus,
  AlertLiveRole,
  AlertClassNames,
  AlertMotion,
  AlertPartMotion,
  AlertSize,
  AlertProps,
  AlertTitleProps,
} from "./alertTypes";

type AlertSurfaceProps = {
  variant: AlertVariant;
  status: AlertStatus;
  hoverLift: boolean;
  shadow: ShadowLevel;
  motion?: AlertMotion;
  classNames?: AlertClassNames;
  className: string;
  sizePresetGridGap: string;
  gridSlots: MessageBannerGridSlots;
  size: AlertSize;
  liveRole: AlertLiveRole;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  isCompound: boolean;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode | null;
  action?: ReactNode;
  onPointerOver?: HTMLAttributes<HTMLDivElement>["onPointerOver"];
  onPointerOut?: HTMLAttributes<HTMLDivElement>["onPointerOut"];
  rest: HTMLAttributes<HTMLDivElement>;
  children?: ReactNode;
};

const AlertSurface = forwardRef<HTMLDivElement, AlertSurfaceProps>(function AlertSurface(
  {
    variant,
    status,
    hoverLift,
    shadow,
    motion,
    classNames,
    className,
    sizePresetGridGap,
    gridSlots,
    size,
    liveRole,
    ariaLabelledBy,
    ariaDescribedBy,
    isCompound,
    title,
    description,
    icon,
    action,
    onPointerOver,
    onPointerOut,
    rest,
    children,
  },
  ref,
) {
  const { setRootRef, surfaceClass, pointerHandlers } = useAlertAnimations({
    variant,
    status,
    hoverLift,
    shadow,
    motion,
    ref,
    onPointerOver,
    onPointerOut,
  });

  return (
    <div
      ref={setRootRef}
      role={liveRole}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={cn(
        messageBannerGridClass(gridSlots, sizePresetGridGap),
        alertRootShellClass(size),
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
  );
});

export const AlertRoot = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant = "default",
    status,
    size = "base",
    role: roleProp,
    title,
    description,
    icon,
    action,
    classNames,
    motion,
    hoverLift = true,
    shadow = "base",
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
    sizePreset,
    liveRole,
    ariaLabelledBy,
    ariaDescribedBy,
    contextValue,
  } = useAlertRootState({
    variant,
    status,
    size,
    role: roleProp,
    title,
    description,
    icon,
    action,
    children,
    ariaLabelledByProp,
    ariaDescribedByProp,
  });

  const motionDefaults = useMemo(
    () => resolveAlertMotionDefaults({ variant: contextValue.variant, hoverLift }),
    [contextValue.variant, hoverLift],
  );

  const motionParams = useMemo(
    () => ({ shadowSize: shadow, variant: contextValue.variant }),
    [contextValue.variant, shadow],
  );

  return (
    <AlertContext.Provider value={contextValue}>
      <AlertClassNamesProvider classNames={classNames}>
        <AlertMotionProvider motion={motion} defaults={motionDefaults} params={motionParams}>
          <AlertSurface
            ref={ref}
            variant={contextValue.variant}
            status={contextValue.status}
            hoverLift={hoverLift}
            shadow={shadow}
            motion={motion}
            classNames={classNames}
            className={className}
            sizePresetGridGap={sizePreset.gridGap}
            gridSlots={gridSlots}
            size={size}
            liveRole={liveRole}
            ariaLabelledBy={ariaLabelledBy}
            ariaDescribedBy={ariaDescribedBy}
            isCompound={isCompound}
            title={title}
            description={description}
            icon={icon}
            action={action}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            rest={rest}
          >
            {children}
          </AlertSurface>
        </AlertMotionProvider>
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
