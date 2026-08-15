import { forwardRef, useMemo } from "react";

import { Tooltip } from "@/components/core/Tooltip";

import "../utils/glossPanel.css";

import { resolveAvatarMotionDefaults } from "./avatarAnimations";
import { AvatarClassNamesProvider, AvatarContext, AvatarMotionProvider } from "./avatarContext";
import {
  AvatarDefaultShell,
  AvatarGlossShell,
  AvatarSimpleContent,
} from "./avatarParts";
import type { AvatarProps } from "./avatarTypes";
import { useAvatarRootState } from "./useAvatarRootState";

export type {
  AvatarClassNames,
  AvatarFallbackProps,
  AvatarGroupProps,
  AvatarImageProps,
  AvatarProps,
  AvatarSize,
  AvatarVariant,
  AvatarMotion,
  AvatarPartMotion,
} from "./avatarTypes";

export const AvatarRoot = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    variant: variantProp,
    size: sizeProp,
    label,
    src,
    alt = "",
    loading,
    nickname,
    tooltipSize = "base",
    tooltipVariant = "default",
    tooltipStatus = "default",
    tooltipSide = "top",
    classNames,
    className = "",
    children,
    role,
    motion,
    "aria-label": ariaLabelProp,
    ...rest
  },
  ref,
) {
  const {
    size,
    ctx,
    isCompound,
    isGloss,
    rootRole,
    ariaLabel,
    tooltip,
  } = useAvatarRootState({
    variant: variantProp,
    size: sizeProp,
    label,
    nickname,
    tooltipSize,
    tooltipVariant,
    tooltipStatus,
    tooltipSide,
    children,
    role,
    "aria-label": ariaLabelProp,
  });

  const avatarContent = isCompound ? (
    children
  ) : (
    <AvatarSimpleContent src={src} alt={alt} loading={loading} />
  );

  const shellProps = {
    size,
    className,
    role: rootRole,
    "aria-label": ariaLabel,
    children: avatarContent,
    ...rest,
  };

  const motionDefaults = useMemo(() => resolveAvatarMotionDefaults(), []);

  const shell = isGloss ? (
    <AvatarGlossShell ref={ref} {...shellProps} />
  ) : (
    <AvatarDefaultShell ref={ref} {...shellProps} />
  );

  const wrapped = tooltip ? (
    <Tooltip size={tooltip.size} variant={tooltip.variant} side={tooltip.side}>
      <Tooltip.Trigger>{shell}</Tooltip.Trigger>
      <Tooltip.Content>{tooltip.content}</Tooltip.Content>
    </Tooltip>
  ) : (
    shell
  );

  return (
    <AvatarMotionProvider motion={motion} defaults={motionDefaults}>
      <AvatarContext.Provider value={ctx}>
        <AvatarClassNamesProvider classNames={classNames}>
          {wrapped}
        </AvatarClassNamesProvider>
      </AvatarContext.Provider>
    </AvatarMotionProvider>
  );
});

AvatarRoot.displayName = "AvatarRoot";
