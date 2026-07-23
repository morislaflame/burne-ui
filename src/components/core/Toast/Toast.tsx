import { forwardRef, useCallback, useMemo, useRef } from "react";

import { createGlossInteractiveRefCallback, useGlossInteractiveHandlers } from "@/components/core/utils/glossInteractiveMotion";

import "@/components/core/utils/glossInteractive.css";

import { toastFallbackAriaLabel } from "./toastA11y";
import { ToastClassNamesProvider, ToastItemProvider, useToastClassNames } from "./toastContext";
import { ToastAction, ToastClose, ToastContent, ToastDescription, ToastIndicator, ToastMessage, ToastSimpleBody, ToastTitle } from "./toastParts";
import { toastRootClass } from "./toastStyles";
import type { ToastProps } from "./toastTypes";
import { useToastRootState } from "./useToastRootState";

export type {
  ToastClassNames,
  ToastStatus,
  ToastVariant,
  ToastPlacement,
  ToastProviderProps,
  ToastProps,
  ToastIndicatorProps,
  ToastMessageProps,
  ToastContentProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastActionProps,
  ToastCloseProps,
  AddToastOpts,
  PromiseToastOpts,
  ToastContextValue,
} from "./toastTypes";

export { ToastProviderRoot } from "./toastProvider";

export const ToastRoot = forwardRef<HTMLDivElement, ToastProps>(function ToastRoot(
  {
    status = "default",
    variant = "default",
    size = "base",
    title,
    description,
    action,
    loading = false,
    onClose,
    className,
    classNames,
    children,
    onPointerOver: onPointerOverProp,
    onPointerOut: onPointerOutProp,
    ...rest
  },
  ref,
) {
  const state = useToastRootState({
    status,
    size,
    title,
    description,
    action,
    loading,
    onClose,
    children,
  });

  const isGloss = variant === "gloss";
  const rootRef = useRef<HTMLDivElement | null>(null);

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, isGloss),
    [isGloss],
  );

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      bindGlossRef(node);
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [bindGlossRef, ref],
  );

  const glossPointerHandlers = useGlossInteractiveHandlers(rootRef, isGloss);
  const slotClassNames = useToastClassNames();
  const hasTitle = state.gridSlots.hasTitle;
  const {
    "aria-label": restAriaLabel,
    "aria-labelledby": _restLabelledBy,
    ...domRest
  } = rest;
  const labelledBy = hasTitle ? state.titleId : undefined;
  const ariaLabel = hasTitle
    ? undefined
    : (restAriaLabel ?? toastFallbackAriaLabel(title, description));

  return (
    <ToastItemProvider value={state.itemCtx}>
      <ToastClassNamesProvider classNames={classNames}>
        <div
          ref={setRootRef}
          role="group"
          aria-labelledby={labelledBy}
          aria-label={ariaLabel}
          className={toastRootClass({
            variant,
            status,
            size: state.size,
            gridSlots: state.gridSlots,
            slotClass: slotClassNames.root,
            className,
          })}
          onPointerOver={(e) => {
            onPointerOverProp?.(e);
            if (e.defaultPrevented) return;
            if (isGloss) glossPointerHandlers.onPointerOver(e);
          }}
          onPointerOut={(e) => {
            onPointerOutProp?.(e);
            if (isGloss) glossPointerHandlers.onPointerOut(e);
          }}
          {...domRest}
        >
          {state.isCompound ? (
            children
          ) : (
            <ToastSimpleBody
              gridSlots={state.gridSlots}
              title={title}
              description={description}
              action={action}
              onClose={onClose}
            />
          )}
        </div>
      </ToastClassNamesProvider>
    </ToastItemProvider>
  );
});

ToastRoot.displayName = "ToastRoot";

export {
  ToastIndicator,
  ToastMessage,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
};
