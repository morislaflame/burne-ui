import { forwardRef, useMemo, type ForwardedRef, type HTMLAttributes, type ReactNode } from "react";
 
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { mergeMotionSlotMaps, useMotionPart } from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { cn } from "@/utils/cn";
import { useSkinRegistryRevision } from "@/skins/skinContext";
 
import { resolveDisclosureMotionDefaults } from "./disclosureAnimations";
import {
  DisclosureClassNamesProvider,
  DisclosureMotionProvider,
  DisclosureProvider,
  useDisclosureGroupContext,
  useDisclosureMotionScope,
} from "./disclosureContext";
import { DISCLOSURE_CARD_CLIP_CLASS, disclosureRootClass } from "./disclosureStyles";
import {
  DisclosureContent,
  DisclosureHandleInner,
  DisclosureTrigger,
  DisclosureIcon,
  DisclosureChevron,
} from "./disclosureParts";
import type { DisclosureProps } from "./disclosureTypes";
import { useDisclosureRootState } from "./useDisclosureRootState";
 
export type {
  DisclosureProps,
  DisclosureGroupProps,
  DisclosureTriggerProps,
  DisclosureHandleProps,
  DisclosureContentProps,
  DisclosureIconProps,
  DisclosureChevronProps,
  DisclosureVariant,
  DisclosureSize,
  DisclosureClassNames,
  DisclosureMotion,
  DisclosureLifecycleMotion,
  DisclosureTitleLiftMotion,
} from "./disclosureTypes";
 
export const DisclosureRoot = forwardRef<HTMLDivElement, DisclosureProps>(
  function DisclosureRoot(
    {
      children,
      className,
      classNames,
      open,
      defaultOpen,
      onOpenChange,
      value,
      variant,
      size,
      disabled,
      chevronPosition,
      dragHandle,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      ...rest
    },
    ref,
  ) {
    const groupCtx = useDisclosureGroupContext();
    const state = useDisclosureRootState({
      children,
      open,
      defaultOpen,
      onOpenChange,
      value,
      variant,
      size,
      disabled,
      chevronPosition,
      dragHandle,
    });
 
    const mergedMotion = useMemo(
      () => mergeMotionSlotMaps(groupCtx?.motion, motion),
      [groupCtx?.motion, motion],
    );
    const skinRevision = useSkinRegistryRevision();
    const defaults = useMemo(() => {
      void skinRevision;
      return resolveDisclosureMotionDefaults(state.variant);
    }, [skinRevision, state.variant]);
    const elevationCard = state.variant === "card" && !state.groupedCardShell;
 
    return (
      <DisclosureProvider value={state.contextValue}>
        <DisclosureClassNamesProvider classNames={classNames}>
          <DisclosureMotionProvider
            motion={mergedMotion}
            defaults={defaults}
            params={{ hasHoverShadow: true, liftScale: 1 }}
            controller={motionController}
            motionState={motionState}
            motionPayload={motionPayload}
            playInitialState={playInitialState}
          >
          <DisclosureRootSurface
            forwardedRef={ref}
            elevationCard={elevationCard}
            className={disclosureRootClass({
              variant: state.variant,
              groupedCardShell: state.groupedCardShell,
              className,
              slotClass: classNames?.root,
            })}
            rest={rest}
            size={state.contextValue.size}
            variant={state.variant}
          >
            {state.orderedChildren}
          </DisclosureRootSurface>
          </DisclosureMotionProvider>
        </DisclosureClassNamesProvider>
      </DisclosureProvider>
    );
  },
);
 
DisclosureRoot.displayName = "Disclosure";

function DisclosureRootSurface({
  forwardedRef,
  elevationCard,
  className,
  rest,
  size,
  variant,
  children,
}: {
  forwardedRef: ForwardedRef<HTMLDivElement>;
  elevationCard: boolean;
  className: string;
  rest: HTMLAttributes<HTMLDivElement>;
  size: string;
  variant: string;
  children: ReactNode;
}) {
  const { onPointerOver, onPointerOut, ...domRest } = rest;
  const scope = useDisclosureMotionScope();
  const customHover = scope.getRootMotion()?.root;
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "root",
    forwardedRef,
    pointerPhases:
      elevationCard || customHover?.hoverIn != null || customHover?.hoverOut != null,
    onPointerOver,
    onPointerOut,
  });
  const shadow = useSecondLevelShadow(part.targetRef, elevationCard, {
    shadowSize: "none",
    liftScale: 1,
    interactive: false,
    killMotionOnUnmount: false,
  });

  return (
    <div
      ref={part.setRef}
      className={cn(className, shadow.motionClass)}
      {...domRest}
      {...part.pointerHandlers}
      {...dataVariantProps({ size, variant })}
    >
      {elevationCard ? <div className={DISCLOSURE_CARD_CLIP_CLASS}>{children}</div> : children}
    </div>
  );
}
 
export {
  DisclosureTrigger,
  DisclosureHandleInner,
  DisclosureContent,
  DisclosureIcon,
  DisclosureChevron,
};
 