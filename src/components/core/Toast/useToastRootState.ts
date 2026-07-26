import { useId, useMemo } from "react";

import { messageBannerSizePreset, resolveMessageBannerSize } from "@/components/core/utils/sizeLayout";

import { resolveToastGridSlots } from "./toastAPI";
import type { ToastItemContextValue, UseToastRootStateProps } from "./toastTypes";

export function useToastRootState({
  status = "default",
  size: sizeProp,
  title,
  description,
  action,
  loading = false,
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
        loading,
        isCompound,
        children,
      ),
    [action, children, description, isCompound, loading, onClose, status, title],
  );

  const itemCtx: ToastItemContextValue = useMemo(
    () => ({
      status,
      size,
      sizePreset,
      titleId,
      descriptionId,
      loading,
      dismiss: onClose ?? (() => {}),
      gridSlots,
    }),
    [descriptionId, gridSlots, loading, onClose, size, sizePreset, status, titleId],
  );

  return {
    isCompound,
    titleId,
    size,
    itemCtx,
    gridSlots,
  };
}
