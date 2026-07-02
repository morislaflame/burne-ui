import { useId, useMemo } from "react";

import {
  messageBannerSizePreset,
  resolveMessageBannerSize,
} from "@/components/core/utils/messageBannerSize";

import { resolveToastGridSlots } from "./toastAPI";
import {
  resolveToastLiveRole,
} from "./toastA11y";
import type { ToastItemContextValue, UseToastRootStateProps } from "./toastTypes";

export function useToastRootState({
  status = "default",
  size: sizeProp,
  title,
  description,
  action,
  isLoading = false,
  onClose,
  children,
}: UseToastRootStateProps) {
  const autoId = useId();
  const titleId = `${autoId}-title`;
  const descriptionId = `${autoId}-description`;
  const isCompound = Boolean(children);
  const size = resolveMessageBannerSize(sizeProp);
  const sizePreset = messageBannerSizePreset(size);

  const gridSlots = useMemo(
    () =>
      resolveToastGridSlots(
        status,
        title,
        description,
        action,
        onClose,
        isLoading,
        isCompound,
        children,
      ),
    [action, children, description, isCompound, isLoading, onClose, status, title],
  );

  const liveRole = resolveToastLiveRole(status);

  const itemCtx: ToastItemContextValue = useMemo(
    () => ({
      status,
      size,
      sizePreset,
      titleId,
      descriptionId,
      isLoading,
      dismiss: onClose ?? (() => {}),
      gridSlots,
    }),
    [descriptionId, gridSlots, isLoading, onClose, size, sizePreset, status, titleId],
  );

  return {
    isCompound,
    liveRole,
    titleId,
    size,
    itemCtx,
    gridSlots,
  };
}
