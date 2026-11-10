import { forwardRef, useCallback, useMemo, useRef, type ForwardedRef } from "react";
 
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  mergeMotionPointerHandlers,
  useMotionPart,
  useMotionPointerPhases,
} from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { usesKitElevation } from "@/skins/resolveVariantVisual";
import { mergeSkinSurfaceStyle, useSkinRegistryRevision, useSkinSurfaceStyle, useSkinVariant } from "@/skins/skinContext";
 
import { resolveToastMotionDefaults } from "./toastMotionDefaults";
import { toastFallbackAriaLabel } from "./toastA11y";
import {
  ToastClassNamesProvider,
  ToastItemProvider,
  ToastMotionProvider,
  useOptionalToastMotionScope,
} from "./toastContext";
import { ToastAction, ToastClose, ToastContent, ToastDescription, ToastIndicator, ToastMessage, ToastSimpleBody, ToastTitle } from "./toastParts";
import { TOAST_SHADOW_SIZE, toastRootClass } from "./toastStyles";
import type { ToastProps } from "./toastTypes";
import { KIT_TOAST_VARIANTS } from "./toastTypes";
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
 
export const ToastRoot = forwardRef<HTMLDivElement, ToastProps>(function ToastRoot(
  { motion, motionController, motionState, motionPayload, playInitialState, variant: variantProp, ...props },
  ref,
) {
  const parentScope = useOptionalToastMotionScope();
  const variant = useSkinVariant(variantProp);
  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(() => {
    void skinRevision;
    return resolveToastMotionDefaults(variant);
  }, [skinRevision, variant]);
  if (parentScope) {
    return <ToastRootInner {...props} variant={variant} forwardedRef={ref} registerRoot={false} />;
  }
  return (
    <ToastMotionProvider
      motion={motion}
      defaults={motionDefaults}
      params={{ shadowSize: TOAST_SHADOW_SIZE }}
      controller={motionController}
      motionState={motionState}
      motionPayload={motionPayload}
      playInitialState={playInitialState}
    >
      <ToastRootInner {...props} variant={variant} forwardedRef={ref} registerRoot />
    </ToastMotionProvider>
  );
});
 
ToastRoot.displayName = "ToastRoot";
 
function ToastRootInner({
  status = "default",
  variant: variantProp,
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
  const variant = useSkinVariant(variantProp);
  const surfaceStyle = useSkinSurfaceStyle(variant);
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
 
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scope = useOptionalToastMotionScope();
  const kitSurface = usesKitElevation(variant, KIT_TOAST_VARIANTS);
  const { setRef: setRootPartRef } = useMotionPart<HTMLDivElement>({
    scope: registerRoot ? scope : null,
    slot: "root",
  });
  const secondLevelLift = useSecondLevelShadow(rootRef, kitSurface, {
    shadowSize: TOAST_SHADOW_SIZE,
    interactive: false,
  });
  const motionPointer = useMotionPointerPhases<HTMLDivElement>({
    enabled: kitSurface && scope != null,
    targetRef: rootRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onHoverIn: (el) => {
      if (!scope) return;
      const value = scope.resolve("root", "hoverIn");
      if (value === undefined) return;
      scope.play("root", "hoverIn", { el });
    },
    onHoverOut: (el) => {
      if (!scope) return;
      const value = scope.resolve("root", "hoverOut");
      if (value === undefined) return;
      scope.play("root", "hoverOut", { el });
    },
  });
  const pointerHandlers = useMemo(
    () =>
      mergeMotionPointerHandlers(
        onPointerOverProp,
        onPointerOutProp,
        motionPointer.onPointerOver,
        motionPointer.onPointerOut,
      ),
    [motionPointer.onPointerOut, motionPointer.onPointerOver, onPointerOutProp, onPointerOverProp],
  );
 
  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      setRootPartRef(node);
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef, setRootPartRef],
  );
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
            slotClass: classNames?.root,
            className,
            liftClass: kitSurface ? secondLevelLift.motionClass : undefined,
          })}
          {...domRest}
          {...pointerHandlers}
          style={mergeSkinSurfaceStyle(surfaceStyle, domRest.style)}
          {...dataVariantProps({ size: state.size, variant, status })}
          data-state="open"
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
 