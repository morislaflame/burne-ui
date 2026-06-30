import { useId, useMemo } from "react";

import { resolveToastGridSlots } from "./toastAPI";
import {
  resolveToastLiveRole,
} from "./toastA11y";
import type { ToastItemContextValue, UseToastRootStateProps } from "./toastTypes";

export function useToastRootState({
  status = "default",
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
      titleId,
      descriptionId,
      isLoading,
      dismiss: onClose ?? (() => {}),
      gridSlots,
    }),
    [descriptionId, gridSlots, isLoading, onClose, status, titleId],
  );

  return {
    isCompound,
    liveRole,
    titleId,
    itemCtx,
    gridSlots,
  };
}
