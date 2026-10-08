import { forwardRef, useMemo } from "react";

import { Tooltip } from "@/components/core/Tooltip";


import { useSkinRegistryRevision } from "@/skins/skinContext";

import { resolveAvatarMotionDefaults } from "./avatarAnimations";
import { AvatarClassNamesProvider, AvatarContext, AvatarMotionProvider } from "./avatarContext";
import {
  AvatarDefaultShell,
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
    motionController,
    motionState,
    motionPayload,
    playInitialState,
    "aria-label": ariaLabelProp,
    ...rest
  },
  ref,
) {
  const {
    size,
    variant,
    ctx,
    isCompound,
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
    variant,
    className,
    role: rootRole,
    "aria-label": ariaLabel,
    children: avatarContent,
    ...rest,
  };

  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(() => {
    void skinRevision;
    return resolveAvatarMotionDefaults(variant);
  }, [skinRevision, variant]);

  const shell = <AvatarDefaultShell ref={ref} {...shellProps} />;

  const wrapped = tooltip ? (
    <Tooltip size={tooltip.size} variant={tooltip.variant} side={tooltip.side}>
      <Tooltip.Trigger>{shell}</Tooltip.Trigger>
      <Tooltip.Content>{tooltip.content}</Tooltip.Content>
    </Tooltip>
  ) : (
    shell
  );

  return (
    <AvatarMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
      <AvatarContext.Provider value={ctx}>
        <AvatarClassNamesProvider classNames={classNames}>
          {wrapped}
        </AvatarClassNamesProvider>
      </AvatarContext.Provider>
    </AvatarMotionProvider>
  );
});

AvatarRoot.displayName = "AvatarRoot";
