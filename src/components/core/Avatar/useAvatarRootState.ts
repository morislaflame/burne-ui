import { useCallback, useMemo, useState } from "react";
 
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
 
import { useSkinVariant } from "@/skins/skinContext";

import { avatarHasLabel, resolveAvatarNickname, resolveAvatarSize, resolveAvatarVariant } from "./avatarAPI";
import { avatarRootAriaLabel, avatarRootRole } from "./avatarA11y";
import type { ImageStatus, UseAvatarRootStateProps } from "./avatarTypes";
 
export function useAvatarRootState({
  variant: variantProp,
  size: sizeProp,
  label,
  nickname,
  tooltip,
  children,
  role,
  "aria-label": ariaLabelProp,
}: UseAvatarRootStateProps) {
  const variant = resolveAvatarVariant(useSkinVariant(variantProp));
  const tooltipVariant = useSkinVariant(tooltip?.variant ?? "default");
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
 
  const isCompound = useMemo(() => hasCompoundChildren(children), [children]);
  const hasLabel = avatarHasLabel(label);
  const nick = resolveAvatarNickname(nickname);
  const rootRole = avatarRootRole(role);
  const ariaLabel = avatarRootAriaLabel(ariaLabelProp, label);

  const tooltipView = nick
    ? {
        size: tooltip?.size ?? "base",
        variant: tooltipVariant,
        status: tooltip?.status ?? "default",
        side: tooltip?.side ?? "top",
        content: nick,
      }
    : null;

  return {
    variant,
    size,
    ctx,
    isCompound,
    hasLabel,
    rootRole,
    ariaLabel,
    tooltip: tooltipView,
  };
}
 