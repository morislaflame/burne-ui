import { useCallback, useMemo, useState } from "react";

import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";

import {
  avatarHasLabel,
  resolveAvatarNickname,
  resolveAvatarSize,
  resolveAvatarVariant,
} from "./avatarAPI";
import { avatarRootAriaLabel, avatarRootRole } from "./avatarA11y";
import type { ImageStatus, UseAvatarRootStateProps } from "./avatarTypes";

export function useAvatarRootState({
  variant: variantProp,
  size: sizeProp,
  label,
  nickname,
  tooltipSize = "base",
  tooltipVariant = "default",
  tooltipSide = "top",
  children,
  role,
}: UseAvatarRootStateProps) {
  const variant = resolveAvatarVariant(variantProp);
  const size = resolveAvatarSize(sizeProp);
  const [imageStatus, setImageStatus] = useState<ImageStatus>("idle");

  const onImageLoad = useCallback(() => {
    setImageStatus("loaded");
  }, []);

  const onImageError = useCallback(() => {
    setImageStatus("error");
  }, []);

  const ctx = useMemo(
    () => ({
      size,
      label,
      imageStatus,
      onImageLoad,
      onImageError,
    }),
    [size, label, imageStatus, onImageLoad, onImageError],
  );

  const isCompound = hasCompoundChildren(children);
  const hasLabel = avatarHasLabel(label);
  const nick = resolveAvatarNickname(nickname);
  const isGloss = variant === "gloss";
  const rootRole = avatarRootRole(role);
  const ariaLabel = avatarRootAriaLabel(label);

  const tooltip = nick
    ? { size: tooltipSize, variant: tooltipVariant, side: tooltipSide, content: nick }
    : null;

  return {
    variant,
    size,
    ctx,
    isCompound,
    hasLabel,
    isGloss,
    rootRole,
    ariaLabel,
    tooltip,
  };
}
