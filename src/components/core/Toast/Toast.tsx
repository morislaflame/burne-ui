import { forwardRef, useCallback, useMemo, useRef, type ForwardedRef } from "react";

import { createGlossInteractiveRefCallback, useGlossInteractiveHandlers } from "@/components/core/utils/glossInteractiveMotion";
import { useMotionPart } from "@/components/core/utils/slotMotion";

import "@/components/core/utils/glossInteractive.css";

import { toastFallbackAriaLabel } from "./toastA11y";
import {
  ToastClassNamesProvider,
  ToastItemProvider,
  ToastMotionProvider,
  useOptionalToastMotionScope,
  useToastClassNames,
} from "./toastContext";
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
  ToastMotion,
  ToastLifecycleMotion,
  ToastPartMotion,
} from "./toastTypes";

export { ToastProviderRoot } from "./toastProvider";

export const ToastRoot = forwardRef<HTMLDivElement, ToastProps>(function ToastRoot(
  { motion, motionController, motionState, motionPayload, playInitialState, ...props },
  ref,
) {
  const parentScope = useOptionalToastMotionScope();
  if (parentScope) {
    return <ToastRootInner {...props} forwardedRef={ref} registerRoot={false} />;
  }
  return (
    <ToastMotionProvider motion={motion} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
      <ToastRootInner {...props} forwardedRef={ref} registerRoot />
    </ToastMotionProvider>
  );
});

ToastRoot.displayName = "ToastRoot";

function ToastRootInner({
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
  registerRoot,
  forwardedRef,
  ...rest
}: Omit<ToastProps, "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"> & {
  registerRoot: boolean;
  forwardedRef?: ForwardedRef<HTMLDivElement>;
}) {
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
  const scope = useOptionalToastMotionScope();
  const { setRef: setRootPartRef } = useMotionPart<HTMLDivElement>({
    scope: registerRoot ? scope : null,
    slot: "root",
  });

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, isGloss),
    [isGloss],
  );

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      bindGlossRef(node);
      rootRef.current = node;
      setRootPartRef(node);
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [bindGlossRef, forwardedRef, setRootPartRef],
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
}

export {
  ToastIndicator,
  ToastMessage,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
};
